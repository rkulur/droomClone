import type { LoginData } from "../schema/Login.schema";
import axiosInstance from "./axios";
export interface VerifyCaptchaResponse {
  success: boolean;
  message: string;
  captchaToken: string;
}
export interface CaptchaResponse {
  captchaId: string;
  captchaSvg: string;
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
