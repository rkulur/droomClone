import { useLayoutEffect, useState } from "react";
import { dealsAndPromotions } from "../../const/dealsAndPromotions";
import { Link } from "react-router";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";

const Carousel = () => {
  const extendedCards = [
    dealsAndPromotions[dealsAndPromotions.length - 1],
    ...dealsAndPromotions,
    dealsAndPromotions[0],
  ];

  const VISIBLE_CARDS = 3;
  const CARD_WIDTH = 100 / VISIBLE_CARDS;

  const [index, setIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isSliding, setIsSliding] = useState(false);

  const next = () => {
    if (isSliding) return;
    setIsSliding(true);
    setIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (isSliding) return;
    setIsSliding(true);
    setIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    setIsSliding(false);

    if (index === extendedCards.length - 1) {
      setIsAnimating(false);
      setIndex(1);
    }

    if (index === 0) {
      setIsAnimating(false);
      setIndex(extendedCards.length - 2);
    }
  };

  useLayoutEffect(() => {
    if (!isAnimating) {
      requestAnimationFrame(() => setIsAnimating(true));
    }
  }, [isAnimating]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className={`flex gap-3 w-full ${
          isAnimating ? "transition-transform duration-600" : ""
        }`}
        style={{ transform: `translateX(-${index * CARD_WIDTH}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedCards.map((card, i) => (
          <Link
            to={card.link}
            key={i}
            className="shrink-0 rounded-xl overflow-hidden"
            style={{ width: `${CARD_WIDTH - 0.75}%` }}
          >
            <img src={card.img} className="w-full h-full object-cover" />
          </Link>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2  px-2 py-8  hover:bg-primary cursor-pointer hover:text-white"
        disabled={isSliding}
      >
        <BiLeftArrow size={20} />
      </button>

      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-8 hover:bg-primary cursor-pointe hover:text-white"
        disabled={isSliding}
      >
        <BiRightArrow size={20} />
      </button>
    </div>
  );
};

export default Carousel;
