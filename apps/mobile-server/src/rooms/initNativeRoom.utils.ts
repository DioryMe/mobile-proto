import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { RoomConfigData } from '@diograph/diograph/types';
import { S3ClientCredentials } from '@diograph/s3-client';

export const uploadDefaultFiles = async (
  roomConfig: RoomConfigData,
  cognitoIdentityId: string,
  email: string,
  credentials: S3ClientCredentials,
) => {
  const { address } = roomConfig;
  const s3 = new S3Client({ region: process.env.AWS_REGION, credentials });

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: 'diory-mobile-proto',
        Key: `users/${cognitoIdentityId}/diograph.json`,
        Body: createDefaultDiographJson(email),
      }),
    );

    await s3.send(
      new PutObjectCommand({
        Bucket: 'diory-mobile-proto',
        Key: `users/${cognitoIdentityId}/room.json`,
        Body: createDefaultRoomJson(address),
      }),
    );
  } catch (error) {
    console.error('Error uploading files to S3:', error);
  }
};

// TODO: Generate with @diograph library

export const createDefaultDiographJson = (email: string) => {
  // const id = randomUUID();
  const diographJson = {
    '/': {
      id: '/',
      text: email,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    },
  };
  return JSON.stringify(diographJson);
};

export const createDefaultRoomJson = (roomS3Address: string) => {
  const roomJson = {
    connections: [
      {
        address: `${roomS3Address}/Diory Content`,
        contentClientType: 'S3Client',
        contentUrls: {},
        diograph: {},
      },
    ],
  };

  return JSON.stringify(roomJson);
};
