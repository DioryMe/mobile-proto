import { randomUUID } from "crypto";

export const createDefaultDiographJson = async (email) => {
  const id = randomUUID();
  return {
    "/": {
      id,
      text: email,
    },
  };
};

export const createDefaultRoomJson = async (roomS3Address) => {
  return {
    connections: [
      {
        address: `${roomS3Address}/Diory Content`,
        contentClientType: "S3Client",
        contentUrls: {},
        diograph: {},
      },
    ],
  };
};
