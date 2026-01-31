import type { IconType } from "react-icons";
import { BsGoogle } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { Link } from "react-router";

type LoginWithType = {
  name: string;
  icon: IconType;
}[];

const Login = () => {
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

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col gap-8 px-16 py-8 shadow-md bg-white">
        <h2 className="text-center text-2xl font-medium">
          Login To Your Account
        </h2>
        <div className="flex flex-col gap-4">
          <div className="w-full">
            {/* <p>Enter your number</p> */}
            <input
              type="number"
              placeholder="Enter your number"
              className="w-full border-none outline-none text-base px-4 py-2"
            />
            <div className="h-[1.2px] bg-black/40" />
          </div>

          <button className="w-full px-6 py-4 rounded bg-[#2699FA] text-white cursor-pointer active:scale-[98%] transition-all">
            Continue
          </button>
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
