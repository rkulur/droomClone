import { Link } from "react-router";

const AdminPage = () => {
  return (
    <div className="px-horizontal py-16">
      <h1 className="text-3xl font-semibold text-[#303549]">Admin Dashboard</h1>
      <p className="text-[#6D758D] mt-3">
        Manage listings and publish new vehicles from your admin tools.
      </p>

      <div className="mt-8 max-w-xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#303549]">Vehicle Listings</h2>
        <p className="text-[#6D758D] mt-2">
          Start a new listing with the multi-step admin form.
        </p>

        <Link
          to="/admin/vehicles/new"
          className="inline-flex mt-5 rounded-md bg-[#2699FA] px-5 py-2.5 text-white font-medium hover:bg-[#1f86dd] transition-colors"
        >
          Add Vehicle
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
