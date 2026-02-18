import type { LoginData } from "../schema/Login.schema";
import axiosInstance from "./axios";
export interface VerifyCaptchaResponse {
  success: boolean;
  message: string;
  captchaToken: string;
}

export const login = (data: LoginData) => axiosInstance.post("/login", data);

export const verifyCaptcha = (data: {
  captchaId: string;
  captchaText: string;
}) => axiosInstance.post<VerifyCaptchaResponse>("/captcha/verify", data);
