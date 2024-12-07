import { randomUUID } from "crypto";

export const createDefaultDiographJson = (email) => {
  const id = randomUUID();
  const diographJson = {
    "/": {
      id,
      text: email,
    },
  };
  return JSON.stringify(diographJson);
};

export const createDefaultRoomJson = (roomS3Address) => {
  const roomJson = {
    connections: [
      {
        address: `${roomS3Address}/Diory Content`,
        contentClientType: "S3Client",
        contentUrls: {},
        diograph: {},
      },
    ],
  };

  return JSON.stringify(roomJson);
};
