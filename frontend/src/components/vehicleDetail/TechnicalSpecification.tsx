import { useEffect, useMemo, useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { SpecSection } from "@/types/vehicleDetail"

interface TechnicalSpecificationProps {
  sections?: SpecSection[]
  isLoading: boolean
}

const getInitialOpenKey = (sections: SpecSection[]) => {
  const defaultOpen = sections.find((section) => section.defaultOpen)
  if (defaultOpen) {
    return defaultOpen.key
  }

  return sections[1]?.key ?? sections[0]?.key ?? null
}

const chunkFields = (fields: SpecSection["fields"]) => {
  const rows: Array<Array<SpecSection["fields"][number]>> = []

  for (let index = 0; index < fields.length; index += 2) {
    rows.push(fields.slice(index, index + 2))
  }

  return rows
}

const TechnicalSpecification = ({ sections = [], isLoading }: TechnicalSpecificationProps) => {
  const initialOpenKey = useMemo(() => getInitialOpenKey(sections), [sections])
  const [openKey, setOpenKey] = useState<string | null>(initialOpenKey)

  useEffect(() => {
    setOpenKey(initialOpenKey)
  }, [initialOpenKey])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-gray-200 bg-white px-4 py-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="size-5" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!sections.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-8 text-center text-sm text-gray-500">
        Specifications not available
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {sections.map((section, index) => {
        const isOpen = openKey === section.key
        const fieldRows = chunkFields(section.fields)

        return (
          <div key={section.key} className={index < sections.length - 1 ? "border-b border-gray-200" : ""}>
            <button
              type="button"
              onClick={() => setOpenKey((current) => (current === section.key ? null : section.key))}
              className="flex w-full items-center justify-between px-4 py-4 text-left"
            >
              <span className="text-base font-medium text-gray-800">{section.title}</span>
              {isOpen ? <Minus className="size-4 text-gray-500" /> : <Plus className="size-4 text-gray-500" />}
            </button>
            {isOpen && fieldRows.length ? (
              <div className="px-4 pb-4">
                <div className="overflow-hidden rounded-md">
                  {fieldRows.map((row, rowIndex) => (
                    <div
                      key={`${section.key}-${rowIndex}`}
                      className={`grid gap-4 px-4 py-4 md:grid-cols-2 ${rowIndex % 2 === 0 ? "bg-[#EEF4FF]" : "bg-[#F8FBFF]"}`}
                    >
                      {row.map((field) => (
                        <div
                          key={`${section.key}-${field.label}`}
                          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 text-sm"
                        >
                          <span className="font-medium text-gray-800">{field.label}</span>
                          <span className="text-right text-gray-900">{field.value}</span>
                        </div>
                      ))}
                      {row.length === 1 ? <div /> : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export default TechnicalSpecification
