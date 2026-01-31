import { useEffect, useRef, useState } from "react";
import { BsQuestionCircle } from "react-icons/bs";
import { Link } from "react-router";
import cart from "../../assets/header/cart-arrow-down-solid-full.svg";
import customerCare from "../../assets/header/headphones-solid-full.svg";
import logo from "../../assets/header/logo.png";
import profile from "../../assets/header/user-solid-full.svg";
import whatsapp from "../../assets/header/whatsapp-brands-solid-full.svg";
import Button from "../../utility/Button";
import "./header.css";
import Input from "./Input";
import SelectLocation from "./SelectLocation";

const TopSection = () => {
  const [onProfile, setOnProfile] = useState(false);
  const profileRef = useRef<HTMLImageElement | null>(null);
  const profileRefMenu = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleProfileView = (e: MouseEvent) => {
      const cond1 =
        profileRef.current && !profileRef.current.contains(e.target as Node);
      const cond2 =
        profileRefMenu.current &&
        !profileRefMenu.current.contains(e.target as Node);
      if (cond1 && cond2) {
        setOnProfile((prev) => !prev);
      }
    };

    document.addEventListener("mousedown", handleProfileView);

    return () => {
      document.removeEventListener("mousedown", handleProfileView);
    };
  }, []);

  return (
    <div className="flex justify-between py-4 border-b border-gray-300 px-horizontal">
      <img src={logo} className="cursor-pointer" alt="logo" />
      <div className="flex w-2/3 gap-8  py-2 relative">
        <Input />
        <SelectLocation />
        <div className="flex gap-5 relative">
          <img className="icon" src={whatsapp} alt="whatsapp" />
          <img className="icon" src={cart} alt="cart" />
          <img className="icon" src={customerCare} alt="customer care" />
          <img
            className="icon"
            src={profile}
            alt="profile"
            ref={profileRef}
            onClick={() => setOnProfile(!onProfile)}
          />

          {onProfile && (
            <div
              ref={profileRefMenu}
              className="absolute bg-white z-50 py-6 px-8 w-[21rem] flex flex-col gap-6 rounded-lg shadow-lg top-16"
            >
              <div>
                <p className="text-xl mb-1">
                  Hi, <span className="font-medium">Guest!</span>
                </p>
                <p>Login to your dream vehicle</p>
              </div>
              <Link to={"/login"} onClick={() => setOnProfile(!onProfile)}>
                <Button title="Log In" />
              </Link>
              <div className="text-primary flex flex-col gap-3">
                <div className="flex justify-between">
                  <Link
                    to={"/account-signup"}
                    onClick={() => setOnProfile(!onProfile)}
                  >
                    Create an Individual Account
                  </Link>
                  <BsQuestionCircle className="size-4" />
                </div>
                <div className="flex justify-between">
                  <Link
                    to={"/account-signup"}
                    onClick={() => setOnProfile(!onProfile)}
                  >
                    Create a Proseller Account
                  </Link>
                  <BsQuestionCircle className="size-4" />
                </div>
                <div className="flex justify-between">
                  <Link
                    to={"/account-signup"}
                    onClick={() => setOnProfile(!onProfile)}
                  >
                    Create a Business Account
                  </Link>
                  <BsQuestionCircle className="size-4" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopSection;
