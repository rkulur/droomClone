import type { IconType } from "react-icons";
import { BiSelection } from "react-icons/bi";
import {
  FaAward,
  FaHandHolding,
  FaRecycle,
  FaRupeeSign,
  FaSearch,
  FaTruck,
  FaUsers,
} from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";

type DroomAdvantagesType = {
  icon: IconType;
  advantage: string;
}[];

export const droomAdvantages: DroomAdvantagesType = [
  {
    icon: BiSelection,
    advantage: "Wide Selection",
  },
  {
    icon: MdOutlineAttachMoney,
    advantage: "Easy Loan & Insurance",
  },
  {
    icon: FaRecycle,
    advantage: "Transparent & Respectful Process",
  },
  {
    icon: FaRupeeSign,
    advantage: "Low prices",
  },
  {
    icon: FaTruck,
    advantage: "Home Delivery",
  },
  {
    icon: FaHandHolding,
    advantage: "Fair pricing & No Middleman",
  },
  {
    icon: FaSearch,
    advantage: "1100 Point Inspection",
  },
  {
    icon: FaAward,
    advantage: "Warranty & Return",
  },
  {
    icon: FaUsers,
    advantage: "React 15Mn Individuals & 20K Dealers",
  },
];
