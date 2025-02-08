import { constructAndLoadRoom } from '@diograph/diograph';
import { S3Client } from '@diograph/s3-client';
import { ConnectionClientList } from '@diograph/diograph/types';
import { LocalClient } from '@diograph/local-client';
import { HttpClient } from '@diograph/http-client';
import { SessionData } from '../@types/session-data';

/**
 * Retrieves the room configuration based on the session data.
 *
 * @param session - The session data containing user information.
 * @returns An array of room configurations.
 */
export const getRoomConfig = (session: SessionData) => {
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

/**
 * Constructs a list of available clients based on the provided credentials.
 *
 * @param credentials - AWS credentials for S3Client.
 * @returns A list of connection clients.
 */
export const getClients = (credentials: any): ConnectionClientList => {
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
};

/**
 * Retrieves and constructs a room based on the room ID and session data.
 *
 * @param roomId - The ID of the room to retrieve.
 * @param session - The session data containing user information.
 * @returns The constructed room.
 * @throws Error if the room is not found.
 */
export const getRoom = async (roomId: string, session: SessionData) => {
  const roomList = getRoomConfig(session);
  const roomConfig = roomList.find((room) => room.id === roomId);

  if (!roomConfig) {
    throw new Error('Room not found');
  }

  const { address, clientType } = roomConfig;
  const clients = getClients(
    session.awsCredentials && JSON.parse(session.awsCredentials),
  );
  const room = await constructAndLoadRoom(address, clientType, clients);
  return room;
};
