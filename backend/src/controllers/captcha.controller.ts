import { Request, Response } from "express";
import svgCaptcha from "svg-captcha";
import { CaptchaResponse, CaptchaVerificationResult } from "../interfaces";
import { getCaptcha, verifyCaptcha } from "../services/captcha.services";
import { CaptchaRequest } from "../interfaces/captcha.interface";


export const generateCaptcha = (_: Request, res: Response<CaptchaResponse>) => {
  const captcha = getCaptcha();
  res.send(captcha);
};

export const captchaVerification = (req: Request<{}, {}, CaptchaRequest>, res: Response)=> {
  const {captchaId, captchaText} = req.body;
  const result = verifyCaptcha(captchaId, captchaText);
  if(!result.success){
    res.status(400);
  }
  res.json(result);
};
