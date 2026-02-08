import { Request, Response } from "express";
import { OtpRequest, SignInRequest } from "../interfaces";
import jwt from "jsonwebtoken";
import { generateOtp, sendEmailOtp } from "../services/otp.service";
import { OtpModel } from "../models/otp.model";
import { hashedText } from "../services/captcha.service";
import crypto from "node:crypto";

export const getOtp = async (
  req: Request<{}, {}, OtpRequest>,
  res: Response,
) => {
  const { email, captchaVerifiedToken } = req.body;

  if (!captchaVerifiedToken) {
    return res.status(400).json({
      success: false,
      message: "Captcha verification token is required",
    });
  }

  jwt.verify(captchaVerifiedToken, process.env.JWT_TOKEN, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid captcha verification token",
      });
    }
  });

  const otp = generateOtp();
  const { success } = sendEmailOtp(email, otp);

  if (!success) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP" });
  }

  await OtpModel.create({
    email,
    phoneNumber: "",
    otpHash: hashedText(otp),
    expiresIn: new Date(Date.now() + 2 * 60 * 1000),
  });

  return res.json({ success: true, message: "OTP sent successfully" });
};

export const verifyOtp = async (
  req: Request<{}, {}, SignInRequest>,
  res: Response,
) => {
  const { email, otp } = req.body;

  const otpDoc = await OtpModel.findOne({ email });

  if (!otpDoc) {
    return res.status(400).json({
      success: false,
      message: "OTP not found for the given email",
    });
  }

  if (otpDoc.expiresIn < new Date()) {
    await OtpModel.deleteOne({ email });
    return res.status(400).json({
      success: false,
      message: "OTP has expired",
    });
  }

  const isMatch = crypto.timingSafeEqual(
    Buffer.from(otpDoc.otpHash),
    Buffer.from(hashedText(otp)),
  );

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  await OtpModel.deleteOne({ email });

  return res.json({ success: true, message: "OTP verified successfully" });
};
