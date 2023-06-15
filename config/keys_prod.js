// If you want to use this app in a more secure manner you'll need to set up your .env keys here:
module.exports = {
  user: process.env.user, // Email you want to use in this SMTP server
  password: process.env.password, // Your e-mail password
  type: process.env.type, // defining the authentication type
  // Go to --> https://console.cloud.google.com and create a new project, then credentials
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  // Go to --> https://developers.google.com/oauthplayground then enter your creds and create the following tokens.
  refreshToken: process.env.refreshToken,
  accessToken: process.env.accessToken
};
