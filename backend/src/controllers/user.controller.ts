import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RegisterUserRequest } from "../interfaces";
import { OtpModel } from "../models/otp.model";
import { UserModel } from "../models/user.model";

type OtpVerificationTokenPayload = {
  otpId?: string;
  purpose?: string;
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

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error",
    });
  }

  let decoded: OtpVerificationTokenPayload;
  try {
    decoded = jwt.verify(otpVerifiedToken, secret) as OtpVerificationTokenPayload;
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP verification token",
    });
  }

  if (!decoded.otpId || decoded.purpose !== "register") {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP verification token payload",
    });
  }

  const otpDoc = await OtpModel.findById(decoded.otpId);

  if (!otpDoc) {
    return res.status(400).json({
      success: false,
      message: "OTP record not found",
    });
  }

  if (otpDoc.expiresIn < new Date()) {
    return res.status(400).json({
      success: false,
      message: "OTP has expired",
    });
  }

  if (otpDoc.email.toLowerCase() !== email.toLowerCase()) {
    return res.status(400).json({
      success: false,
      message: "OTP token does not match the provided email",
    });
  }

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

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
};
