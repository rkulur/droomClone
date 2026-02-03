import clsx from "clsx";
import Underline from "../../utility/Underline";
import { useState } from "react";
import { Link } from "react-router";
import { bikeBrands, carBrands, type Brand } from "../../const/brands";

const ShopByBrand = () => {
  const brandType = ["Car", "Bike", "Scooter"] as const;
  type BrandType = (typeof brandType)[number];
  const [selectedBrandType, setSelectedBrandType] = useState<BrandType>("Car");
  const [brandsList, setBrandsList] = useState<Brand[]>(bikeBrands);

  return (
    <div className="px-horizontal pb-12 bg-white">
      <div className="w-fit">
        <h2 className="text-3xl font-medium">Shop By Brand</h2>
        <Underline className="w-2/8 mt-1" />
      </div>
      <div className="flex gap-5 mt-6">
        {brandType.map((type, idx) => (
          <div
            key={idx}
            className={clsx(
              "rounded-full  py-2 px-6 border border-gray-400",
              selectedBrandType === type && "bg-primary text-white border-none",
            )}
            onClick={() => {
              setSelectedBrandType(type);
              if (type === "Car") setBrandsList(carBrands);
              if (type === "Bike") setBrandsList(bikeBrands);
              if (type === "Scooter") setBrandsList(bikeBrands);
            }}
          >
            {type}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center">
        {brandsList.map((brand, idx) => (
          <Link
            to={brand.link}
            className="w-24 h-24 m-4 flex items-center justify-center hover:scale-110 transition-all"
            key={idx}
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="max-h-full max-w-full object-contain"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopByBrand;
