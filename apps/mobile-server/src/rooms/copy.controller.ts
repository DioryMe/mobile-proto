import { Controller, Post, Body, Session } from '@nestjs/common';
import { SessionData } from '../@types/session-data';
import chalk from 'chalk';

@Controller('copy')
export class CopyController {
  @Post()
  async copyDiory(@Body() body: { fromDiory: string; toDiory: string }) {
    const { sourceRoomId, copyDioryId, parentDioryId, destinationRoomId } =
      body;
    // const { fromRoomId, dioryId, destinationDioryId, destinationRoomId } = body;

    // Validate and get source diory
    const fromDioryRoomId = sourceRoomId;
    const fromDioryId = copyDioryId;
    const fromRoom = await getRoom(fromDioryRoomId);
    const copyDiory = fromRoom.diograph.getDiory({
      id: fromDioryId,
    });

    // Validate destination diory
    const toDioryRoomId = destinationRoomId;
    const toDioryId = parentDioryId;
    const toRoom = await getRoom(toDioryRoomId);
    const parentDiory = toRoom.diograph.getDiory({
      id: toDioryId,
    });

    const diory = copyDiory;
    const sourceRoom = fromRoom;
    const destinationRoom = toRoom;
    // const parentDiory = parentDiory

    // Remove links as they don't point to correct diories in the destination room
    if (diory.links) {
      diory.links = [] as any;
    }

    destinationRoom.diograph.addDioryAndLink(diory, parentDiory);

    const contentUrl = diory.data && diory.data[0].contentUrl;
    if (contentUrl) {
      const sourceFileContent = await sourceRoom.readContent(contentUrl);
      await destinationRoom.addContent(sourceFileContent, contentUrl);
    }

    await destinationRoom.saveRoom();

    return {
      message: 'Diory copied successfully',
      dioryId: diory.id,
      parentDioryId: parentDiory.id,
    };
  }
}
