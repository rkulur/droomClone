import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoReload } from "react-icons/io5";
import { Link } from "react-router";
import {
  type ApiResponse,
  getCaptcha,
  registerUser,
  sendOtp,
  verifyOtp,
  verifyCaptcha,
} from "../../api/auth.api";
import { loginSchema, type LoginData } from "../../schema/Login.schema";
import Button from "../../utility/Button";
import { InputOTPForm } from "./OTP";

const SignInForm = () => {
  const [svg, setSvg] = useState<string>("");
  const [reload, setReload] = useState<boolean>(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [pendingSignup, setPendingSignup] = useState<{
    email: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    criteriaMode: "all",
    mode: "onChange",
  });

  const getErrorMessage = (err: unknown, fallback: string) => {
    if (!isAxiosError(err)) {
      return fallback;
    }

    return (err.response?.data as ApiResponse | undefined)?.message || fallback;
  };

  const getFirstNameFromEmail = (userEmail: string) => {
    const localPart = userEmail.split("@")[0]?.trim() || "";
    const normalized = localPart.replace(/[^a-zA-Z]/g, "");

    if (!normalized) {
      return "User";
    }

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const handleCaptchaVerification = async (captcha: string) => {
    const captchaId = localStorage.getItem("captchaId");

    if (!captchaId) {
      setError("captcha", {
        type: "noCaptchaId",
        message: "Captcha expired. Please reload.",
      });
      return;
    }

    try {
      const res = await verifyCaptcha({
        captchaText: captcha,
        captchaId,
      });

      const { captchaToken } = res.data;

      setCaptchaValid(true);
      clearErrors("captcha");
      return captchaToken;
    } catch (err) {
      const message = getErrorMessage(err, "Invalid captcha");
      setCaptchaValid(false);
      setError("captcha", {
        type: "invalidCaptcha",
        message,
      });
      return null;
    }
  };

  const handleOtpVerification = async () => {
    if (!pendingSignup) {
      alert("Signup details not found. Please try again.");
      return;
    }

    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const otpRes = await verifyOtp(pendingSignup.email, otp);
      const { success, message, otpVerifiedToken } = otpRes;

      if (!success) {
        alert(message || "OTP verification failed.");
        return;
      }
      if (!otpVerifiedToken) {
        alert("OTP token missing. Please request OTP again.");
        return;
      }

      const registerRes = await registerUser({
        firstName: getFirstNameFromEmail(pendingSignup.email),
        email: pendingSignup.email,
        otpVerifiedToken,
      });

      if (!registerRes.success) {
        alert(registerRes.message || "User registration failed.");
        return;
      }

      alert(registerRes.message || message || "Account created successfully.");
      setOtp("");
      setPendingSignup(null);
      setCaptchaValid(false);
      reset();
      setReload((prev) => !prev);
    } catch (err: unknown) {
      alert(getErrorMessage(err, "OTP verification or registration failed."));
    }
  };

  const onSubmit = async (data: LoginData) => {
    const captchaVerifiedToken = await handleCaptchaVerification(data.captcha);

    if (!captchaVerifiedToken) {
      alert("Captcha verification failed. Please try again.");
      return;
    }

    try {
      const otpRes = await sendOtp(data.email, captchaVerifiedToken);
      if (!otpRes.success) {
        alert(otpRes.message || "Failed to send OTP. Please try again.");
        return;
      }

      setPendingSignup({
        email: data.email,
      });
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to send OTP. Please try again."));
    }
  };

  useEffect(() => {
    if (captchaValid) {
      return;
    }

    (async () => {
      const { captchaId, captchaSvg } = await getCaptcha();
      localStorage.setItem("captchaId", captchaId);
      setSvg(captchaSvg);
    })();
  }, [reload]);

  return (
    <div className="rounded-md overflow-hidden w-5/8 select-none">
      <div className="bg-primary flex text-white font-medium flex-col place-items-center py-4">
        <p>Looks like you are new here!</p>
        <p>Sign up to get started</p>
      </div>
      <form
        className="bg-white  px-8 py-6 flex flex-col gap-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="font-medium text-center text-xl">
          Create Your Individual Account
        </h2>
        <div className="flex gap-6">
          <div className="">
            <input
              type="email"
              placeholder="Email address"
              className="w-full border-none outline-none text-base px-4 py-2"
              {...register("email")}
            />
            <div className="h-[1.2px] bg-black/40" />
            {errors.email && (
              <p className="error-msg">{errors.email.message}</p>
            )}
          </div>
          <div>
            <input
              type="number"
              placeholder="Mobile No."
              className="w-full border-none outline-none text-base px-4 py-2"
              {...register("phoneNumber")}
            />
            <div className="h-[1.2px] bg-black/40" />
            {errors.phoneNumber && (
              <p className="error-msg">{errors.phoneNumber.message}</p>
            )}
          </div>
        </div>
        <p className="text-sm">
          Please verify both your mobile number and email address through One
          Time Password
        </p>
        <div className="flex gap-3">
          <div className="flex border border-gray-400 flex-1">
            <input
              type="text"
              className="outline-none px-2 w-full placeholder:text-sm py-2"
              disabled={captchaValid}
              placeholder="Enter the captcha here"
              {...register("captcha")}
            />
            <div
              onClick={() => setReload(!reload)}
              className="flex place-items-center bg-gray-300 px-2 cursor-pointer"
            >
              <IoReload />
            </div>
          </div>
          <div className="flex-1">
            <div
              dangerouslySetInnerHTML={{ __html: svg }}
              className="w-full"
            ></div>
          </div>
        </div>
        {errors.captcha && (
          <p className="error-msg">{errors.captcha.message}</p>
        )}
        <div className="text-sm">
          <p>By creating an account you agree to our </p>
          <p className="text-primary">
            Terms of Service, Privacy Policy, Seller policy and Rules
          </p>
        </div>
        <label htmlFor="submit">
          <input id="submit" type="submit" className="hidden" />
          <Button title={"Create account"} />
        </label>
        <Link to={"/login"} className="text-primary text-center">
          Existing user? Log in
        </Link>
      </form>
      {pendingSignup && (
        <div className="border h-full absolute w-full top-0 left-0 bg-dim">
          <div className="absolute left-2/5 top-1/4 z-10">
            <InputOTPForm
              email={pendingSignup.email}
              otp={otp}
              setOtp={setOtp}
              handleOtpVerification={handleOtpVerification}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInForm;
