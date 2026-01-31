import Navigation from "./Navigation";
import TopSection from "./TopSection";

const Header = () => {
  return (
    <div className="border-b border-gray-300 bg-white">
      <TopSection />
      <Navigation />
    </div>
  );
};

export default Header;
