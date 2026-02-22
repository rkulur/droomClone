import crypto from "node:crypto";
import { createTransporter } from "../config/nodemailer";

export function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

export async function sendEmailOtp(to: string, otp: string) {
  const message = getMessage(to, otp);
  const transporter = await createTransporter();
  await transporter.sendMail(message);

  return { success: true, message: "OTP sent successfully", otp };
}

function getMessage(to: string, otp: string) {
  return {
    from: `"Droom Security" <${process.env.USER_MAIL}>`,
    to,
    subject: "Your Droom OTP Code",
    html: `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 24px;">
    <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 24px;">

    <h2 style="margin: 0 0 16px; color: #111827;">
    Verify your email
    </h2>

    <p style="font-size: 14px; color: #374151; line-height: 1.6;">
    Use the OTP below to complete your verification. This code is valid for
      <strong>10 minutes</strong>.
      </p>

    <div style="
    margin: 24px 0;
    padding: 16px;
    background-color: #f9fafb;
    border: 1px dashed #d1d5db;
    border-radius: 6px;
    text-align: center;
    ">
    <span style="
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 6px;
    color: #111827;
    ">
    ${otp}
    </span>
    </div>

    <p style="font-size: 13px; color: #6b7280;">
    If you didn’t request this OTP, you can safely ignore this email.
        </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

      <p style="font-size: 12px; color: #9ca3af;">
      © ${new Date().getFullYear()} Droom. All rights reserved.
        </p>

      </div>
      </div>
      `,
  };
}
