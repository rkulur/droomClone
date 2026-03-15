import { CheckCircle2, XCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { FeatureGroup } from "@/types/vehicleDetail"

interface OptionsAndFeaturesProps {
  groups?: FeatureGroup[]
  isLoading: boolean
}

const OptionsAndFeatures = ({ groups = [], isLoading }: OptionsAndFeaturesProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-gray-200 bg-white p-5">
            <Skeleton className="h-5 w-40" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((__, rowIndex) => (
                <Skeleton key={rowIndex} className="h-5 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!groups.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-8 text-center text-sm text-gray-500">
        Features not available
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <section key={group.groupTitle} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">{group.groupTitle}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {group.features.map((feature) => (
              <div
                key={`${group.groupTitle}-${feature.label}`}
                className={`flex items-center gap-2 text-sm ${feature.available ? "text-gray-700" : "text-gray-400"}`}
              >
                {feature.available ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <XCircle className="size-4 text-gray-300" />
                )}
                <span>{feature.label}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default OptionsAndFeatures
