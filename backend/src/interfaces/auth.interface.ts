export interface SignInRequest {
  email: string;
  phoneNumber?: string;
  otp: string;
  purpose?: "register" | "login";
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: "user" | "dealer" | "admin";
}
