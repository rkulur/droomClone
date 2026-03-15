import { Link } from "react-router"
import { normalizeSlug } from "@/constants/vehicleListing"
import type { VehicleDetail } from "@/types/vehicleDetail"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface DetailBreadcrumbProps {
  category: string
  vehicle: VehicleDetail
}

const titleCase = (value: string) =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")

const buildItems = (category: string, vehicle: VehicleDetail): BreadcrumbItem[] => {
  const normalizedCategory = normalizeSlug(category)
  const brandSlug = normalizeSlug(vehicle.brand)
  const modelSlug = normalizeSlug(vehicle.vehicleInfo.model)

  return [
    { label: "Home", href: "/" },
    {
      label: titleCase(normalizedCategory),
      href: normalizedCategory ? `/vehicles/${normalizedCategory}` : undefined,
    },
    vehicle.condition
      ? {
          label: titleCase(vehicle.condition),
          href: `/vehicles/${normalizedCategory}?condition=${vehicle.condition}`,
        }
      : null,
    vehicle.brand
      ? {
          label: vehicle.brand,
          href: `/vehicles/${normalizedCategory}?brand=${brandSlug}`,
        }
      : null,
    vehicle.vehicleInfo.model
      ? {
          label: vehicle.vehicleInfo.model,
          href: `/vehicles/${normalizedCategory}?brand=${brandSlug}&model=${modelSlug}`,
        }
      : null,
    vehicle.trim ? { label: vehicle.trim } : null,
    vehicle.year ? { label: String(vehicle.year) } : null,
  ].filter(Boolean) as BreadcrumbItem[]
}

const DetailBreadcrumb = ({ category, vehicle }: DetailBreadcrumbProps) => {
  const items = buildItems(category, vehicle)

  return (
    <nav className="flex flex-wrap items-center gap-y-1 text-sm text-gray-500">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center">
          {item.href ? (
            <Link to={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700">{item.label}</span>
          )}
          {index < items.length - 1 ? <span className="mx-2 text-gray-300">/</span> : null}
        </span>
      ))}
    </nav>
  )
}

export default DetailBreadcrumb
