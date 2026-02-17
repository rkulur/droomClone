import axios, { type AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { IoReload } from "react-icons/io5";
import { Link } from "react-router";
import Button from "../../utility/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginData } from "../../schema/Login.schema";

const SignInForm = () => {
  const [svg, setSvg] = useState<string>("");
  const [reload, setReload] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginData) => {
    console.log(data);
    reset();
  };

  useEffect(() => {
    const BASE_URL = "http://localhost:3000";
    const getCaptcha = async () => {
      const res = await axios.get<
        {},
        AxiosResponse<{ captchaId: string; captchaSvg: string }>
      >(`${BASE_URL}/captcha`);
      const { captchaId, captchaSvg } = res.data;
      setSvg(captchaSvg);
      localStorage.setItem("captchaId", captchaId);
    };

    getCaptcha();
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
    </div>
  );
};

export default SignInForm;
