import { Controller, Get, Param, Query, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { SessionData } from '../@types/session-data';
import { IDiory } from '@diograph/diograph/types';
import { uploadDefaultFiles } from './initNativeRoom.utils';
import { getRoomConfig, getClients, getRoom } from './room.util';

@Controller('room')
export class RoomsController {
  @Get('native/init')
  async initNativeRoom(@Session() session: SessionData) {
    const roomId = 'native';
    const email = session.email;
    const roomList = getRoomConfig(session);
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
    const room = await getRoom(roomId, session);
    return room.diograph.diograph;
  }

  @Get('content')
  async readContentAction(
    @Res() res: Response,
    @Query() query: Record<string, string>,
    @Session() session: SessionData,
  ) {
    let response: ArrayBuffer;
    const roomConfigList = getRoomConfig(session);
    for (const roomConfig of roomConfigList) {
      try {
        const room = await getRoom(roomConfig.id, session);
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
    const roomConfigList = getRoomConfig(session);
    for (const roomConfig of roomConfigList) {
      const room = await getRoom(roomConfig.id, session);
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
    return getRoomConfig(session);
  }
}
