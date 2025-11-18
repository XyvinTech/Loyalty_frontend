import { useState } from "react";
import LineChart from "../LineChart";
import ChartSkeleton from "./ChartSkeleton";

const PointsActivity = ({ pointsActivityData, loading }) => {
  const [selectedRange, setSelectedRange] = useState("Last 7 Days");

  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Points Activity</h3>
        <select
          className="text-xs border border-gray-300 rounded-lg px-3 py-3"
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
          disabled={loading}
        >
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
        </select>
      </div>
      <div className="h-64">
        {loading ? (
          <ChartSkeleton />
        ) : (
          <LineChart data={pointsActivityData} />
        )}
      </div>
    </div>
  );
};

export default PointsActivity;
