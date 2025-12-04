import {
  UsersIcon,
  UserGroupIcon,
  GiftIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import DashboardCard from "../ui/Dashboard/DashboardCard";
import RefreshButton from "../ui/RefreshButton";
import RecentCustomers from "../ui/Dashboard/RecentCustomers";
import RecentActivity from "../ui/Dashboard/RecentActivity";
import PointsActivity from "../ui/Dashboard/PointsActivity";
import CustomerGrowth from "../ui/Dashboard/CustomerGrowth";
import { useDashboard } from "../hooks/useDashboard";

// Default chart data structure
const defaultChartData = {
  labels: [],
  datasets: [
    {
      label: "No Data",
      data: [],
      borderColor: "rgb(99, 102, 241)",
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      fill: true,
      tension: 0.4,
    },
  ],
};

// Format transaction data for display
const formatTransactionData = (transactions) => {
  if (!transactions) return [];

  return transactions.map((transaction) => ({
    ...transaction,
    customerName: transaction.customer_id?.name || "Unknown",
    type: transaction.transaction_type,
    points: transaction.points,
    date: new Date(transaction.transaction_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));
};

// Format customer data for display
const formatCustomerData = (customers) => {
  if (!customers) return [];

  return customers.map((customer) => ({
    ...customer,
    name: customer.name || "Unknown",
    tier: customer.tier?.name?.en || customer.tier?.name || "No Tier",
    points: customer.total_points || 0,
    status: customer.status ? "Active" : "Inactive",
  }));
};

const Dashboard = () => {
  const { dashboardData, isLoading, refetch, dataUpdatedAt } = useDashboard();

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleString()
    : "";

  const overviewCards = [
    {
      title: "Total Customers",
      total: dashboardData?.overview?.total_customers || 0,
      percentageChange: `${
        Math.round(
          (dashboardData?.overview?.active_customers /
            dashboardData?.overview?.total_customers) *
            100
        ) || 0
      }% Active`,
      color: "text-blue-600",
      Icon: UsersIcon,
      bg: "bg-blue-100",
    },
    {
      title: "Total Admins",
      total: dashboardData?.overview?.total_admins || 0,
      percentageChange: `${
        Math.round(
          (dashboardData?.overview?.active_admins /
            dashboardData?.overview?.total_admins) *
            100
        ) || 0
      }% Active`,
      color: "text-purple-600",
      Icon: UserGroupIcon,
      bg: "bg-purple-100",
    },
    {
      title: "Active Offers",
      total: dashboardData?.overview?.total_active_offers || 0,
      percentageChange: "Currently Active",
      color: "text-green-600",
      Icon: GiftIcon,
      bg: "bg-green-100",
    },
    {
      title: "Total Brands",
      total: dashboardData?.overview?.total_brands || 0,
      percentageChange: "Registered Brands",
      color: "text-orange-600",
      Icon: BuildingStorefrontIcon,
      bg: "bg-orange-100",
    },
  ];

  const pointsCards = [
    {
      title: "Total Points Issued",
      total: dashboardData?.points?.total_issued?.toLocaleString() || 0,
      percentageChange: "All Time",
      color: "text-green-600",
      Icon: ChartBarIcon,
      bg: "bg-green-100",
    },
    {
      title: "Points Redeemed",
      total: dashboardData?.points?.total_redeemed?.toLocaleString() || 0,
      percentageChange: "All Time",
      color: "text-blue-600",
      Icon: CurrencyDollarIcon,
      bg: "bg-blue-100",
    },
    {
      title: "Points Expired",
      total: dashboardData?.points?.total_expired?.toLocaleString() || 0,
      percentageChange: "All Time",
      color: "text-red-600",
      Icon: ChartBarIcon,
      bg: "bg-red-100",
    },
    {
      title: "Active Points",
      total: dashboardData?.points?.current_active?.toLocaleString() || 0,
      percentageChange: "Currently Active",
      color: "text-indigo-600",
      Icon: ChartBarIcon,
      bg: "bg-indigo-100",
    },
  ];

  // Format points activity data
  const formatPointsActivityData = () => {
    if (!dashboardData?.trends?.points_activity?.length) {
      return defaultChartData;
    }

    const dates = [
      ...new Set(
        dashboardData.trends.points_activity.map((item) => item._id.date)
      ),
    ];
    const earnedPoints = dates.map((date) => {
      const entry = dashboardData.trends.points_activity.find(
        (item) => item._id.date === date && item._id.type === "earn"
      );
      return entry ? entry.total : 0;
    });
    const redeemedPoints = dates.map((date) => {
      const entry = dashboardData.trends.points_activity.find(
        (item) => item._id.date === date && item._id.type === "redeem"
      );
      return entry ? Math.abs(entry.total) : 0;
    });

    return {
      labels: dates.map((date) =>
        new Date(date).toLocaleDateString("en-US", { weekday: "short" })
      ),
      datasets: [
        {
          label: "Points Earned",
          data: earnedPoints,
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Points Redeemed",
          data: redeemedPoints,
          borderColor: "rgb(99, 102, 241)",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  // Format customer growth data
  const formatCustomerGrowthData = () => {
    if (!dashboardData?.trends?.customer_growth?.length) {
      return defaultChartData;
    }

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const data = dashboardData.trends.customer_growth.map((item) => ({
      month: monthNames[item._id.month - 1],
      count: item.count,
    }));

    return {
      labels: data.map((item) => item.month),
      datasets: [
        {
          label: "New Customers",
          data: data.map((item) => item.count),
          backgroundColor: "rgb(34, 197, 94)",
        },
      ],
    };
  };

  // Format the data for display
  const formattedTransactions = formatTransactionData(
    dashboardData?.recent?.transactions
  );
  const formattedCustomers = formatCustomerData(
    dashboardData?.recent?.customers
  );

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Last Updated: {lastUpdated || (isLoading ? "Fetching..." : "Never")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
          <RefreshButton onClick={() => refetch()} isLoading={isLoading} />
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overviewCards.map((item, index) => (
          <DashboardCard key={index} {...item} loading={isLoading} />
        ))}
      </div>

      {/* Points Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {pointsCards.map((item, index) => (
          <DashboardCard key={index} {...item} loading={isLoading} />
        ))}
      </div>

      {/* Recent Activity and Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <RecentActivity
            transactions={formattedTransactions}
            loading={isLoading}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Customers
          </h3>
          <RecentCustomers customers={formattedCustomers} loading={isLoading} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Points Activity (Last 7 Days)
          </h3>
          <div className="h-[300px]">
            <PointsActivity
              pointsActivityData={formatPointsActivityData()}
              loading={isLoading}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Customer Growth (Last 6 Months)
          </h3>
          <div className="h-[300px]">
            <CustomerGrowth
              customerGrowthData={formatCustomerGrowthData()}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
