declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_REFRESH_TOKEN: string;
    USER_MAIL: string;
    JWT_SECRET: string;
    JWT_ACCESS_EXPIRES_IN?: string;
  }
}
