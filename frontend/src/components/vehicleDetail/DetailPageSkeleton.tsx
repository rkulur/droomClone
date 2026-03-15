import { Skeleton } from "@/components/ui/skeleton"

const DetailPageSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-80" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_380px]">
        <div className="space-y-4">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <div className="flex gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-18 w-24 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-5 w-36" />
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <Skeleton className="h-8 w-52" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 11 }).map((_, index) => (
              <div key={index} className="grid grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-3">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-4 h-5 w-full" />
        <Skeleton className="mt-2 h-5 w-4/5" />
        <Skeleton className="mt-2 h-5 w-2/3" />
      </div>
      <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-40 rounded-full" />
          <Skeleton className="h-10 w-48 rounded-full" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default DetailPageSkeleton
