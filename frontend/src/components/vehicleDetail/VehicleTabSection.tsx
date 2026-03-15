import { useState } from "react"
import { cn } from "@/lib/utils"
import type { VehicleDetail } from "@/types/vehicleDetail"
import OptionsAndFeatures from "./OptionsAndFeatures"
import RatingsAndReviews from "./RatingsAndReviews"
import TechnicalSpecification from "./TechnicalSpecification"

export type TabKey = "options" | "technical" | "reviews"

interface VehicleTabSectionProps {
  vehicle: VehicleDetail
  defaultTab?: TabKey
  isLoading?: boolean
}

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "options", label: "Options & Features" },
  { key: "technical", label: "Technical Specification" },
  { key: "reviews", label: "Rating & Reviews" },
]

const VehicleTabSection = ({
  vehicle,
  defaultTab = "technical",
  isLoading = false,
}: VehicleTabSectionProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "border-primary bg-primary text-white"
                : "border-gray-300 bg-white text-gray-700",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "options" ? (
        <OptionsAndFeatures groups={vehicle.optionsAndFeatures} isLoading={isLoading} />
      ) : null}
      {activeTab === "technical" ? (
        <TechnicalSpecification sections={vehicle.technicalSpecs} isLoading={isLoading} />
      ) : null}
      {activeTab === "reviews" ? (
        <RatingsAndReviews data={vehicle.ratingsAndReviews} isLoading={isLoading} />
      ) : null}
    </div>
  )
}

export default VehicleTabSection
