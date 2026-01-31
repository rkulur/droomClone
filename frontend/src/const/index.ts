export type TrendingSearch = {
  title: string;
  srcLink: string;
};

export type InputOption = {
  title: string;
  trendingSearches: TrendingSearch[];
};

export const inputOptions = [
  {
    title: "All",
    trendingSearches: [
      { title: "Find Your Dream Vehicle", srcLink: "/find-vehicle" },
      {
        title: "Vehicle History Records in 10 Seconds",
        srcLink: "/vehicle-history",
      },
      {
        title: "Pricing Report Of Any Vehicle In 10 Seconds",
        srcLink: "/vehicle-pricing-report",
      },
      {
        title: "Largest selection of Electric Vehicles",
        srcLink: "/electric-vehicles",
      },
    ],
  },
  {
    title: "Car",
    trendingSearches: [
      { title: "Find Your Dream Car", srcLink: "/cars" },
      { title: "Car Inspection Package", srcLink: "/car-inspection" },
      { title: "Used Cars at Best Price", srcLink: "/used-cars" },
      { title: "Car Insurance", srcLink: "/car-insurance" },
    ],
  },
  {
    title: "Bike",
    trendingSearches: [
      { title: "Used Bikes", srcLink: "/used-bikes" },
      { title: "Bike Inspection Package", srcLink: "/bike-inspection" },
      { title: "Two Wheeler Insurance", srcLink: "/two-wheeler-insurance" },
      { title: "Best Mileage Bikes", srcLink: "/best-mileage-bikes" },
    ],
  },
  {
    title: "Scooter",
    trendingSearches: [
      { title: "Used Scooters", srcLink: "/used-scooters" },
      { title: "Electric Scooters", srcLink: "/electric-scooters" },
      { title: "Scooter Insurance", srcLink: "/scooter-insurance" },
    ],
  },
  {
    title: "Loan & Insurance",
    trendingSearches: [
      { title: "Loan decision in 30 Seconds", srcLink: "/vehicle-loan" },
      {
        title: "Best Insurance cover for your vehicle",
        srcLink: "/vehicle-insurance",
      },
      { title: "Car Loan EMI Calculator", srcLink: "/emi-calculator" },
    ],
  },
  {
    title: "Inspection & Certification",
    trendingSearches: [
      { title: "Vehicle Inspection Package", srcLink: "/vehicle-inspection" },
      { title: "Vehicle Certification", srcLink: "/vehicle-certification" },
      {
        title: "Pricing Report Of Any Vehicle In 10 Seconds",
        srcLink: "/vehicle-pricing-report",
      },
    ],
  },
  {
    title: "Ancillary Services",
    trendingSearches: [
      { title: "Roadside Assistance", srcLink: "/roadside-assistance" },
      {
        title: "Extended Warranty at Best Price",
        srcLink: "/extended-warranty",
      },
      {
        title: "Premium Buying Assistance",
        srcLink: "/premium-buying-assistance",
      },
    ],
  },
  {
    title: "Rental",
    trendingSearches: [
      { title: "Car Rental", srcLink: "/car-rental" },
      { title: "Bike Rental", srcLink: "/bike-rental" },
      { title: "Self Drive Cars", srcLink: "/self-drive-cars" },
    ],
  },
  {
    title: "Media & Content",
    trendingSearches: [
      { title: "Latest Car News", srcLink: "/car-news" },
      { title: "Bike Reviews", srcLink: "/bike-reviews" },
      { title: "Electric Vehicle Updates", srcLink: "/ev-news" },
    ],
  },
];
