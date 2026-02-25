import type { IconType } from "react-icons";
import { useState } from "react";
import { BsGoogle } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { isAxiosError } from "axios";
import {
  loginWithVerifiedToken,
  sendLoginOtp,
  verifyOtp,
} from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";

type LoginWithType = {
  name: string;
  icon: IconType;
}[];

const Login = () => {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const loginWith: LoginWithType = [
    {
      name: "Email",
      icon: MdMail,
    },
    {
      name: "Facebook",
      icon: FaFacebook,
    },
    {
      name: "Google",
      icon: BsGoogle,
    },
  ];

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (!isAxiosError(error)) {
      return fallback;
    }

    const responseMessage = (error.response?.data as { message?: string })
      ?.message;
    return responseMessage || fallback;
  };

  const handleRequestOtp = async () => {
    if (!email.trim()) {
      alert("Email is required");
      return;
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!isEmailValid) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await sendLoginOtp(email.trim());

      if (!response.success) {
        alert(response.message || "Failed to send OTP");
        return;
      }

      setOtpRequested(true);
      alert(response.message || "OTP sent successfully");
    } catch (error) {
      alert(getErrorMessage(error, "Failed to send OTP"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsVerifying(true);
      const verifyResponse = await verifyOtp(email.trim(), otp, "login");

      if (!verifyResponse.success) {
        alert(verifyResponse.message || "OTP verification failed");
        return;
      }

      if (!verifyResponse.otpVerifiedToken) {
        alert("OTP verified token missing");
        return;
      }

      const loginResponse = await loginWithVerifiedToken({
        email: email.trim(),
        otpVerifiedToken: verifyResponse.otpVerifiedToken,
      });

      if (!loginResponse.success) {
        alert(loginResponse.message || "Login failed");
        return;
      }

      if (!loginResponse.accessToken) {
        alert("Access token missing");
        return;
      }

      const isLoggedIn = await loginWithToken(loginResponse.accessToken);
      if (!isLoggedIn) {
        alert("Failed to load user profile");
        return;
      }

      navigate("/");
    } catch (error) {
      alert(getErrorMessage(error, "OTP verification failed"));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col gap-8 px-16 py-8 shadow-md bg-white">
        <h2 className="text-center text-2xl font-medium">
          Login To Your Account
        </h2>
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border-none outline-none text-base px-4 py-2"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <div className="h-[1.2px] bg-black/40" />
          </div>

          {!otpRequested ? (
            <button
              className="w-full px-6 py-4 rounded bg-[#2699FA] text-white cursor-pointer active:scale-[98%] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleRequestOtp}
              disabled={isSubmitting}
              type="button"
            >
              {isSubmitting ? "Sending OTP..." : "Login"}
            </button>
          ) : (
            <div className="space-y-4">
              <InputOTP
                maxLength={6}
                id="login-otp-verification"
                required
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator className="mx-2" />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <button
                className="w-full px-6 py-4 rounded bg-[#2699FA] text-white cursor-pointer active:scale-[98%] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleVerifyOtp}
                disabled={isVerifying}
                type="button"
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="h-[1.2px] bg-black/40" />
          <p className="text-center text-black/40 text-sm">or login with</p>
          <div className="h-[1.2px] bg-black/40" />
        </div>

        <div className="flex justify-evenly">
          {loginWith.map((option, idx) => (
            <div
              className="flex flex-col items-center cursor-pointer"
              key={`${option.name}${idx}`}
            >
              <option.icon className="size-6 text-gray-600" />
              <p className="text-black/40 text-sm mt-1">{option.name}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-primary">
          <Link to={"/account-signup"} className="w-[45%] text-sm">
            Create Individual Account
          </Link>
          <Link to={"/"} className="w-[45%] text-sm text-right">
            Create Proseller Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
