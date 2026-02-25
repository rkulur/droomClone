import jwt from "jsonwebtoken";
import { AccessTokenPayload } from "../interfaces";
import { UserType } from "../models/user.model";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
};

export const createAccessToken = (user: Pick<UserType, "email" | "role"> & { _id: unknown }) => {
  const payload: AccessTokenPayload = {
    sub: String(user._id),
    email: user.email,
    role: user.role,
  };

  const expiresIn = (process.env.JWT_ACCESS_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"];
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, getJwtSecret());

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.sub !== "string" ||
    typeof decoded.email !== "string" ||
    !["user", "dealer", "admin"].includes(String(decoded.role))
  ) {
    throw new Error("Invalid access token payload");
  }

  return decoded as AccessTokenPayload;
};
