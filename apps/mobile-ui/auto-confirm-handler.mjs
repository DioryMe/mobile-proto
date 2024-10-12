// Code executed in lambda when users sign up
// - Pre sign-up Lambda trigger

export const handler = async (event) => {
  // Extract the email from the user sign-up request
  const email = event.request.userAttributes.email;

  // If the email matches the pattern, auto-confirm the user
  const testEmailPattern = /^*****************$/;

  if (testEmailPattern.test(email)) {
    event.response.autoConfirmUser = true; // Automatically confirm the user
    event.response.autoVerifyEmail = true; // Automatically verify the user's email
  }

  // Return the modified event
  return event;
};
