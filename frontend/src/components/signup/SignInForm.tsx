import { IoReload } from "react-icons/io5";
import { Link } from "react-router";
import Button from "../../utility/Button";

const SignInForm = () => {
  return (
    <div className="rounded-md overflow-hidden w-5/8">
      <div className="bg-primary flex text-white font-medium flex-col place-items-center py-4">
        <p>Looks like you are new here!</p>
        <p>Sign up to get started</p>
      </div>
      <div className="bg-white  px-8 py-6 flex flex-col gap-8">
        <h2 className="font-medium text-center text-xl">
          Create Your Individual Account
        </h2>
        <div className="flex gap-6">
          <div className="">
            <input
              type="email"
              placeholder="Email address"
              className="w-full border-none outline-none text-base px-4 py-2"
            />
            <div className="h-[1.2px] bg-black/40" />
          </div>
          <div>
            <input
              type="number"
              placeholder="Mobile No."
              className="w-full border-none outline-none text-base px-4 py-2"
            />
            <div className="h-[1.2px] bg-black/40" />
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
            />
            <div className="flex place-items-center bg-gray-300 px-2">
              <IoReload />
            </div>
          </div>
          <div className="flex-1 border">captcha</div>
        </div>
        <div className="text-sm">
          <p>By creating an account you agree to our </p>
          <p className="text-primary">
            Terms of Service, Privacy Policy, Seller policy and Rules
          </p>
        </div>
        <Button title={"Create account"} />
        <Link to={"/login"} className="text-primary text-center">
          Existing user? Log in
        </Link>
      </div>
    </div>
  );
};

export default SignInForm;
