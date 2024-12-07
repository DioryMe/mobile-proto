import { randomUUID } from "crypto";

// TODO: Generate with @diograph library

export const createDefaultDiographJson = (email) => {
  // const id = randomUUID();
  const diographJson = {
    "/": {
      id: "/",
      text: email,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
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
