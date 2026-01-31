import type { IconType } from "react-icons";
import { BsBicycle, BsScooter, BsTruck } from "react-icons/bs";
import { CiPlane } from "react-icons/ci";
import { FaBus, FaCar } from "react-icons/fa";
import { FaMotorcycle } from "react-icons/fa6";
import { MdElectricCar } from "react-icons/md";

type VehicleCategories = {
  name: string;
  icon: IconType;
}[];

export const vehicleCategories: VehicleCategories = [
  {
    name: "Car",
    icon: FaCar,
  },
  {
    name: "Bike",
    icon: FaMotorcycle,
  },
  {
    name: "Scooter",
    icon: BsScooter,
  },
  {
    name: "EV",
    icon: MdElectricCar,
  },
  {
    name: "Plane",
    icon: CiPlane,
  },
  {
    name: "Bus",
    icon: FaBus,
  },
  {
    name: "Bicycle",
    icon: BsBicycle,
  },
  {
    name: "Truck",
    icon: BsTruck,
  },
];
