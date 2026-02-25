import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type mongoose from "mongoose";
import { LoginUserRequest, RegisterUserRequest } from "../interfaces";
import { OtpModel, type OtpType } from "../models/otp.model";
import { UserModel } from "../models/user.model";
import { createAccessToken } from "../services/auth.service";

type OtpVerificationTokenPayload = {
  otpId?: string;
  purpose?: string;
};

type OtpDoc = mongoose.HydratedDocument<OtpType>;

type OtpValidationResult =
  | { ok: true; otpDoc: OtpDoc }
  | {
      ok: false;
      status: number;
      response: { success: false; message: string };
    };

const validateOtpVerifiedToken = async (
  otpVerifiedToken: string,
  email: string,
): Promise<OtpValidationResult> => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return {
      ok: false,
      status: 500,
      response: { success: false, message: "Server configuration error" },
    };
  }

  let decoded: OtpVerificationTokenPayload;

  try {
    decoded = jwt.verify(otpVerifiedToken, secret) as OtpVerificationTokenPayload;
  } catch {
    return {
      ok: false,
      status: 400,
      response: {
        success: false,
        message: "Invalid or expired OTP verification token",
      },
    };
  }

  if (
    !decoded.otpId ||
    !decoded.purpose ||
    !["register", "login"].includes(decoded.purpose)
  ) {
    return {
      ok: false,
      status: 400,
      response: {
        success: false,
        message: "Invalid OTP verification token payload",
      },
    };
  }

  const otpDoc = (await OtpModel.findById(decoded.otpId)) as OtpDoc | null;

  if (!otpDoc) {
    return {
      ok: false,
      status: 400,
      response: { success: false, message: "OTP record not found" },
    };
  }

  if (otpDoc.expiresIn < new Date()) {
    return {
      ok: false,
      status: 400,
      response: { success: false, message: "OTP has expired" },
    };
  }

  if (otpDoc.email.toLowerCase() !== email.toLowerCase()) {
    return {
      ok: false,
      status: 400,
      response: {
        success: false,
        message: "OTP token does not match the provided email",
      },
    };
  }

  return { ok: true, otpDoc };
};

export const registerUser = async (
  req: Request<{}, {}, RegisterUserRequest>,
  res: Response,
) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    avatarUrl,
    otpVerifiedToken,
  } = req.body;

  if (!firstName || !email || !otpVerifiedToken) {
    return res.status(400).json({
      success: false,
      message: "firstName, email and otpVerifiedToken are required",
    });
  }

  const otpValidationResult = await validateOtpVerifiedToken(otpVerifiedToken, email);

  if (!otpValidationResult.ok) {
    return res
      .status(otpValidationResult.status)
      .json(otpValidationResult.response);
  }

  const { otpDoc } = otpValidationResult;

  if (otpDoc.phoneNumber && phoneNumber && otpDoc.phoneNumber !== phoneNumber) {
    return res.status(400).json({
      success: false,
      message: "OTP token does not match the provided phone number",
    });
  }

  const existingUser = await UserModel.findOne({
    $or: [{ email: email.toLowerCase() }, ...(phoneNumber ? [{ phoneNumber }] : [])],
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists with provided email or phone number",
    });
  }

  const user = await UserModel.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    avatarUrl,
    isEmailVerified: true,
    isPhoneVerified: Boolean(phoneNumber && otpDoc.phoneNumber === phoneNumber),
  });

  await OtpModel.deleteOne({ _id: otpDoc._id });
  const accessToken = createAccessToken(user);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
    accessToken,
  });
};

export const loginUser = async (
  req: Request<{}, {}, LoginUserRequest>,
  res: Response,
) => {
  const { email, otpVerifiedToken } = req.body;

  if (!email || !otpVerifiedToken) {
    return res.status(400).json({
      success: false,
      message: "email and otpVerifiedToken are required",
    });
  }

  const otpValidationResult = await validateOtpVerifiedToken(otpVerifiedToken, email);

  if (!otpValidationResult.ok) {
    return res
      .status(otpValidationResult.status)
      .json(otpValidationResult.response);
  }

  const user = await UserModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  user.lastLoginAt = new Date();
  await user.save();

  await OtpModel.deleteOne({ _id: otpValidationResult.otpDoc._id });
  const accessToken = createAccessToken(user);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user,
    accessToken,
  });
};

export const getMyProfile = async (req: Request, res: Response) => {
  if (!req.authUser?.sub) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const user = await UserModel.findById(req.authUser.sub);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    user,
  });
};
