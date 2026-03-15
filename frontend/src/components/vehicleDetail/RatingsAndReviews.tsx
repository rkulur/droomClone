import { Star } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { ReviewData } from "@/types/vehicleDetail"

interface RatingsAndReviewsProps {
  data?: ReviewData
  isLoading: boolean
}

const renderStars = (rating: number) =>
  Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={index}
      className={cn(
        "size-4",
        index < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300",
      )}
    />
  ))

const RatingsAndReviews = ({ data, isLoading }: RatingsAndReviewsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="mt-3 h-4 w-28" />
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-gray-200 bg-white p-5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (!data || data.totalReviews === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-8 text-center text-sm text-gray-500">
        No reviews yet
      </div>
    )
  }

  const maxBreakdown = Math.max(...data.breakdown.map((item) => item.count), 1)

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-4xl font-semibold text-gray-900">{data.averageRating.toFixed(1)}</p>
            <div className="mt-2 flex items-center gap-1">{renderStars(data.averageRating)}</div>
            <p className="mt-2 text-sm text-gray-500">{data.totalReviews} reviews</p>
          </div>
          <div className="w-full max-w-md space-y-3">
            {data.breakdown
              .slice()
              .sort((a, b) => b.stars - a.stars)
              .map((item) => (
                <div key={item.stars} className="grid grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-3 text-sm">
                  <span className="text-gray-600">{item.stars}★</span>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(item.count / maxBreakdown) * 100}%` }}
                    />
                  </div>
                  <span className="text-right text-gray-500">{item.count}</span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {data.reviews.map((review) => (
        <article key={review.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">{review.author}</h3>
              <p className="text-xs text-gray-500">
                {new Date(review.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-600">{review.comment}</p>
        </article>
      ))}
    </div>
  )
}

export default RatingsAndReviews
