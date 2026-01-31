
type ButtonProps = {
  title: string;
  className?: string;
  handleClick?: () => void;
};

const Button = ({ title, className, handleClick }: ButtonProps) => {
  return (
    <div
      className={`${className ?? ""} w-full px-6 py-4 rounded bg-[#2699FA] text-white cursor-pointer active:scale-[98%] transition-all text-center`}
      onClick={handleClick}
    >
      {title}
    </div>
  );
};

export default Button;
