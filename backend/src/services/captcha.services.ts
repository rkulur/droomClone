import svgCaptcha from "svg-captcha";
import { CaptchaResponse, CaptchaVerificationResult } from "../interfaces";
import crypto from "node:crypto";

const captchaStore = new Map<string, string>();

export const getCaptcha = (): CaptchaResponse => {
  const captcha = svgCaptcha.create();
  const captchaId = crypto.randomUUID();

  const hashedCaptchaText = hashedText(captcha.text);
  captchaStore.set(captchaId, hashedCaptchaText);

  setTimeout(
    () => {
      captchaStore.delete(captchaId);
    },
    1000 * 60 * 2,
  );

  return {
    captchaId,
    captchaSvg: captcha.data,
  };
};

export const verifyCaptcha = (
  captchaId: string,
  captchaText: string,
): CaptchaVerificationResult => {

  if (!captchaStore.has(captchaId)) {
    return { success: false, message: "Captcha ID not found" };
  }

  const hashedCaptchaText = hashedText(captchaText);
  const storedCaptchaText = captchaStore.get(captchaId)!;

  const isMatch = crypto.timingSafeEqual(
    Buffer.from(hashedCaptchaText),
    Buffer.from(storedCaptchaText),
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


function hashedText(text: string){
  return crypto
    .createHash("sha256")
    .update(text.toLowerCase())
    .digest("hex");
} 