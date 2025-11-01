import { useState } from "react";
import { useReports } from "../../hooks/useReports";
import { useAppTypes } from "../../hooks/useAppTypes";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { useGeneratePointsReport, useUpdateTransactionAppTypes } =
    useReports();
  const { useGetAppTypes } = useAppTypes();

  const generateMutation = useGeneratePointsReport();
  const updateAppTypesMutation = useUpdateTransactionAppTypes();

  // Prefetch app types for future use
  useGetAppTypes();

  const handleGenerateReport = () => {
    const params = {};

    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    generateMutation.mutate(params);
  };

  const handleUpdateAppTypes = () => {
    if (
      window.confirm(
        "This will update all transactions with null app_type using metadata.requested_by. Continue?"
      )
    ) {
      updateAppTypesMutation.mutate();
    }
  };

  // Set default date range (last 30 days)
  const setLast30Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);

    setEndDate(end.toISOString().split("T")[0]);
    setStartDate(start.toISOString().split("T")[0]);
  };

  // Set current month
  const setCurrentMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  // Set last month
  const setLastMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Points Activity Report
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate detailed reports on user registration and points activity
          </p>
        </div>
      </div>

      {/* Report Generator Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Report Parameters
        </h2>

        <div className="space-y-6">
          {/* Quick Date Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Date Range
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={setLast30Days}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Last 30 Days
              </button>
              <button
                onClick={setCurrentMonth}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Current Month
              </button>
              <button
                onClick={setLastMonth}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Last Month
              </button>
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear Dates
              </button>
            </div>
          </div>

          {/* Date Range Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* App Type Filter */}
          {/* <div>
            <label
              htmlFor="appType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by App Type (Optional)
            </label>
            <select
              id="appType"
              value={selectedAppType}
              onChange={(e) => setSelectedAppType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All App Types</option>
              {appTypes.map((appType) => (
                <option key={appType._id} value={appType._id}>
                  {appType.name}
                </option>
              ))}
            </select>
          </div> */}

          {/* Include Inactive Customers */}
          {/* <div className="flex items-center">
            <input
              type="checkbox"
              id="includeInactive"
              checked={includeInactive}
              onChange={(e) => setIncludeInactive(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label
              htmlFor="includeInactive"
              className="ml-2 block text-sm text-gray-700"
            >
              Include inactive customers in report
            </label>
          </div> */}

          {/* Generate Button */}
          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={handleGenerateReport}
              disabled={generateMutation.isPending}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              {generateMutation.isPending
                ? "Generating Report..."
                : "Generate Excel Report"}
            </button>
          </div>
        </div>
      </div>

      {/* Data Maintenance Utilities */}
      {/* <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Data Maintenance
        </h2>
        <div className="space-y-4">
          <div className="flex items-start justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                Update Transaction App Types
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Update all transactions with null app_type by looking up the app
                name from metadata.requested_by field. This is useful for fixing
                earn transactions that were created before app_type was tracked.
              </p>
            </div>
            <button
              onClick={handleUpdateAppTypes}
              disabled={updateAppTypesMutation.isPending}
              className="ml-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {updateAppTypesMutation.isPending ? "Updating..." : "Update Now"}
            </button>
          </div>
        </div>
      </div> */}

      {/* Report Information Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">
          Report Contents
        </h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>The generated Excel report will include the following metrics:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>Registered Users:</strong> Total number of registered
              users per app type
            </li>
            <li>
              <strong>Points Earning:</strong> Number of unique users,
              transactions, and total points earned
            </li>
            <li>
              <strong>Points Redeemed:</strong> Number of unique users,
              transactions, and total points redeemed
            </li>
            <li>
              <strong>Opening Balance:</strong> Total points balance at the
              start of the period
            </li>
            <li>
              <strong>Closing Balance:</strong> Total points balance at the end
              of the period
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;
