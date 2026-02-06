import AncilaryServiceCenter from "./AncilaryServiceCenter";
import AutomobileCenter from "./AutomobileCenter";
import DealsAndPromotions from "./DealsAndPromotions";
import DiagnosticCenter from "./DiagnosticCenter";
import Hero from "./hero";
import "./index.css";
import ShopByBrand from "./ShopByBrand";

const Home = () => {
  return (
    <div>
      <Hero />
      <AutomobileCenter />
      <ShopByBrand />
      <DiagnosticCenter />
      <DealsAndPromotions />
      <AncilaryServiceCenter />
    </div>
  );
};

export default Home;
