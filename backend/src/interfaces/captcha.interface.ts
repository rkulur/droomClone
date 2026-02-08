
export interface CaptchaResponse {
    captchaId: string;
    captchaSvg: string;
}

export interface CaptchaVerificationResult {
    success: boolean;
    message: string;
}