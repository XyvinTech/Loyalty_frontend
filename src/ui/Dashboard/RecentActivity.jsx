import { Link } from "react-router-dom";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import RecentActivitySkeleton from "./RecentActivitySkeleton";

const RecentActivity = ({ transactions, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <Link className="text-sm text-green-600 hover:text-green-700">
          View All
        </Link>
      </div>
      {loading ? (
        <RecentActivitySkeleton />
      ) : (
        <div className="space-y-4">
          {transactions?.slice(0, 5).map((transaction) => (
          <div
            key={transaction._id || transaction.transaction_id || transaction.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  transaction.type === "earn" ? "bg-green-100" : "bg-blue-100"
                }`}
              >
                <ChartBarIcon
                  className={`w-4 h-4 ${
                    transaction.type === "earn" ? "text-green-600" : "text-blue-600"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {transaction.type === "earn" ? "Earned" : transaction.type === "redeem" ? "Redeemed" : transaction.type === "expire" ? "Expired" : transaction.type}
                </p>
                <p className="text-xs text-gray-500 font-mono">{transaction.customerId || transaction.customer_id}</p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-medium ${
                  transaction.points >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {transaction.points >= 0 ? "+" : ""}
                {Math.abs(transaction.points)} points
              </p>
              <p className="text-xs text-gray-500">{transaction.date}</p>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
