const isProduction = process.env["IS_PRODUCTION"] === "true";

const authConfig = {
  secret: process.env["JWT_SECRET"] as string,
  expiresIn: process.env["JWT_EXPIRE_IN"],
  refreshTokenExpiryTime: 3600,
};

const appConfig = {
  fromEmail: process.env["FROM_EMAIL"],
  fromName: process.env["FROM_NAME"],
};

const gameConfig = {
  gameProviderAPIURL: process.env["GAME_PROVIDER_API_URL"],
};

export { isProduction, authConfig, appConfig, gameConfig };
