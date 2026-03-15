import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VehicleDescriptionBlockProps {
  description: string
  engineDisplacement?: number
}

const VehicleDescriptionBlock = ({
  description,
  engineDisplacement,
}: VehicleDescriptionBlockProps) => {
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isClampNeeded, setIsClampNeeded] = useState(false)

  useEffect(() => {
    const element = descriptionRef.current
    if (!element) {
      return
    }

    setIsClampNeeded(element.scrollHeight > element.clientHeight + 1)
  }, [description, isExpanded])

  return (
    <Card className="gap-0 rounded-xl border border-gray-100 py-0 shadow-sm">
      <CardHeader className="border-b px-6 py-5">
        <CardTitle className="text-2xl text-gray-900">Vehicle Description</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-6 py-5 text-sm leading-7 text-gray-600">
        <p
          ref={descriptionRef}
          className={
            isExpanded
              ? ""
              : "overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
          }
        >
          {description}
        </p>
        {engineDisplacement !== undefined ? (
          <div>
            <p>The specifications of the vehicle include:</p>
            <p>- Engine Displacement: {engineDisplacement} cc</p>
          </div>
        ) : null}
        {isClampNeeded ? (
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            className="text-sm font-medium text-primary hover:underline"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default VehicleDescriptionBlock
