import { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { RxCrossCircled } from "react-icons/rx";
import caretDown from "../../assets/header/caret-down-solid-full.svg";
import locationPin from "../../assets/header/location-dot-solid-full.svg";
import { popularCities } from "../../const/location";

const SelectLocation = () => {
  const [open, setOpen] = useState(false);
  const [currCity, setCurrCity] = useState(popularCities[0].name);

  const handleCurrCity = (idx: number) => {
    setCurrCity(popularCities[idx].name);
    setOpen(!open);
  };
  return (
    <>
      <div
        className="flex border border-gray-300 place-items-center px-4 rounded-full gap-1.5 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <img src={locationPin} className="size-5" alt="location" />
        <div className="flex place-items-center gap-1">
          <p>{currCity}</p>
          <img src={caretDown} className="size-4 color-gray-400" alt="select" />
        </div>
      </div>

      {open && (
        <div className="absolute bg-white border border-gray-300 rounded-lg py-8 px-12 top-12 w-[32.5rem] flex flex-col gap-4 z-50">
          <div>
            <RxCrossCircled
              className="size-6 absolute right-2 top-2 cursor-pointer active:scale-90 transition-all"
              onClick={() => setOpen(!open)}
            />
          </div>
          <h2 className="font-bold text-xl">Please Select Your Location</h2>
          <div>
            <input
              type="text"
              value={currCity}
              className="w-full rounded-lg border border-gray-300 py-2 px-3 placeholder:text-gray-400"
              placeholder="Enter your city"
            />
          </div>
          <button className="flex gap-1 text-primary w-full justify-center text-sm">
            <CiLocationOn className="size-6" />
            <p>Detect my location</p>
          </button>
          <h3 className="font-bold text-lg text-center">Popular Cities</h3>
          <div className="flex flex-wrap gap-4 justify-evenly items-center">
            {popularCities.map((city, idx) => (
              <div
                className="flex flex-col items-center"
                onClick={() => handleCurrCity(idx)}
              >
                <img
                  src={
                    currCity === city.name
                      ? city.imgSrc.active
                      : city.imgSrc.inActive
                  }
                  alt=""
                />
                <p>{city.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SelectLocation;
