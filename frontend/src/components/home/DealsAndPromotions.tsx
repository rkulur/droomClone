import { dealsAndPromotions } from "../../const/dealsAndPromotions";
import Underline from "../../utility/Underline";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const DealsAndPromotions = () => {
  return (
    <div className="px-horizontal pb-12 bg-white">
      <div className="w-fit mb-4">
        <h2 className="text-3xl font-medium">Deals & Promotions</h2>
        <Underline className="w-2/8 mt-1" />
      </div>
      <Carousel>
        <CarouselContent>
          {dealsAndPromotions.map((deal, index) => (
            <CarouselItem key={index} className="basis-1/3">
              <img
                src={deal.img}
                alt={`Deal ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default DealsAndPromotions;
