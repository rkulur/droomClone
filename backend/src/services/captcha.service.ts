import crypto from "node:crypto";
import svgCaptcha from "svg-captcha";
import { CaptchaResponse, CaptchaVerificationResult } from "../interfaces";
import { CaptchaStore } from "../interfaces/captcha.interface";
import jwt from "jsonwebtoken"

const captchaStore = new Map<string, CaptchaStore>();

export const generateCaptcha = (): CaptchaResponse => {
  const captcha = svgCaptcha.create({
    size: 6,
    noise: 5,
    color: true,
  });
  const captchaId = crypto.randomUUID();

  const hashedCaptchaText = hashedText(captcha.text);
  captchaStore.set(captchaId, {
    captchaText: hashedCaptchaText,
    captchaSvg: captcha.data,
    expiresIn: Date.now() + 1000 * 60 * 2,
  });


  console.log(captcha.text)
  return {
    captchaId,
    captchaSvg: captcha.data,
  };
};

export const verifyCaptcha = (
  captchaId: string,
  captchaText: string,
): CaptchaVerificationResult => {
  const storedCaptcha = captchaStore.get(captchaId);

  if (!storedCaptcha) {
    return { success: false, message: "Invalid captcha id", captchaToken: null };
  }

  if (storedCaptcha.expiresIn < Date.now()) {
    captchaStore.delete(captchaId);
    return { success: false, message: "Captcha expired", captchaToken: null };
  }

  const hashedCaptchaText = hashedText(captchaText);

  const isMatch = crypto.timingSafeEqual(
    Buffer.from(hashedCaptchaText),
    Buffer.from(storedCaptcha.captchaText),
  );

  if (!isMatch) {
    return { success: false, message: "Captcha text does not match", captchaToken: null };
  }

  captchaStore.delete(captchaId);

  const secret = process.env.JWT_SECRET;

  if(!secret){
    throw new Error("JWT_SECRET environment variable is not set");
  }
  const captchaToken = jwt.sign({ captchaId }, secret, { expiresIn: "10m" });

  return {
    success: true,
    message: "Captcha verified successfully",
    captchaToken,
  };
};

export function hashedText(text: string) {
  return crypto.createHash("sha256").update(text.toLowerCase()).digest("hex");
}
