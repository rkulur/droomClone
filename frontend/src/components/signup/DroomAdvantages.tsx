import { droomAdvantages } from "../../const/droomAdvantages";

const DroomAdvantages = () => {
  return (
    <div>
      <h2 className="text-white text-xl">Why Droom for Individual</h2>
      <div className="grid grid-cols-3 gap-4 mt-8">
        {droomAdvantages.map((adv, idx) => (
          <div className="text-white flex gap-4" key={idx}>
            <adv.icon size={24} />
            <p>{adv.advantage}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DroomAdvantages;
