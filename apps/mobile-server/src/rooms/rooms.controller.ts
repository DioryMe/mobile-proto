import { constructAndLoadRoom } from '@diograph/diograph';
import { S3Client } from '@diograph/s3-client';
import { Controller, Get, Param, Query, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { SessionData } from '../@types/session-data';
import { ConnectionClientList, IDiory } from '@diograph/diograph/types';
import { LocalClient } from '@diograph/local-client';
import { HttpClient } from '@diograph/http-client';
import { uploadDefaultFiles } from './initNativeRoom.utils';

@Controller('room')
export class RoomsController {
  private getRoomConfig = (session: SessionData) => {
    return [
      {
        id: 'demo',
        name: 'Demo',
        address: `http://diory-demo-content.surge.sh`,
        clientType: 'HttpClient',
      },
      {
        id: 'native',
        name: 'Native',
        address: `s3://${process.env.AWS_BUCKET}/users/${session.identityId}`,
        clientType: 'S3Client',
      },
    ];
  };

  private getClients(credentials: any): ConnectionClientList {
    return {
      HttpClient: {
        clientConstructor: HttpClient,
      },
      S3Client: {
        clientConstructor: S3Client,
        credentials: {
          region: process.env.AWS_REGION,
          credentials,
        },
      },
      // LocalClient is available just for local experimenting with temporary rooms
      LocalClient: {
        clientConstructor: LocalClient,
      },
    };
  }

  private async getRoom(roomId: string, session: SessionData) {
    const roomList = this.getRoomConfig(session);
    const roomConfig = roomList.find((room) => room.id === roomId);

    if (!roomConfig) {
      throw new Error('Room not found');
    }

    const { address, clientType } = roomConfig;
    const clients = this.getClients(
      session.awsCredentials && JSON.parse(session.awsCredentials),
    );
    const room = await constructAndLoadRoom(address, clientType, clients);
    return room;
  }

  @Get('native/init')
  async initNativeRoom(@Session() session: SessionData) {
    const roomId = 'native';
    const email = session.email;
    const roomList = this.getRoomConfig(session);
    const roomConfig = roomList.find((room) => room.id === roomId);

    if (
      !roomConfig ||
      !session.identityId ||
      !email ||
      !session.awsCredentials
    ) {
      console.log(
        'props',
        roomId,
        session.identityId,
        email,
        session.awsCredentials,
      );
      throw new Error('Native room not found');
    }

    await uploadDefaultFiles(
      roomConfig,
      session.identityId,
      email,
      JSON.parse(session.awsCredentials),
    );

    return { message: 'OK' };
  }

  @Get(':roomId/diograph')
  async getRoomDiograph(
    @Session() session: SessionData,
    @Param('roomId') roomId: string,
  ) {
    const room = await this.getRoom(roomId, session);
    return room.diograph.diograph;
  }

  @Get('content')
  async readContentAction(
    @Res() res: Response,
    @Query() query: Record<string, string>,
    @Session() session: SessionData,
  ) {
    let response: ArrayBuffer;
    const roomConfigList = this.getRoomConfig(session);
    for (const roomConfig of roomConfigList) {
      try {
        const room = await this.getRoom(roomConfig.id, session);
        response = await room.readContent(query.CID);

        res
          .status(200)
          .header('Content-Type', query.mime)
          .send(Buffer.from(response));
        return;
      } catch (error) {
        continue;
      }
    }

    throw new Error('No content found');
  }

  @Get('thumbnail')
  async getThumbnailAction(
    @Res() res: Response,
    @Session() session: SessionData,
  ) {
    let diory: IDiory;
    const roomConfigList = this.getRoomConfig(session);
    for (const roomConfig of roomConfigList) {
      const room = await this.getRoom(roomConfig.id, session);
      try {
        diory = await room.diograph.getDiory({
          id: '5456c2c3-4a69-4d80-bd2f-caa9945cff71',
        });
      } catch (error) {
        continue;
      }

      const html = `<img src="${diory.image}">`;

      res.status(200).header('Content-Type', 'text/html').send(html);
      return;
    }

    throw new Error('No thumbnail found');
  }

  @Get('list')
  async getListAction(@Session() session: SessionData) {
    return this.getRoomConfig(session);
  }
}
