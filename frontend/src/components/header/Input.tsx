import { useState } from "react";
import search from "../../assets/header/magnifying-glass-solid-full.svg";
import { inputOptions } from "../../const";
import Dropdown from "../../utility/Dropdown";

const Input = () => {
  const [currOption, setCurrOption] = useState(inputOptions[0]);
  return (
    <div className="flex flex-row border border-gray-300 rounded-full overflow-hidden flex-4">
      <div className="flex justify-center items-center gap-1 px-6 bg-blue-50 cursor-pointer select-none">
        <Dropdown
          options={inputOptions}
          currOption={currOption}
          setCurrOption={setCurrOption}
        />
      </div>
      <input
        className="placeholder:text-gray-400 w-full px-3 outline-none"
        type="text"
        placeholder="Search Cars, Bikes and Scooters"
      />
      <div className="aspect-square p-1 mr-1 cursor-pointer">
        <div className="rounded-full p-2 bg-primary ">
          <img src={search} className="invert" alt="search" />
        </div>
      </div>
    </div>
  );
};

export default Input;
