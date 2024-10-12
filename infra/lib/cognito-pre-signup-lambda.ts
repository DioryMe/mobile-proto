export const handler = async (event: any) => {
  // Extract the email from the user sign-up request
  const email = event.request.userAttributes.email;

  // If the email matches the pattern, auto-confirm the user
  const testEmailPattern = /^test$/;

  if (testEmailPattern.test(email)) {
    event.response.autoConfirmUser = true; // Automatically confirm the user
    event.response.autoVerifyEmail = true; // Automatically verify the user's email
  }

  // Return the modified event
  return event;
};
