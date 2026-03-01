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

export interface AuthApiResponse extends ApiResponse {
  accessToken?: string;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  name?: string;
  mobileNumber?: string;
  phoneNumber?: string;
}

export interface UserMeResponse extends ApiResponse {
  user?: UserProfile;
  data?: UserProfile | { user?: UserProfile };
}

export const login = (data: LoginData) => axiosInstance.post("/login", data);

export const loginWithVerifiedToken = async (data: {
  email: string;
  otpVerifiedToken: string;
}) => {
  const res = await axiosInstance.post<AuthApiResponse>("/user/login", data);
  return res.data;
};

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

export const sendLoginOtp = async (email: string) => {
  const res = await axiosInstance.post<ApiResponse>("otp/send-login-otp", {
    email,
  });
  return res.data;
};

export const verifyOtp = async (
  email: string,
  otp: string,
  purpose: "register" | "login"
) => {
  const res = await axiosInstance.post<VerifyOtpResponse>("otp/verify", {
    email,
    otp,
    purpose,
  });
  return res.data;
};

export const registerUser = async (data: {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  otpVerifiedToken: string;
}) => {
  const res = await axiosInstance.post<AuthApiResponse>("user/register", data);
  return res.data;
};

export const getUserMe = async (accessToken: string) => {
  const res = await axiosInstance.get<UserMeResponse>("/user/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
