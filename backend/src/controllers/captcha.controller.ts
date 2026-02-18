import { Request, Response } from "express";
import { CaptchaRequest, CaptchaResponse } from "../interfaces/captcha.interface";
import {
  generateCaptcha,
  verifyCaptcha
} from "../services/captcha.service";


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
