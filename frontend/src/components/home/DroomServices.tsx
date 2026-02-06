import { droomServices } from "../../const/droomServices";
import Button from "../../utility/Button";

const DroomServices = () => {

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full gap-6 flex-wrap">
        {droomServices.map((service, idx) => (
          <div
            className="rounded-lg bg-white flex-1 flex flex-col py-4 px-6 justify-between items-center text-black"
            key={idx}
          >
            <div className="flex gap-2">
              <input type="checkbox" name="" id="" />
              <p className="font-medium text-lg">{service.title}</p>
              <img src={service.iconSrc} />
            </div>
            <div className="flex text-sm items-center justify-between w-full">
              <img src={service.poweredBySrc} alt="Powered by Obv" />
              <div>
                {service.features.map((feature, fIdx) => (
                  <p key={fIdx}>- {feature}</p>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              {service.advantages.map((advantage, aIdx) => (
                <p className="text-sm" key={aIdx}>
                  - {advantage}
                </p>
              ))}
            </div>
            <p className="text-lg text-center text-green-500 font-bond my-1">
              Rs. {service.price}/-
            </p>
            <div className="flex items-center justify-center gap-4">
              <button className="hover:bg-primary hover:text-white border borer-primary text-primary px-6 py-2 rounded-md text-sm cursor-pointer">
                Buy Valuation Report
              </button>
              <p className="text-primary text-sm">Sample Report</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="checkbox" name="buyAll" id="" />
        <p>
          Buy all Services as bundle <span>Rs. 877</span> Rs. 749
        </p>
      </div>
      <Button title={"Buy Package Now Rs. 749/-"} className="w-fit" />
    </div>
  );
};

export default DroomServices;
