import repairAndMaintenance from "../assets/home/RepairMaintenance.svg";
import carDetailing from "../assets/home/car-care.svg";
import vehicleWarranty from "../assets/home/extended-warenty.png.webp";
import roadSideAssistance from "../assets/home/road-side.png.webp";

type AncilaryService = {
  tagline: string;
  title: string;
  image: {
    src: string;
    alt: string;
  };
};

export const ancilaryServices: AncilaryService[] = [
  {
    tagline: "Get Instant",
    title: "Road Side Assistance",
    image: {
      src: roadSideAssistance,
      alt: "Road side assistance service",
    },
  },
  {
    tagline: "Find the Best for",
    title: "Repair & Maintenance",
    image: {
      src: repairAndMaintenance,
      alt: "Car repair and maintenance service",
    },
  },
  {
    tagline: "Secure Vehicle with",
    title: "Extended Warranty",
    image: {
      src: vehicleWarranty,
      alt: "Extended vehicle warranty",
    },
  },
  {
    tagline: "Find the Best for",
    title: "Car Care & Detailing",
    image: {
      src: carDetailing,
      alt: "Car care and detailing service",
    },
  },
];
