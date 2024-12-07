import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  createDefaultDiographJson,
  createDefaultRoomJson,
} from "./defaultDiograph.mjs";

export const handler = async (event) => {
  console.log("event", event);
  // Extract the email from the user sign-up request
  const email = event.request.userAttributes.email;
  const cognitoIdentityId = event.request.userAttributes.sub;

  const roomS3Address = `s3://diory-mobile-proto/users/${cognitoIdentityId}/`;

  // Upload file with given contents to S3
  const s3 = new S3Client({ region: event.region });

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: "diory-mobile-proto",
        Key: `users/${cognitoIdentityId}/diograph.json`,
        Body: createDefaultDiographJson(email),
      })
    );

    await s3.send(
      new PutObjectCommand({
        Bucket: "diory-mobile-proto",
        Key: `users/${cognitoIdentityId}/room.json`,
        Body: createDefaultRoomJson(roomS3Address),
      })
    );
  } catch (error) {
    console.error("Error uploading files to S3:", error);
  }

  // Return the modified event
  return event;
};
