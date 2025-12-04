const DashboardCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCardSkeleton;




