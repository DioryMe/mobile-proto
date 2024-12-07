import {
  createDefaultDiographJson,
  createDefaultRoomJson,
} from "./defaultDiograph.mjs";

export const handler = async (event) => {
  console.log("event", event.request);
  // Extract the email from the user sign-up request
  const email = event.request.userAttributes.email;
  const cognitoIdentityId = event.request.userAttributes.sub;
  const roomS3Address = `s3://diory-mobile-proto/users/${cognitoIdentityId}/`;

  // If the email matches the pattern, auto-confirm the user
  const testEmailPattern = /^test-.*@example.com$/;

  if (testEmailPattern.test(email)) {
    event.response.autoConfirmUser = true; // Automatically confirm the user
    event.response.autoVerifyEmail = true; // Automatically verify the user's email
  }

  // Upload file with given contents to S3
  const s3 = new S3Client({ region: event.request.region });

  await s3.send(
    new PutObjectCommand({
      Bucket: "diory-mobile-proto",
      Key: `${cognitoIdentityId}/diograph.json`,
      Body: createDefaultDiographJson(email),
    })
  );

  await s3.send(
    new PutObjectCommand({
      Bucket: "diory-mobile-proto",
      Key: `${cognitoIdentityId}/room.json`,
      Body: createDefaultRoomJson(roomS3Address),
    })
  );

  // Return the modified event
  return event;
};
