import {
  CalendarDays,
  CarFront,
  ClipboardList,
  Cog,
  Droplets,
  Gauge,
  MapPin,
  ScissorsLineDashed,
  UserRound,
  Wrench,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { VehicleInfo } from "@/types/vehicleDetail"

interface VehicleInfoPanelProps {
  vehicleInfo: VehicleInfo
  isLoading: boolean
}

const rows = [
  { key: "registrationYear", label: "Registration Year", icon: CalendarDays, getValue: (info: VehicleInfo) => info.registrationYear?.toString() },
  { key: "make", label: "Make", icon: Wrench, getValue: (info: VehicleInfo) => info.make },
  { key: "model", label: "Model", icon: CarFront, getValue: (info: VehicleInfo) => info.model },
  { key: "trim", label: "Trim", icon: ScissorsLineDashed, getValue: (info: VehicleInfo) => info.trim },
  { key: "kmsDriven", label: "KMs Driven", icon: Gauge, getValue: (info: VehicleInfo) => info.kmsDriven !== undefined ? `${info.kmsDriven.toLocaleString("en-IN")} Km` : undefined },
  { key: "numberOfOwners", label: "No. of Owners", icon: UserRound, getValue: (info: VehicleInfo) => info.numberOfOwners?.toString() },
  { key: "transmission", label: "Transmission", icon: Cog, getValue: (info: VehicleInfo) => info.transmission },
  { key: "fuelType", label: "Fuel Type", icon: Droplets, getValue: (info: VehicleInfo) => info.fuelType },
  { key: "bodyType", label: "Body Type", icon: CarFront, getValue: (info: VehicleInfo) => info.bodyType },
  { key: "registrationState", label: "Registration", icon: ClipboardList, getValue: (info: VehicleInfo) => info.registrationState },
  { key: "location", label: "Location", icon: MapPin, getValue: (info: VehicleInfo) => info.location },
] as const

const iconColors = [
  "text-sky-500",
  "text-emerald-500",
  "text-cyan-500",
  "text-violet-500",
  "text-amber-500",
  "text-pink-500",
  "text-lime-500",
  "text-orange-500",
  "text-blue-500",
  "text-indigo-500",
  "text-teal-500",
]

const VehicleInfoPanel = ({ vehicleInfo, isLoading }: VehicleInfoPanelProps) => {
  const visibleRows = rows.filter((row) => {
    const value = row.getValue(vehicleInfo)
    return value !== undefined && value !== null && value !== ""
  })

  return (
    <Card className="gap-0 rounded-xl border-0 py-0 shadow-[0_6px_24px_rgba(15,23,42,0.08)]">
      <CardHeader className="border-b px-6 py-5">
        <CardTitle className="text-[1.75rem] text-gray-900">Vehicle Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-6 py-5">
        {isLoading
          ? Array.from({ length: 11 }).map((_, index) => (
              <div key={index} className="grid grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-3">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))
          : visibleRows.map((row, index) => {
              const Icon = row.icon

              return (
                <div key={row.key} className="grid grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-3 text-sm">
                  <Icon className={`size-4.5 ${iconColors[index % iconColors.length]}`} strokeWidth={1.8} />
                  <span className="text-gray-500">{row.label}</span>
                  <span className="text-right font-normal text-gray-900">{row.getValue(vehicleInfo)}</span>
                </div>
              )
            })}
      </CardContent>
    </Card>
  )
}

export default VehicleInfoPanel
