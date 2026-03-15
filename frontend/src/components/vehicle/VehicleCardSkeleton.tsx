const VehicleCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="vehicle-listing-shimmer aspect-[4/3] bg-gray-200" />
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="vehicle-listing-shimmer h-5 w-4/5 rounded bg-gray-200" />
          <div className="vehicle-listing-shimmer h-5 w-2/3 rounded bg-gray-200" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="vehicle-listing-shimmer h-6 w-1/3 rounded bg-gray-200" />
          <div className="vehicle-listing-shimmer h-4 w-1/4 rounded bg-gray-200" />
        </div>
        <div className="flex gap-2">
          <div className="vehicle-listing-shimmer h-4 flex-1 rounded bg-gray-200" />
          <div className="vehicle-listing-shimmer h-4 flex-1 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default VehicleCardSkeleton;
