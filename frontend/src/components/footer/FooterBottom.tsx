import { FaPhone, FaWhatsapp } from "react-icons/fa";
import { GoMail } from "react-icons/go";

const FooterBottom = () => {
  return (
    <div className="px-horizontal py-8 gap-30 bg-gray-100 flex justify-between">
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="font-medium text-xl">About Droom</h3>
        <p className="text-gray-600">
          Droom is a tech and AI-driven 21st-century futuristic online platform
          revolutionizing the Indian automotive market. Droom is the only online
          automobile platform in India that sells both used and new automobiles
          and everything from bicycles to planes. Droom has helped 2.5million+
          customers buy, sell, finance, insure, or inspect/certify vehicles with
          trust, convenience, and peace of mind backed by Droom's managed
          marketplace platform and proprietary tech & AI-driven ecosystem of
          products and services.
        </p>
        <a href="#" className="font-meidum text-primary">
          Read more
        </a>
      </div>
      <div className="flex-1 flex flex-col gap-2 items-center">
        <h3 className="font-medium text-xl">Need Help in Buying or Selling?</h3>
        <div className="flex gap-2">
          <FaWhatsapp className="bg-primary text-white rounded-full size-6 p-1" />
          <p>+91-1234567890</p>
        </div>
        <div className="flex gap-2">
          <FaPhone className="bg-primary text-white rounded-full size-6 p-1" />
          +91-1234567890
        </div>
        <div className="flex gap-2">
          <GoMail className="bg-primary text-white rounded-full size-6 p-1" />
          assists@droom.in
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
