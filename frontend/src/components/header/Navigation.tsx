import { useNavigate } from "react-router";
import { MdMenuBook } from "react-icons/md";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

const Navigation = () => {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const navs = [
    "Buy Used",
    "Buy New",
    "Sell/Exchange",
    "Loan",
    "Rental",
    "Diagnostic Reports",
    "Anciliary Services",
  ];

  return (
    <nav className="px-horizontal flex justify-between py-0.5">
      <div className="flex items-center gap-8">
        <div className="navElem flex gap-2 place-items-center">
          <MdMenuBook className="size-6" />
          Menu
        </div>
        {navs.map((nav, idx) => (
          <div
            className="navElem font-medium border-b-2 border-transparent hover:text-primary hover:border-primary"
            key={`${nav}${idx}`}
          >
            <a href="#">{nav}</a>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => navigate("/cart-summary")}
        className="relative inline-flex items-center justify-center rounded-full p-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-primary"
        aria-label="Open cart summary"
      >
        <ShoppingCart className="size-5" />
        {itemCount > 0 ? (
          <span className="absolute top-0 right-0 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#1976d2] px-1 text-[10px] leading-none text-white">
            {itemCount}
          </span>
        ) : null}
      </button>
    </nav>
  );
};

export default Navigation;
