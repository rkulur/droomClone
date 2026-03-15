import { useState } from "react";
import { Link } from "react-router";
import { Ellipsis, Gauge, MapPin, ShieldCheck, Fuel, Cog, Play, Camera } from "lucide-react";
import { BADGE_CONFIG, formatCurrency } from "@/constants/vehicleListing";
import { cn } from "@/lib/utils";
import type { VehicleListing } from "@/types/vehicle";

interface VehicleCardProps {
  listing: VehicleListing;
  category: string;
}

const VehicleCard = ({ listing, category }: VehicleCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const specs = [
    listing.mileage !== undefined
      ? {
          key: "mileage",
          icon: <Gauge className="size-3.5" />,
          label: listing.mileage.toLocaleString("en-IN"),
        }
      : null,
    listing.location.city
      ? {
          key: "city",
          icon: <MapPin className="size-3.5" />,
          label: listing.location.city,
        }
      : null,
    listing.fuelType
      ? {
          key: "fuel",
          icon: <Fuel className="size-3.5" />,
          label: listing.fuelType,
        }
      : null,
    listing.transmission
      ? {
          key: "transmission",
          icon: <Cog className="size-3.5" />,
          label: listing.transmission,
        }
      : null,
  ].filter(Boolean) as Array<{ key: string; icon: React.ReactNode; label: string }>;

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <Link
        to={`/vehicles/${category}/${listing.id}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <div className="absolute top-3 left-3 z-10 flex max-w-[80%] flex-col gap-2">
            {listing.sellerBadges?.map((badge) => {
              const config = BADGE_CONFIG[badge];
              if (!config) {
                return null;
              }

              return (
                <span
                  key={badge}
                  className="inline-flex w-fit items-center gap-1 rounded px-2 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: config.color }}
                >
                  <ShieldCheck className="size-3" />
                  {config.label}
                </span>
              );
            })}
          </div>
          {listing.images[0] ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No image available
            </div>
          )}
          {(listing.imageCount || listing.videoCount) && (
            <div className="absolute right-3 bottom-3 left-3 flex items-center gap-3 text-xs text-white">
              {listing.imageCount ? (
                <span className="inline-flex items-center gap-1 rounded bg-black/55 px-2 py-1">
                  <Camera className="size-3" />
                  {listing.imageCount}
                </span>
              ) : null}
              {listing.videoCount ? (
                <span className="inline-flex items-center gap-1 rounded bg-black/55 px-2 py-1">
                  <Play className="size-3" />
                  {listing.videoCount}s
                </span>
              ) : null}
            </div>
          )}
        </div>
      </Link>
      <div className="space-y-4 p-4">
        <div className="flex items-start gap-3">
          <Link
            to={`/vehicles/${category}/${listing.id}`}
            className="line-clamp-2 flex-1 text-xl leading-7 font-medium text-gray-900"
          >
            {listing.title}
          </Link>
          <div className="relative">
            <button
              type="button"
              aria-label="Open listing actions"
              className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Ellipsis className="size-4" />
            </button>
            {menuOpen ? (
              <div
                className="absolute top-10 right-0 z-20 min-w-28 rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg"
                onMouseLeave={() => setMenuOpen(false)}
              >
                {["Save", "Share", "Report"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="block w-full px-3 py-2 text-left hover:bg-gray-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex items-start justify-between gap-3 border-t border-gray-100 pt-3">
          <p className="text-2xl font-bold text-gray-900">₹ {formatCurrency(listing.price)}</p>
          <p className="text-right text-xs text-gray-400">
            {listing.emiFrom ? `EMI from ₹${formatCurrency(listing.emiFrom)}` : "EMI from N/A"}
          </p>
        </div>
        <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-gray-100 pt-3 text-xs text-gray-500")}>
          {specs.map((spec) => (
            <span key={spec.key} className="inline-flex items-center gap-1">
              {spec.icon}
              {spec.label}
            </span>
          ))}
          {listing.year ? <span>{listing.year}</span> : null}
        </div>
      </div>
    </article>
  );
};

export default VehicleCard;
