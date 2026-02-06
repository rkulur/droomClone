import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type UnderlineProps = {
    className?: string;
};

const Underline = ({ className }: UnderlineProps) => {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-linear-to-r from-lime-400 to-cyan-700 h-1 rounded-full",
          className,
        ),
      )}
    ></div>
  );
};

export default Underline;
