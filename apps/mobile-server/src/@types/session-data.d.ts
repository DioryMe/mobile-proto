export interface SessionData {
  userId?: string; // sub or cognito:username (a09cf90c-c011-70db-90a1-ece51abba9a4)
  email?: string; // user email (example@example.com)
  username?: string; // username (20ac498c-f0c1-70e7-557e-8dbe4a2306fe)
  identityId?: string; // AWS cognito identity id of the identity pool (eu-north-1:08d7a66d-ec6b-c717-c71a-2f8b54f33451)
  identityToken: string | null;
  accessToken: string;
  awsCredentials?: string; // AWS cognito identity Credentials stringified
}
