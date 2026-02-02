import heroBanner from "../../../assets/home/homepage_banner_c8e60ecef1.png.webp";
import polygon from "../../../assets/home/Polygon.webp";
import { droomInfo } from "../../../const/droomInfo";
import PricingTicker from "./PricingTicker";
import VehicleSearchForm from "./VehicleSearchForm";

const Hero = () => {
  return (
    <div className="bg-white relative pb-12">
      <img
        src={heroBanner}
        className="h-[34rem] w-full heroBanner object-contain"
      />
      <div className="flex px-horizontal gap-12 py-8">
        {droomInfo.map((info, idx) => (
          <div className="object-contain relative w-fit py-4 z-10" key={idx}>
            <img src={polygon} className="z-[-1] top-0 left-0 absolute" />
            <p className="font-semibold text-4xl">{info.value}</p>
            <p>{info.title}</p>
          </div>
        ))}
      </div>
      <div className="absolute z-10 right-70 top-5">
        <VehicleSearchForm />
      </div>
      <div className="px-horizontal w-full">
        <PricingTicker />
      </div>
    </div>
  );
};

export default Hero;
