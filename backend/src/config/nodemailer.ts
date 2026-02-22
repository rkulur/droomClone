import nodemailer from "nodemailer";
import { initOAuth2Client } from "./oAuth";

export const createTransporter = async () => {
  const oAuth2Client = initOAuth2Client();
  const accessToken = await oAuth2Client.getAccessToken();
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.USER_MAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken.token!,
    },
    logger: true,
    debug: true,
  });
};
