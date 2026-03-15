import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import ListingPageHeader from "@/components/vehicle/ListingPageHeader";
import SortBar from "@/components/vehicle/SortBar";
import VehicleFilters from "@/components/vehicle/VehicleFilters";
import VehicleGrid from "@/components/vehicle/VehicleGrid";
import { Button } from "@/components/ui/button";
import { BUDGET_BANDS, normalizeSlug } from "@/constants/vehicleListing";
import { automobileCenter } from "@/const/automobileCenter";
import { useVehicleListings } from "@/hooks/useVehicleListings";
import type { BudgetBand, ListingFilters, SortOption } from "@/types/vehicle";

const parseNumber = (value: string | null) => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseFilters = (search: string): ListingFilters => {
  const params = new URLSearchParams(search);
  const condition = params.get("condition");
  const sort = params.get("sort");

  return {
    condition: condition === "new" || condition === "used" ? condition : undefined,
    city: params.get("city") || undefined,
    brand: params.get("brand") || undefined,
    minPrice: parseNumber(params.get("minPrice")),
    maxPrice: parseNumber(params.get("maxPrice")),
    sort: sort ? (sort as SortOption) : "recent",
    page: parseNumber(params.get("page")) ?? 1,
    limit: parseNumber(params.get("limit")) ?? 20,
  };
};

const filtersToSearch = (filters: ListingFilters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && !(key === "page" && value === 1) && !(key === "sort" && value === "recent") && !(key === "limit" && value === 20)) {
      params.set(key, String(value));
    }
  });

  return params.toString();
};

const getBudgetBand = (filters: ListingFilters): BudgetBand | undefined =>
  BUDGET_BANDS.find(
    (band) => band.min === filters.minPrice && band.max === filters.maxPrice,
  );

const categoryOptions = automobileCenter.map((item) => item.link.replace(/^\/vehicles\//, ""));

const VehicleListingPage = () => {
  const { category: rawCategory, subcategory: rawSubcategory } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const category = normalizeSlug(rawCategory);
  const subcategoryFromQuery = normalizeSlug(new URLSearchParams(location.search).get("subcategory") ?? undefined);
  const subcategory = subcategoryFromQuery || normalizeSlug(rawSubcategory) || undefined;
  const [uiFilters, setUiFilters] = useState<ListingFilters>(() => parseFilters(location.search));
  const [debouncedFilters, setDebouncedFilters] = useState<ListingFilters>(() => parseFilters(location.search));

  const isKnownCategory = categoryOptions.includes(category);

  useEffect(() => {
    const nextFilters = parseFilters(location.search);
    const syncTimer = window.setTimeout(() => {
      setUiFilters(nextFilters);
      setDebouncedFilters(nextFilters);
    }, 0);

    return () => window.clearTimeout(syncTimer);
  }, [location.search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedFilters(uiFilters);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [uiFilters]);

  const stableFilters = useMemo(
    () => ({
      ...debouncedFilters,
      sort: debouncedFilters.sort ?? "recent",
      page: debouncedFilters.page ?? 1,
      limit: debouncedFilters.limit ?? 20,
    }),
    [debouncedFilters],
  );

  const { listings, pagination, filterMetadata, isLoading, error, refetch } = useVehicleListings(
    isKnownCategory ? category : "",
    isKnownCategory ? subcategory : undefined,
    stableFilters,
  );

  useEffect(() => {
    if (!subcategory || !filterMetadata?.availableSubcategories?.length) {
      return;
    }

    const match = filterMetadata.availableSubcategories.some(
      (option) => normalizeSlug(option.value) === subcategory,
    );

    if (!match) {
      navigate(
        {
          pathname: `/vehicles/${category}`,
          search: location.search,
        },
        { replace: true },
      );
    }
  }, [category, filterMetadata?.availableSubcategories, location.search, navigate, subcategory]);

  const syncUrl = (nextFilters: ListingFilters, nextSubcategory?: string) => {
    const params = new URLSearchParams(filtersToSearch(nextFilters));

    if (nextSubcategory) {
      params.set("subcategory", nextSubcategory);
    } else {
      params.delete("subcategory");
    }

    navigate(
      {
        pathname: `/vehicles/${category}`,
        search: params.toString() ? `?${params.toString()}` : "",
      },
      { replace: true },
    );
  };

  const handleFilterChange = (delta: Partial<ListingFilters>) => {
    setUiFilters((current) => {
      const next = {
        ...current,
        ...delta,
      };

      const normalized: ListingFilters = Object.fromEntries(
        Object.entries(next).filter(([, value]) => value !== undefined && value !== ""),
      );

      syncUrl(normalized, subcategory);
      return normalized;
    });
  };

  const handleReset = () => {
    const resetFilters: ListingFilters = {
      sort: "recent",
      page: 1,
      limit: 20,
    };

    setUiFilters(resetFilters);
    setDebouncedFilters(resetFilters);
    syncUrl(resetFilters);
  };

  const handleSubcategoryChange = (nextSubcategory?: string) => {
    const nextFilters = { ...uiFilters, page: 1 };
    setUiFilters(nextFilters);
    syncUrl(nextFilters, nextSubcategory);
  };

  const handleBudgetChange = (band: BudgetBand | null) => {
    handleFilterChange({
      minPrice: band?.min,
      maxPrice: band?.max,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    handleFilterChange({ page });
  };

  const pageNumbers = useMemo(() => {
    const totalPages = pagination?.totalPages ?? 1;
    const currentPage = pagination?.page ?? 1;
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [pagination?.page, pagination?.totalPages]);

  if (!isKnownCategory) {
    return (
      <main className="px-horizontal mx-auto max-w-[1600px] py-10">
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-semibold text-gray-900">Category not found</h1>
          <p className="mt-2 text-gray-600">The requested vehicle category is not available.</p>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-horizontal mx-auto max-w-[1600px] space-y-6 py-8">
      <ListingPageHeader
        category={category}
        subcategory={subcategory}
        totalResults={pagination?.total ?? 0}
        isLoading={isLoading}
      />
      <SortBar
        activeSort={uiFilters.sort ?? "recent"}
        resultCount={pagination?.total ?? 0}
        onChange={(sort) => handleFilterChange({ sort, page: 1 })}
      />
      <div className="grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
        <aside>
          <VehicleFilters
            category={category}
            activeFilters={uiFilters}
            activeSubcategory={subcategory}
            filterMetadata={filterMetadata}
            onChange={handleFilterChange}
            onReset={handleReset}
            onSubcategoryChange={handleSubcategoryChange}
          />
        </aside>
        <section className="space-y-6">
          <VehicleGrid
            listings={listings}
            category={category}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
            activeBudgetBand={getBudgetBand(uiFilters)}
            onBudgetChange={handleBudgetChange}
            onResetFilters={handleReset}
          />

          {pagination && pagination.totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
              <Button
                variant="outline"
                onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1}
              >
                Prev
              </Button>
              {pageNumbers.map((page) => (
                <Button
                  key={page}
                  variant={page === pagination.page ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  handlePageChange(
                    Math.min(pagination.totalPages, pagination.page + 1),
                  )
                }
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
};

export default VehicleListingPage;
