export type UserRole = "user" | "dealer" | "admin";

export interface RegisterUserRequest {
  firstName: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  role?: UserRole;
  avatarUrl?: string;
  otpVerifiedToken: string;
}
