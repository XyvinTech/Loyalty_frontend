import { Link } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const RecentCustomers = ({ customers }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Customers</h3>
        <Link className="text-sm text-green-600 hover:text-green-700">
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {customers.slice(0, 5).map((customer) => (
          <Link
            key={customer.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {customer.customer_id}
                </p>
                <p className="text-xs text-gray-500">{customer.email}</p>
              </div>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                customer.tier === "Gold"
                  ? "bg-yellow-100 text-yellow-800"
                  : customer.tier === "Platinum"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {customer.tier}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentCustomers;
