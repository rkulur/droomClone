import { Request, Response } from "express";
import svgCaptcha from "svg-captcha";
import { CaptchaResponse, CaptchaVerificationResult } from "../interfaces";

const captchaStore = new Map<string, string>();

export const getCaptcha = (_: Request, res: Response<CaptchaResponse>) => {
  const captcha = svgCaptcha.create();
  const captchaId = crypto.randomUUID();

  captchaStore.set(captchaId, captcha.text);

  res.send({
    captchaId,
    captchaSvg: captcha.data,
  });
};

export const verifyCaptcha = (captchaId: string, captchaText: string): CaptchaVerificationResult => {
  if (!captchaStore.has(captchaId)) {
    return {success: false, message: "Captcha ID not found"};
  }

  const storedCaptchaText = captchaStore.get(captchaId);
  if (storedCaptchaText !== captchaText) {
    return {success: false, message: "Captcha text does not match"};
  }

  captchaStore.delete(captchaId);

  return {
    success: true,
    message: "Captcha verified successfully"
}
};
