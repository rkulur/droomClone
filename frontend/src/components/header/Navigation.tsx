import { MdMenuBook } from "react-icons/md";

const Navigation = () => {
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
    </nav>
  );
};

export default Navigation;
