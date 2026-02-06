import service2 from "../assets/home/car_service_2.webp";
import service3 from "../assets/home/car_service_3.webp";
import service1 from "../assets/home/lion_service_1.webp";
import pByHistory from "../assets/home/pByHistory.png";
import pByEco from "../assets/home/powered_by_ECO.png";
import pByObv from "../assets/home/powered_by_obv.png";

export const droomServices = [
  {
    title: "Get AI Driven Valuation Report for Any Used Vehicle",
    iconSrc: service1,
    poweredBySrc: pByObv,
    features: ["Fair Market Value", "CheckPrice Comparison", "Widely Accepted"],
    advantages: [
      "800 Mil+ Trusted Users Worldwide",
      "US Patent",
      "Defacto Pricing Standard",
    ],
    price: 149,
  },

  {
    title: "Get Complete Vehicle History Report for Any Used Vehicle",
    iconSrc: service2,
    poweredBySrc: pByHistory,
    features: ["Accident History", "Theft History", "Number of Owners"],
    advantages: [
      "200 Mil+ Vehicle History Records",
      "1000+ RTOs' Data",
      "50+ Historical Records",
    ],
    price: 129,
  },

  {
    title: "Get Comprehensive Inspection Report for Any Used Vehicle",
    iconSrc: service3,
    poweredBySrc: pByEco,
    features: ["Tech Driven Inspection", "App & AI Based", "Repair Estimates"],
    advantages: [
      "2,000+ Auto Inspection Points",
      "1,200+ Cities Covered",
      "Defacto Pricing Standard",
    ],
    price: 299,
  },
];
