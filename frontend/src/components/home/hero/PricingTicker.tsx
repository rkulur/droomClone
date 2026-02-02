import { FaCar, FaMotorcycle } from "react-icons/fa";
import lion from "../../../assets/home/lion-img-web.png.webp";
import meter from "../../../assets/home/meter@2x.png.webp";
import { useState } from "react";
import { bikeCards, carCards, type VehicleCard } from "../../../const/vehicle";
import img from "../../../assets/home/Polygon.webp";

const PricingTicker = () => {
  const [carCondition, setCarCondition] = useState<"used" | "new">("used");
  const [vehicleType, setVehicleType] = useState<"car" | "motorcycle">("car");
  const [carouselDisplay, setCarouselDisplay] = useState<VehicleCard[]>(carCards);

  const selectCarCondition = (condition: "used" | "new") => {
    setCarCondition(condition);
  };

  const selectVehicleType = (type: "car" | "motorcycle") => {
    setVehicleType(type);
    if (type === "car") {
      setCarouselDisplay(carCards);
    } else {
      setCarouselDisplay(bikeCards);
    }
  };

  return (
    <>
      <p className="mb-5 text-lg">Pricing Ticker</p>
      <div className="w-full shadow-lg flex rounded-lg">
        <div className="flex gap-2 pl-4 py-2 bg-white flex-1">
          <img src={lion} alt="Lion Image" className="" />
          <img src={meter} alt="Meter Image" className="w-48 object-contain" />
          <div className="flex flex-col justify-center gap-2 text-sm">
            <div className="flex rounded-full bg-gray-200 cursor-pointer">
              <div
                className={`py-1 px-3 rounded-full  flex-1 ${carCondition === "used" && "bg-orange-500 text-white"}`}
                onClick={() => selectCarCondition("used")}
              >
                Used
              </div>
              <div
                className={`py-1 px-3 rounded-full  flex-1 ${carCondition === "new" && "bg-orange-500 text-white"}`}
                onClick={() => selectCarCondition("new")}
              >
                New
              </div>
            </div>
            <div className="flex rounded-full bg-gray-200">
              <FaCar
                className={`size-6 flex-1 py-1 px-1.5 rounded-full ${vehicleType === "car" && "bg-orange-500 text-white"}`}
                onClick={() => selectVehicleType("car")}
              />
              <FaMotorcycle
                className={`size-6 flex-1 py-1 px-1.5 rounded-full ${vehicleType === "motorcycle" && "bg-orange-500 text-white"}`}
                onClick={() => selectVehicleType("motorcycle")}
              />
            </div>
          </div>
        </div>
        <div className="flex-2 overflow-hidden ">
          <div className="slide-left group-hover:[animation-play-state:paused]">
            <div className="flex gap-30">
              {[...carouselDisplay, ...carouselDisplay].map((car) => (
                <div className="flex gap-1 h-full">
                  <img src={img} className="aspect-square" alt="" />
                  <div className="">
                    <p className="text-lg font-medium ">Rs.{car.price}</p>
                    <p className="text-gray-600 text-nowrap text-sm">
                      {car.model}
                    </p>
                    <p className="text-gray-600 text-sm">{car.variant}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingTicker;
