import Underline from "../../utility/Underline";
import { automobileCenter } from "../../const/automobileCenter";
import { Link } from "react-router";

const AutomobileCenter = () => {
  return (
    <div className="px-horizontal pb-12 bg-white">
      <div className="w-fit">
        <h2 className="text-3xl font-medium">Automobile Center</h2>
        <Underline className="w-2/8 mt-1" />
      </div>
      <div className="flex flex-wrap gap-15 justify-center mt-8">
        {automobileCenter.map((vehicle, idx) => (
          <Link
            to={vehicle.link}
            className="flex flex-col items-center origin-center hover:scale-110 transition-all"
            key={idx}
          >
            <div className="w-fit rounded-full bg-gray-200 aspect-square">
              <img
                src={vehicle.imageSrc}
                className="w-30 aspect-square object-contain"
                alt={vehicle.imageAlt}
              />
            </div>
            <p className="">{vehicle.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AutomobileCenter;
