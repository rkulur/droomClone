import { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { vehicleCategories } from "../../../const/vehicleCategories";
import Button from "../../../utility/Button";
import Underline from "../../../utility/Underline";

const VehicleSearchForm = () => {
  const [currCategory, setCurrCategory] = useState(vehicleCategories[0].name);
  const [preferredCondition, setPreferredCondition] = useState("Used");

  const conditions = ["Used", "New", "Both"];

  const handleCategorySelection = (idx: number) => {
    setCurrCategory(vehicleCategories[idx].name);
  };
  const handlePreferredCondition = (idx: number) => {
    setPreferredCondition(conditions[idx]);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl w-[32rem] px-16 py-8 flex flex-col gap-8 relative overflow-hidden">
      <div className="font-medium text-center flex flex-col gap-1">
        <p className="text-2xl">Your Requirements, Our Mission</p>
        <p className="text-xl text-gray-400">Your Perfect Vehicle Awaits</p>
        <div className="flex justify-center">
          <Underline className="w-1/6"/>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-center">Preferred Location*</p>
        <input
          type="text"
          className="outline-none border rounded-lg border-gray-400 px-2 py-3"
          placeholder="Enter your city"
        />
      </div>
      <div className="flex gap-1 text-primary w-full justify-center text-sm">
        <CiLocationOn className="size-6" />
        <p>Detect my location</p>
      </div>
      <div>
        <p className="text-center text-xl mb-4">What are you looking for?*</p>
        <div className="flex gap-5 absolute left-0 px-2">
          {vehicleCategories.map((category, idx) => (
            <div
              key={idx}
              className={`flex flex-col rounded-2xl w-20 h-20 aspect-square items-center justify-center ${currCategory === category.name ? "border border-primary bg-white" : "bg-gray-200"}`}
              onClick={() => handleCategorySelection(idx)}
            >
              <category.icon
                size={30}
                className={`${currCategory === category.name ? "text-primary" : "text-gray-600"}`}
              />
              <p
                className={`${currCategory === category.name && "text-primary"}`}
              >
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-center font-medium mt-20">
          What is your preferred condition?*
        </p>
        <div className="bg-gray-100 rounded-full flex">
          {conditions.map((condition, idx) => (
            <div
              className={`${condition === preferredCondition && "bg-primary text-white"} flex-1 text-center px-3 py-2 rounded-full cursor-pointer select-none`}
              key={idx}
              onClick={() => handlePreferredCondition(idx)}
            >
              {condition}
            </div>
          ))}
        </div>
      </div>
      <Button title={"Buy Your Vehicle"} />
    </div>
  );
};

export default VehicleSearchForm;
