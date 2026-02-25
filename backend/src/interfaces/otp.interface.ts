export interface OtpRequest {
  email: string;
  phoneNumber?: string;
  captchaVerifiedToken: string;
}

export interface LoginOtpRequest {
  email: string;
  phoneNumber?: string;
}
