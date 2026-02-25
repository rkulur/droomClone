import { Request, Response } from "express";
import { CaptchaRequest, CaptchaResponse } from "../interfaces/captcha.interface";
import { LoginOtpRequest } from "../interfaces";
import { OtpModel } from "../models/otp.model";
import {
  generateCaptcha,
  hashedText,
  verifyCaptcha,
} from "../services/captcha.service";
import { generateOtp, sendEmailOtp } from "../services/otp.service";


export const getCaptcha = (
  _: Request,
  res: Response<CaptchaResponse>,
) => {

  const captchaImg = generateCaptcha();
  res.send(captchaImg);
};

export const captchaVerification = (
  req: Request<{}, {}, CaptchaRequest>,
  res: Response,
) => {
  console.log(req)
  const { captchaId, captchaText } = req.body;
  const result = verifyCaptcha(captchaId, captchaText);
  if (!result.success) {
    res.status(400);
  }
  res.json(result);
};

export const sendLoginOtp = async (
  req: Request<{}, {}, LoginOtpRequest>,
  res: Response,
) => {
  const { email, phoneNumber } = req.body;

  const otp = generateOtp();
  const { success } = await sendEmailOtp(email, otp);

  if (!success) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
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
