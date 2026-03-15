import { useId, useMemo, useRef, useState } from "react"
import { Camera, ChevronRight, Heart, Share2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const PLACEHOLDER_IMAGE = "/images/vehicle-placeholder.png"

interface VehicleGalleryProps {
  images: string[]
  imageCount: number
  title: string
  registrationNumber?: string
}

const VehicleGallery = ({
  images,
  imageCount,
  title,
  registrationNumber,
}: VehicleGalleryProps) => {
  const checkboxId = useId()
  const stripRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isCompared, setIsCompared] = useState(false)

  const galleryImages = useMemo(
    () => (images.length > 0 ? images : [PLACEHOLDER_IMAGE]),
    [images],
  )

  const activeImage = galleryImages[activeIndex] ?? galleryImages[0] ?? PLACEHOLDER_IMAGE
  const showThumbnails = galleryImages.length > 1

  const handleShare = async () => {
    const url = window.location.href

    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }

      await navigator.clipboard.writeText(url)
    } catch {
      // Ignore share failures for now.
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border-2 border-[#e05c2a] bg-white shadow-sm">
        <img
          src={activeImage}
          alt={title}
          loading={activeIndex === 0 ? "eager" : "lazy"}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.src = PLACEHOLDER_IMAGE
          }}
        />
        <div className="absolute top-4 right-4 flex flex-col gap-3">
          <button
            type="button"
            aria-label="Toggle wishlist"
            onClick={() => setIsWishlisted((current) => !current)}
            className="flex size-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-md"
          >
            <Heart className={cn("size-5", isWishlisted && "fill-red-500 text-red-500")} />
          </button>
          <button
            type="button"
            aria-label="Share vehicle"
            onClick={() => {
              void handleShare()
            }}
            className="flex size-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-md"
          >
            <Share2 className="size-5" />
          </button>
        </div>
        {galleryImages.length > 1 ? (
          <button
            type="button"
            aria-label="Next image"
            onClick={() => setActiveIndex((current) => (current + 1) % galleryImages.length)}
            className="absolute top-1/2 right-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-md bg-black/40 text-white"
          >
            <ChevronRight className="size-5" />
          </button>
        ) : null}
        <div className="absolute right-4 bottom-4 flex items-center gap-3">
          {registrationNumber ? (
            <span className="rounded-md bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
              {registrationNumber}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 rounded-full bg-black/65 px-3 py-1.5 text-xs font-medium text-white">
            <Camera className="size-3.5" />
            {imageCount || galleryImages.length}
          </span>
        </div>
      </div>

      {showThumbnails ? (
        <div className="relative">
          <div
            ref={stripRef}
            className="flex gap-3 overflow-x-auto pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-18 w-24 shrink-0 overflow-hidden rounded-lg border-2 bg-white",
                  index === activeIndex ? "border-[#e05c2a]" : "border-transparent",
                )}
              >
                <img
                  src={image}
                  alt={`${title} thumbnail ${index + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = PLACEHOLDER_IMAGE
                  }}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Scroll thumbnails"
            onClick={() => stripRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
            className="absolute top-1/2 right-0 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-md"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      ) : null}

      <label htmlFor={checkboxId} className="inline-flex items-center gap-2 text-sm text-gray-600">
        <Checkbox
          id={checkboxId}
          checked={isCompared}
          onCheckedChange={(checked) => setIsCompared(Boolean(checked))}
        />
        Add to Compare
      </label>
    </div>
  )
}

export default VehicleGallery
