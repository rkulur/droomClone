import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoReload } from "react-icons/io5";
import { Link } from "react-router";
import { z } from "zod";
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

const registerDetailsSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterDetailsData = z.infer<typeof registerDetailsSchema>;

const SignInForm = () => {
  const [svg, setSvg] = useState<string>("");
  const [reload, setReload] = useState<boolean>(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [pendingSignup, setPendingSignup] = useState<{
    email: string;
    otpVerifiedToken?: string;
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

  const {
    register: registerDetails,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegisterDetails,
  } = useForm<RegisterDetailsData>({
    resolver: zodResolver(registerDetailsSchema),
    criteriaMode: "all",
    mode: "onChange",
  });

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

      setPendingSignup({
        email: pendingSignup.email,
        otpVerifiedToken,
      });
      alert(message || "OTP verified successfully.");
    } catch (err: unknown) {
      alert(getErrorMessage(err, "OTP verification failed."));
    }
  };

  const onRegisterSubmit = async (data: RegisterDetailsData) => {
    if (!pendingSignup?.otpVerifiedToken) {
      alert("OTP verification required. Please verify OTP first.");
      return;
    }

    try {
      const registerRes = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        email: pendingSignup.email,
        otpVerifiedToken: pendingSignup.otpVerifiedToken,
      });

      if (!registerRes.success) {
        alert(registerRes.message || "User registration failed.");
        return;
      }

      alert(registerRes.message || "Account created successfully.");
      setOtp("");
      setPendingSignup(null);
      setCaptchaValid(false);
      reset();
      resetRegisterDetails();
      setReload((prev) => !prev);
    } catch (err: unknown) {
      alert(getErrorMessage(err, "User registration failed."));
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
            {!pendingSignup.otpVerifiedToken ? (
              <InputOTPForm
                email={pendingSignup.email}
                otp={otp}
                setOtp={setOtp}
                handleOtpVerification={handleOtpVerification}
              />
            ) : (
              <form
                className="bg-white rounded-md p-6 w-[26rem] flex flex-col gap-4"
                onSubmit={handleRegisterSubmit(onRegisterSubmit)}
              >
                <h3 className="text-lg font-medium text-center">
                  Complete Registration
                </h3>
                <div>
                  <input
                    type="text"
                    placeholder="First name"
                    className="w-full border-none outline-none text-base px-4 py-2"
                    {...registerDetails("firstName")}
                  />
                  <div className="h-[1.2px] bg-black/40" />
                  {registerErrors.firstName && (
                    <p className="error-msg">
                      {registerErrors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last name"
                    className="w-full border-none outline-none text-base px-4 py-2"
                    {...registerDetails("lastName")}
                  />
                  <div className="h-[1.2px] bg-black/40" />
                  {registerErrors.lastName && (
                    <p className="error-msg">{registerErrors.lastName.message}</p>
                  )}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full border-none outline-none text-base px-4 py-2"
                    {...registerDetails("password")}
                  />
                  <div className="h-[1.2px] bg-black/40" />
                  {registerErrors.password && (
                    <p className="error-msg">{registerErrors.password.message}</p>
                  )}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full border-none outline-none text-base px-4 py-2"
                    {...registerDetails("confirmPassword")}
                  />
                  <div className="h-[1.2px] bg-black/40" />
                  {registerErrors.confirmPassword && (
                    <p className="error-msg">
                      {registerErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-4 rounded bg-[#2699FA] text-white cursor-pointer active:scale-[98%] transition-all text-center"
                >
                  Register Account
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInForm;
