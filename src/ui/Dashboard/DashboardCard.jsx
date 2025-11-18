import DashboardCardSkeleton from "./DashboardCardSkeleton";

const DashboardCard = ({ title, total, percentageChange, color, Icon, bg, loading }) => {
  if (loading) {
    return <DashboardCardSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-semibold text-gray-900">
            {total.toLocaleString()}
          </p>
          <p className={`text-xs ${color}`}>
            {percentageChange} from last month
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
