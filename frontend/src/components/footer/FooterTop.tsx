import { BiLogoPlayStore } from "react-icons/bi";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import {
  FaApple,
  FaArrowAltCircleRight,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa";
import { LiaLinkedin } from "react-icons/lia";
import { PiPinterestLogo } from "react-icons/pi";

const FooterTop = () => {
  return (
    <div className="text-xs flex px-horizontal py-6 justify-between border-y border-gray-300">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <BiLogoPlayStore className="footerIcon" />
          <FaApple className="footerIcon" />
        </div>
        <p>Download App</p>
      </div>
      <div className="flex flex-col gap-2">
        <FaYoutube className="footerIcon" />
        <p>Watch TVC</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <FaFacebook className="footerIcon" />
          <BsTwitter className="footerIcon" />
          <PiPinterestLogo className="footerIcon" />
          <LiaLinkedin className="footerIcon" />
          <BsInstagram className="footerIcon" />
        </div>
        <p>Follow us</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="border border-gray-300 rounded-full flex overflow-hidden">
          <input
            type="text"
            placeholder="Enter your email-id"
            className="px-4 outline-none "
          />
          <div className="place-items-center bg-primary px-4 py-2 cursor-pointer">
            <FaArrowAltCircleRight className="text-white size-4" />
          </div>
        </div>
        <p>Submit Your Email For Latest Offers</p>
      </div>
    </div>
  );
};

export default FooterTop;
