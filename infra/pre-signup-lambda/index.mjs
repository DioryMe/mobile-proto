import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  createDefaultDiographJson,
  createDefaultRoomJson,
} from "./defaultDiograph.mjs";

async function getUserSubByEmail(userPoolId, email, client) {
  try {
    // List users in the user pool with the specified email
    const command = new AdminGetUserCommand({
      UserPoolId: userPoolId,
      Username: email, // Use the email as the username
    });

    const response = await client.send(command);

    // Extract the 'sub' attribute from the response
    const sub = response.UserAttributes.find(
      (attr) => attr.Name === "sub"
    ).Value;
    return sub;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export const handler = async (event) => {
  console.log("event", event);
  // Extract the email from the user sign-up request
  const email = event.request.userAttributes.email;

  // Initialize the Cognito Identity Provider client
  const cognitoClient = new CognitoIdentityProviderClient({
    region: event.region,
  });

  const userPoolId = event.userPoolId;
  const cognitoIdentityId = await getUserSubByEmail(
    userPoolId,
    email,
    cognitoClient
  );
  // .then((sub) => console.log("User sub:", sub))
  // .catch((err) => console.error("Error:", err));

  // const cognitoIdentityId = "123";
  const roomS3Address = `s3://diory-mobile-proto/users/${cognitoIdentityId}/`;

  // If the email matches the pattern, auto-confirm the user
  const testEmailPattern = /^test-.*@example.com$/;

  if (testEmailPattern.test(email)) {
    event.response.autoConfirmUser = true; // Automatically confirm the user
    event.response.autoVerifyEmail = true; // Automatically verify the user's email
  }

  // Upload file with given contents to S3
  const s3 = new S3Client({ region: event.region });

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
