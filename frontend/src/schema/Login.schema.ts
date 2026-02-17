import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address").trim(),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  captcha: z.string().length(6, "Captcha must be exactly 6 characters").trim(),
});

export type LoginData = z.infer<typeof loginSchema>;
