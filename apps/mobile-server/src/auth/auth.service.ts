import {
  CognitoIdentityClient,
  GetIdCommand,
  GetCredentialsForIdentityCommand,
} from '@aws-sdk/client-cognito-identity';

export const getCredentials = async (identityToken: string) => {
  const cognitoIdentityClient = new CognitoIdentityClient({
    region: process.env.AWS_REGION as string,
  });

  // Get the identity ID
  const getIdCommand = new GetIdCommand({
    IdentityPoolId: process.env.AWS_IDENTITY_POOL_ID as string,
    Logins: {
      [process.env.AWS_USER_POOL_ID as string]: identityToken,
    },
  });

  const identityResponse = await cognitoIdentityClient.send(getIdCommand);
  const identityId = identityResponse.IdentityId;

  // Get the credentials for the identity
  const getCredentialsCommand = new GetCredentialsForIdentityCommand({
    IdentityId: identityId,
    Logins: {
      [process.env.AWS_USER_POOL_ID as string]: identityToken,
    },
  });

  const credentialsResponse = await cognitoIdentityClient.send(
    getCredentialsCommand,
  );
  const credentials = credentialsResponse.Credentials;

  if (!credentials) {
    throw new Error('Credentials not found!');
  }

  return { credentials, identityId };
};
