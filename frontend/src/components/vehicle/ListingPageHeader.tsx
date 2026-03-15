import { Link } from "react-router";
import { getCategoryDisplayLabel, getUsefulLinks } from "@/constants/vehicleListing";

interface ListingPageHeaderProps {
  category: string;
  subcategory?: string;
  totalResults: number;
  isLoading: boolean;
}

const ListingPageHeader = ({
  category,
  subcategory,
  totalResults,
  isLoading,
}: ListingPageHeaderProps) => {
  const categoryLabel = getCategoryDisplayLabel(category);
  const subcategoryLabel = subcategory
    ? subcategory
        .split("-")
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ")
    : undefined;

  return (
    <div className="space-y-4">
      <nav className="text-sm text-gray-500">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{subcategoryLabel ?? categoryLabel}</span>
      </nav>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">{categoryLabel} for Sale</h1>
        {isLoading ? (
          <div className="vehicle-listing-shimmer h-12 w-full max-w-4xl rounded-md bg-gray-200" />
        ) : (
          <p className="max-w-5xl text-sm leading-6 text-gray-600">
            There are {totalResults.toLocaleString("en-IN")} {categoryLabel.toLowerCase()} available
            for sale online in India. Browse verified listings, compare pricing, and narrow your
            search with dynamic filters.
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        <span className="font-medium text-gray-700">Useful Links</span>
        {getUsefulLinks(category).map((link, index) => (
          <span key={link.label} className="flex items-center gap-3">
            <Link to={link.href} className="text-primary hover:underline">
              {link.label}
            </Link>
            {index < getUsefulLinks(category).length - 1 ? (
              <span className="hidden text-gray-300 md:inline">|</span>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ListingPageHeader;
