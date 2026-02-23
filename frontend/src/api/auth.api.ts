import type { LoginData } from "../schema/Login.schema";
import axiosInstance from "./axios";
export interface VerifyCaptchaResponse {
  success: boolean;
  message: string;
  captchaToken: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface CaptchaResponse {
  captchaId: string;
  captchaSvg: string;
}

export interface VerifyOtpResponse extends ApiResponse {
  otpVerifiedToken: string;
}

export const login = (data: LoginData) => axiosInstance.post("/login", data);

export const verifyCaptcha = (data: {
  captchaId: string;
  captchaText: string;
}) => axiosInstance.post<VerifyCaptchaResponse>("/captcha/verify", data);

export const getCaptcha = async () => {
  const res = await axiosInstance.get<CaptchaResponse>("captcha");
  return res.data;
};

export const sendOtp = async (email: string, captchaVerifiedToken: string) => {
  const res = await axiosInstance.post<ApiResponse>("otp", {
    email,
    captchaVerifiedToken,
  });
  return res.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const res = await axiosInstance.post<VerifyOtpResponse>("otp/verify", {
    email,
    otp,
  });
  return res.data;
};

export const registerUser = async (data: {
  firstName: string;
  email: string;
  otpVerifiedToken: string;
}) => {
  const res = await axiosInstance.post<ApiResponse>("user/register", data);
  return res.data;
};
