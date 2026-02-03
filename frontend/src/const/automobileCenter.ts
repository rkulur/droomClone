import bicycle from "../assets/home/automobileCenter/bicycle.webp";
import bike from "../assets/home/automobileCenter/bike.webp";
import bus from "../assets/home/automobileCenter/bus.webp";
import car from "../assets/home/automobileCenter/car.webp";
import construction from "../assets/home/automobileCenter/construction.webp";
import ev from "../assets/home/automobileCenter/ev.webp";
import plane from "../assets/home/automobileCenter/plane.webp";
import scooter from "../assets/home/automobileCenter/scooter.webp";
import taxi from "../assets/home/automobileCenter/taxi.webp";
import tractor from "../assets/home/automobileCenter/tractor.webp";
import truck from "../assets/home/automobileCenter/truck.webp";

type AutomobileCenter = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  link: string;
};

export const automobileCenter: AutomobileCenter[] = [
  {
    title: "Car",
    imageSrc: car,
    imageAlt: "Car",
    link: "/car",
  },
  {
    title: "Bike",
    imageSrc: bike,
    imageAlt: "Bike",
    link: "/bike",
  },
  {
    title: "Scooter",
    imageSrc: scooter,
    imageAlt: "Scooter",
    link: "/scooter",
  },
  {
    title: "Electric Vehicle",
    imageSrc: ev,
    imageAlt: "Electric Vehicle",
    link: "/electric-vehicle",
  },
  {
    title: "Bicycle",
    imageSrc: bicycle,
    imageAlt: "Bicycle",
    link: "/bicycle",
  },
  {
    title: "Plane",
    imageSrc: plane,
    imageAlt: "Plane",
    link: "/plane",
  },
  {
    title: "Taxi",
    imageSrc: taxi,
    imageAlt: "Taxi",
    link: "/taxi",
  },
  {
    title: "Bus",
    imageSrc: bus,
    imageAlt: "Bus",
    link: "/bus",
  },
  {
    title: "Truck",
    imageSrc: truck,
    imageAlt: "Truck",
    link: "/truck",
  },
  {
    title: "Tractor",
    imageSrc: tractor,
    imageAlt: "Tractor",
    link: "/tractor",
  },
  {
    title: "Construction Vehicle",
    imageSrc: construction,
    imageAlt: "Construction Vehicle",
    link: "/construction",
  },
];

