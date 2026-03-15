import { useState } from "react"
import { Fuel, MapPin, X } from "lucide-react"
import { Link } from "react-router"
import { formatCurrency } from "@/constants/vehicleListing"
import type { CartItem } from "@/types/cart"

interface CartItemRowProps {
  item: CartItem
  onRemove: (vehicleId: string) => void
}

const PLACEHOLDER_IMAGE = "/images/vehicle-placeholder.png"

const CartItemRow = ({ item, onRemove }: CartItemRowProps) => {
  const [imageSrc, setImageSrc] = useState(item.vehicle.images[0] || PLACEHOLDER_IMAGE)
  const vehicle = item.vehicle
  const specs = [
    vehicle.location.city
      ? {
          key: "location",
          icon: MapPin,
          label: vehicle.location.city,
        }
      : null,
    vehicle.fuelType
      ? {
          key: "fuelType",
          icon: Fuel,
          label: vehicle.fuelType,
        }
      : null,
    vehicle.transmission
      ? {
          key: "transmission",
          icon: null,
          label: vehicle.transmission,
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string
    icon: typeof MapPin | typeof Fuel | null
    label: string
  }>

  return (
    <article className="rounded-xl bg-white p-4 shadow-sm transition-colors hover:bg-slate-50">
      <div className="flex gap-4">
        <img
          src={imageSrc}
          alt={vehicle.title}
          className="h-[60px] w-[60px] rounded-[4px] object-cover"
          loading="lazy"
          onError={() => setImageSrc(PLACEHOLDER_IMAGE)}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <Link
              to={`/vehicles/${vehicle.category}/${vehicle.id}`}
              className="truncate text-base font-medium text-gray-900 hover:text-primary"
            >
              {vehicle.title}
            </Link>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Remove this vehicle from cart?")) {
                  onRemove(vehicle.id)
                }
              }}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
            >
              Remove
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
            {specs.map((spec) => (
              <span key={spec.key} className="inline-flex items-center gap-1">
                {spec.icon ? <spec.icon className="size-3.5" /> : null}
                {spec.label}
              </span>
            ))}
          </div>

          <p className="mt-3 text-lg font-semibold text-gray-900">
            ₹ {formatCurrency(vehicle.price)}
          </p>
        </div>
      </div>
    </article>
  )
}

export default CartItemRow
