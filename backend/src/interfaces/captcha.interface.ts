export interface CaptchaStore{
    captchaText: string;
    captchaSvg: string;
    expiresIn: number;
}

export interface CaptchaResponse {
    captchaId: string;
    captchaSvg: string;
}

export interface CaptchaRequest {
    captchaId: string;
    captchaText: string;
}

export interface CaptchaVerificationResult {
    success: boolean;
    message: string;
}