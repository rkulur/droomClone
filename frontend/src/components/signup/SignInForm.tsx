import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoReload } from "react-icons/io5";
import { Link } from "react-router";
import {
  getCaptcha,
  sendOtp,
  verifyCaptcha,
  type VerifyCaptchaResponse,
} from "../../api/auth.api";
import { loginSchema, type LoginData } from "../../schema/Login.schema";
import Button from "../../utility/Button";
import { InputOTPForm } from "./OTP";

const SignInForm = () => {
  const [svg, setSvg] = useState<string>("");
  const [reload, setReload] = useState<boolean>(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>("");

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
      cookieStore.set("captchaToken", captchaToken);
    } catch (err) {
      if (isAxiosError(err)) {
        const { success, message } = err.response
          ?.data as VerifyCaptchaResponse;

        if (!success) {
          setCaptchaValid(false);
          setError("captcha", {
            type: "invalidCaptcha",
            message: message || "Invalid captcha",
          });
          return;
        }

        clearErrors("captcha");
      }
    }
  };

  const handleOtpVerification = async () => {};

  const onSubmit = async (data: LoginData) => {
    const { captcha } = data;
    setEmail(data.email);
    await handleCaptchaVerification(captcha);
    const token = await cookieStore.get("captchaToken");
    const captchaVerifiedToken = token?.value;

    if (!captchaVerifiedToken) {
      alert("Captcha verification failed. Please try again.");
      return;
    }

    await sendOtp(data.email, captchaVerifiedToken);
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
      {true && email && (
        <div className="border h-full absolute w-full top-0 left-0 bg-dim">
          <div className="absolute left-2/5 top-1/4 z-10">
            <InputOTPForm
              email={email}
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
