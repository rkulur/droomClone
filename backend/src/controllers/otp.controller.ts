import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { OtpRequest, SignInRequest } from "../interfaces";
import { OtpModel } from "../models/otp.model";
import { hashedText } from "../services/captcha.service";
import { generateOtp, sendEmailOtp } from "../services/otp.service";

export const sendOtp = async (
  req: Request<{}, {}, OtpRequest>,
  res: Response,
) => {
  const { email, phoneNumber, captchaVerifiedToken } = req.body;

  if (!captchaVerifiedToken) {
    return res.status(400).json({
      success: false,
      message: "Captcha verification token is required",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error",
    });
  }

  jwt.verify(captchaVerifiedToken, secret, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid captcha verification token",
      });
    }
  });

  const otp = generateOtp();
  const { success } = await sendEmailOtp(email, otp);

  if (!success) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP" });
  }

  await OtpModel.create({
    email,
    phoneNumber,
    otpHash: hashedText(otp),
    expiresIn: new Date(Date.now() + 2 * 60 * 1000),
  });
  console.log(otp);

  return res.json({ success: true, message: "OTP sent successfully" });
};

export const verifyOtp = async (
  req: Request<{}, {}, SignInRequest>,
  res: Response,
) => {
  const { email, otp } = req.body;
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error",
    });
  }

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

  const otpVerifiedToken = jwt.sign(
    { otpId: otpDoc._id.toString(), purpose: "register" },
    secret,
    { expiresIn: "10m" },
  );

  return res.json({
    success: true,
    message: "OTP verified successfully",
    otpVerifiedToken,
  });
};
