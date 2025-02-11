import {
  Controller,
  Post,
  Body,
  Session,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { SessionData } from '../@types/session-data';
import { getRoom } from './room.util';
import { generateDiory } from '@diograph/file-generator';
import { readFile, unlink } from 'fs/promises';
import { FilesInterceptor } from '@nestjs/platform-express';
import path, { extname } from 'path';
import { diskStorage } from 'multer';

const TEMP_DISK_FOLDER = '/tmp';

@Controller('import')
export class ImportController {
  @Post()
  @UseInterceptors(
    FilesInterceptor('formFiles', 99, {
      storage: diskStorage({
        destination: TEMP_DISK_FOLDER,
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  )
  async importDiory(
    @Session() session: SessionData,
    @Body()
    body: {
      parentDioryId: string;
      destinationRoomId: string;
      diographOnly: boolean;
    },
    @UploadedFiles() formFiles: Express.Multer.File[],
  ) {
    const { parentDioryId, destinationRoomId, diographOnly } = body;

    // Validate destination diory
    const toDioryRoomId = destinationRoomId;
    const toDioryId = parentDioryId;
    const toRoom = await getRoom(toDioryRoomId, session);
    const parentDiory = toRoom.diograph.getDiory({
      id: toDioryId,
    });

    const destinationRoom = toRoom;

    const results = [];

    for (const formFile of formFiles) {
      const result = await this.handleFormFile(
        formFile,
        destinationRoom,
        parentDiory,
        diographOnly,
      );
      results.push(result);
    }

    await destinationRoom.saveRoom();

    return {
      message: 'Diory imported successfully',
      results,
    };
  }

  private async handleFormFile(
    formFile: Express.Multer.File,
    destinationRoom: any,
    parentDiory: any,
    diographOnly: boolean,
  ) {
    const filePath = path.join(TEMP_DISK_FOLDER, formFile.filename);

    let diory;
    try {
      diory = await generateDiory('', filePath);
    } catch (error: any) {
      if (/^FFMPEG_PATH not defined/.test(error.message)) {
        console.log(
          `Folder includes a video file which requires FFMPEG for diory generation. \nPlease use \`dcli config set FFMPEG_PATH [path to ffmpeg]\` to set it.`,
        );
        throw new Error('FFMPEG not found');
      }
      console.log(error.message);
      throw error;
    }

    destinationRoom.diograph.addDioryAndLink(diory, parentDiory);

    const contentUrl = diory.data && diory.data[0].contentUrl;
    if (!diographOnly) {
      const sourceFileContent = await readFile(filePath);
      await destinationRoom.addContent(sourceFileContent, contentUrl);
    }

    await unlink(filePath);

    return {
      dioryId: diory.id,
      parentDioryId: parentDiory.id,
    };
  }
}
