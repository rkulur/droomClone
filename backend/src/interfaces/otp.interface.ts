export interface OtpRequest {
  email: string;
  phoneNumber?: string;
  captchaVerifiedToken: string;
}
