import { useEffect, useRef, useState } from "react";
import { BsPersonCircle, BsQuestionCircle, BsShieldLock } from "react-icons/bs";
import { Link, useNavigate } from "react-router";
import cart from "../../assets/header/cart-arrow-down-solid-full.svg";
import customerCare from "../../assets/header/headphones-solid-full.svg";
import logo from "../../assets/header/logo.png";
import profile from "../../assets/header/user-solid-full.svg";
import whatsapp from "../../assets/header/whatsapp-brands-solid-full.svg";
import { useAuth } from "../../context/AuthContext";
import Button from "../../utility/Button";
import "./header.css";
import Input from "./Input";
import SelectLocation from "./SelectLocation";

const TopSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [onProfile, setOnProfile] = useState(false);
  const profileRef = useRef<HTMLImageElement | null>(null);
  const profileRefMenu = useRef<HTMLDivElement | null>(null);

  const userName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "User";
  const userPhone = user?.mobileNumber || user?.phoneNumber || "No phone number";

  const closeProfileMenu = () => {
    setOnProfile(false);
  };

  const handleLogout = () => {
    logout();
    closeProfileMenu();
    navigate("/");
  };

  useEffect(() => {
    const handleProfileView = (e: MouseEvent) => {
      const cond1 =
        profileRef.current && !profileRef.current.contains(e.target as Node);
      const cond2 =
        profileRefMenu.current &&
        !profileRefMenu.current.contains(e.target as Node);
      if (cond1 && cond2) {
        setOnProfile(false);
      }
    };

    document.addEventListener("mousedown", handleProfileView);

    return () => {
      document.removeEventListener("mousedown", handleProfileView);
    };
  }, []);

  return (
    <div className="flex justify-between py-4 border-b border-gray-300 px-horizontal">
      <Link to="/">
        <img src={logo} className="cursor-pointer" alt="logo" />
      </Link>
      <div className="flex w-2/3 gap-8  py-2 relative">
        <Input />
        <SelectLocation />
        <div className="flex gap-5 relative">
          <img className="icon" src={whatsapp} alt="whatsapp" />
          <img className="icon" src={cart} alt="cart" />
          <img className="icon" src={customerCare} alt="customer care" />
          {isAuthenticated && user?.role === "admin" && (
            <Link to="/admin" aria-label="admin">
              <BsShieldLock className="icon" />
            </Link>
          )}
          <img
            className="icon"
            src={profile}
            alt="profile"
            ref={profileRef}
            onClick={() => setOnProfile((prev) => !prev)}
          />

          {onProfile && (
            <div
              ref={profileRefMenu}
              className="absolute bg-white z-50 py-6 px-8 w-[23rem] flex flex-col gap-5 rounded-lg shadow-lg top-16"
            >
              {isAuthenticated ? (
                <>
                  <div className="flex items-start gap-3">
                    <BsPersonCircle className="size-10 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-3xl leading-none font-semibold text-[#303549]">
                        {userName}
                      </p>
                      <p className="text-[#6D758D] text-xl mt-2">{userPhone}</p>
                      <Link
                        to="/"
                        className="text-[#0583D2] text-2xl mt-2 inline-block"
                        onClick={closeProfileMenu}
                      >
                        Edit Your Details
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col leading-none text-[#323232] gap-8 mt-2">
                    <Link to="/" onClick={closeProfileMenu}>
                      My Account
                    </Link>
                    <Link to="/" onClick={closeProfileMenu}>
                      My Listings
                    </Link>
                    <Link to="/" onClick={closeProfileMenu}>
                      My orders
                    </Link>
                    <Link to="/" onClick={closeProfileMenu}>
                      My Requirements
                    </Link>
                    <Link to="/" onClick={closeProfileMenu}>
                      My wishlist
                    </Link>
                    <button
                      type="button"
                      className="text-left cursor-pointer"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xl mb-1">
                      Hi, <span className="font-medium">Guest!</span>
                    </p>
                    <p>Login to your dream vehicle</p>
                  </div>
                  <Link to={"/login"} onClick={closeProfileMenu}>
                    <Button title="Log In" />
                  </Link>
                  <div className="text-primary flex flex-col gap-3">
                    <div className="flex justify-between">
                      <Link to={"/account-signup"} onClick={closeProfileMenu}>
                        Create an Individual Account
                      </Link>
                      <BsQuestionCircle className="size-4" />
                    </div>
                    <div className="flex justify-between">
                      <Link to={"/account-signup"} onClick={closeProfileMenu}>
                        Create a Proseller Account
                      </Link>
                      <BsQuestionCircle className="size-4" />
                    </div>
                    <div className="flex justify-between">
                      <Link to={"/account-signup"} onClick={closeProfileMenu}>
                        Create a Business Account
                      </Link>
                      <BsQuestionCircle className="size-4" />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopSection;
