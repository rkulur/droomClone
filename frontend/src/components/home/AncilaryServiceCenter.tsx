import { Link } from "react-router";
import { ancilaryServices } from "../../const/ancilaryServices";
import Underline from "../../utility/Underline";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const AncilaryServiceCenter = () => {
  return (
    <div className="px-horizontal pb-12 bg-white">
      <div className="w-fit mb-4">
        <h2 className="text-3xl font-medium">Ancilary Service Center</h2>
        <Underline className="w-2/8 mt-1" />
      </div>
      <Carousel>
        <CarouselContent>
          {ancilaryServices.map((services, idx) => (
            <CarouselItem key={idx} className="basis-1/4">
              <Link
                to={"#"}
                className="border rounded-lg flex flex-col items-center px-2 py-4 w-full h-full justify-between"
              >
                <div>
                  <p className="text-gray-500 text-sm text-center">
                    {services.tagline}
                  </p>
                  <p>{services.title}</p>
                </div>
                <img src={services.image.src} alt={services.image.alt} />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default AncilaryServiceCenter;
