import type { IconType } from "react-icons";
import { AiOutlineSync } from "react-icons/ai";
import { BiTargetLock } from "react-icons/bi";
import { FaAtom, FaBalanceScale } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

export const droomFeatures: { icon: IconType; name: string }[] = [
  {
    icon: HiSparkles,
    name: "Independent",
  },
  {
    icon: BiTargetLock,
    name: "Objective",
  },
  {
    icon: FaBalanceScale,
    name: "Unbiased",
  },
  {
    icon: FaAtom,
    name: "Scientific",
  },
  {
    icon: AiOutlineSync,
    name: "Comprehensive",
  },
];
