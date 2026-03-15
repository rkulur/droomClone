import { Link, useParams } from "react-router"
import { AlertCircle } from "lucide-react"
import DetailBreadcrumb from "@/components/vehicleDetail/DetailBreadcrumb"
import DetailPageSkeleton from "@/components/vehicleDetail/DetailPageSkeleton"
import VehicleDescriptionBlock from "@/components/vehicleDetail/VehicleDescriptionBlock"
import VehicleGallery from "@/components/vehicleDetail/VehicleGallery"
import VehicleInfoPanel from "@/components/vehicleDetail/VehicleInfoPanel"
import VehicleTabSection from "@/components/vehicleDetail/VehicleTabSection"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, normalizeSlug } from "@/constants/vehicleListing"
import { useVehicleDetail } from "@/hooks/useVehicleDetail"

const VehicleDetailPage = () => {
  const { category: rawCategory, id: rawId } = useParams()

  const category = normalizeSlug(rawCategory)
  const id = rawId?.trim() ?? ""
  const { vehicle, isLoading, error, refetch, notFound } = useVehicleDetail(id)

  if (isLoading) {
    return (
      <main className="px-horizontal mx-auto max-w-[1600px] py-8">
        <DetailPageSkeleton />
      </main>
    )
  }

  if (notFound) {
    return (
      <main className="px-horizontal mx-auto max-w-[1600px] py-10">
        <Card className="rounded-xl border border-gray-200 py-0 text-center shadow-sm">
          <CardContent className="px-6 py-12">
            <h1 className="text-3xl font-semibold text-gray-900">Vehicle not found</h1>
            <p className="mt-2 text-gray-600">
              The listing you were looking for is unavailable or may have been removed.
            </p>
            <Button asChild className="mt-5">
              <Link to={`/vehicles/${category}`}>Back to listings</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (error || !vehicle) {
    return (
      <main className="px-horizontal mx-auto max-w-[1600px] py-10">
        <Card className="rounded-xl border border-red-200 py-0 shadow-sm">
          <CardContent className="flex flex-col items-center px-6 py-12 text-center">
            <AlertCircle className="size-10 text-red-500" />
            <h1 className="mt-4 text-3xl font-semibold text-gray-900">Unable to load vehicle</h1>
            <p className="mt-2 max-w-xl text-gray-600">
              {error?.message || "Something went wrong while fetching this listing."}
            </p>
            <Button className="mt-5" onClick={refetch}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="px-horizontal mx-auto max-w-[1600px] space-y-6 py-8">
      <DetailBreadcrumb category={category} vehicle={vehicle} />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_380px]">
        <div className="space-y-5">
          <VehicleGallery
            images={vehicle.images}
            imageCount={vehicle.imageCount}
            title={vehicle.title}
            registrationNumber={vehicle.registrationState}
          />
          <Card className="gap-0 rounded-xl border-0 py-0 shadow-sm">
            <CardContent className="flex flex-wrap items-start justify-between gap-4 px-6 py-5">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">{vehicle.title}</h1>
                <p className="mt-2 text-sm text-gray-500">
                  {vehicle.location.city}
                  {vehicle.year ? ` • ${vehicle.year}` : ""}
                  {vehicle.fuelType ? ` • ${vehicle.fuelType}` : ""}
                  {vehicle.transmission ? ` • ${vehicle.transmission}` : ""}
                </p>
              </div>
              <div className="text-left lg:text-right">
                <p className="text-3xl font-bold text-gray-900">₹ {formatCurrency(vehicle.price)}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {vehicle.emiFrom ? `EMI from ₹${formatCurrency(vehicle.emiFrom)}` : "EMI not available"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <VehicleInfoPanel vehicleInfo={vehicle.vehicleInfo} isLoading={false} />
        </div>
      </section>

      <VehicleDescriptionBlock
        description={vehicle.description}
        engineDisplacement={vehicle.engineDisplacement}
      />

      <VehicleTabSection vehicle={vehicle} defaultTab="technical" />
    </main>
  )
}

export default VehicleDetailPage
