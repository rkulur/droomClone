import crypto from "node:crypto";
import svgCaptcha from "svg-captcha";
import { CaptchaResponse, CaptchaVerificationResult } from "../interfaces";
import { CaptchaStore } from "../interfaces/captcha.interface";

const captchaStore = new Map<string, CaptchaStore>();

export const generateCaptcha = (): CaptchaResponse => {
  const captcha = svgCaptcha.create({
    size: 6,
    noise: 15,
    color: true,
  });
  const captchaId = crypto.randomUUID();

  const hashedCaptchaText = hashedText(captcha.text);
  captchaStore.set(captchaId, {
    captchaText: hashedCaptchaText,
    captchaSvg: captcha.data,
    expiresIn: Date.now() + 1000 * 60 * 2,
  });


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
    return { success: false, message: "Invalid captcha id" };
  }

  if (storedCaptcha.expiresIn < Date.now()) {
    captchaStore.delete(captchaId);
    return { success: false, message: "Captcha expired" };
  }

  const hashedCaptchaText = hashedText(captchaText);

  const isMatch = crypto.timingSafeEqual(
    Buffer.from(hashedCaptchaText),
    Buffer.from(storedCaptcha.captchaText),
  );

  if (!isMatch) {
    return { success: false, message: "Captcha text does not match" };
  }

  captchaStore.delete(captchaId);

  return {
    success: true,
    message: "Captcha verified successfully",
  };
};

export function hashedText(text: string) {
  return crypto.createHash("sha256").update(text.toLowerCase()).digest("hex");
}
