import { droomFeatures } from "../../const/droomFeatures";
import Underline from "../../utility/Underline";
import DroomServices from "./DroomServices";

const DiagnosticCenter = () => {
  return (
    <div className="pb-12 bg-white">
      <div className="w-fit px-horizontal ">
        <h2 className="text-3xl font-medium">Diagnostic Center</h2>
        <Underline className="w-2/8 mt-1" />
      </div>
      <div className="h-[36.5rem] diagnostic px-horizontal py-8 mt-6 text-white flex flex-col gap-4">
        <p className="text-2xl">
          Buy or Sell Anywhere | Get Award Winning Services from Droom
        </p>
        <div className="text-sm flex gap-6">
          {droomFeatures.map((feature, idx) => (
            <div key={idx} className="flex gap-1">
              <feature.icon size={20} />
              <p className="">{feature.name}</p>
            </div>
          ))}
        </div>
        <DroomServices/>
      </div>
    </div>
  );
};

export default DiagnosticCenter;
