import React, { useState, useEffect, useMemo } from "react";
import { useReports } from "../../hooks/useReports";
import StyledTable from "../../ui/StyledTable";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Loader from "../../ui/Loader";

const Reports = () => {
  const { useGetReportData, useExportReportCSV } = useReports();

  // Date state - default to current month
  const getCurrentMonthDates = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  const [dateRange, setDateRange] = useState(getCurrentMonthDates());
  const [customStartDate, setCustomStartDate] = useState(
    dateRange.startDate
  );
  const [customEndDate, setCustomEndDate] = useState(dateRange.endDate);
  const [isCustomRange, setIsCustomRange] = useState(false);

  // Fetch report data
  const {
    data: reportDataResponse,
    isLoading,
    error,
    refetch,
  } = useGetReportData(dateRange.startDate, dateRange.endDate);

  // Export CSV mutation
  const exportCSVMutation = useExportReportCSV();

  const reportData = reportDataResponse?.data?.data || null;

  // Handle preset date ranges
  const handlePresetRange = (preset) => {
    const now = new Date();
    let startDate, endDate;

    switch (preset) {
      case "currentMonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "last30Days":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        endDate = new Date(now);
        break;
      case "lastQuarter":
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
        break;
      default:
        return;
    }

    setDateRange({
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    });
    setCustomStartDate(startDate.toISOString().split("T")[0]);
    setCustomEndDate(endDate.toISOString().split("T")[0]);
    setIsCustomRange(false);
  };

  // Handle custom date range
  const handleCustomRange = () => {
    if (customStartDate && customEndDate) {
      if (new Date(customStartDate) > new Date(customEndDate)) {
        alert("Start date must be before end date");
        return;
      }
      setDateRange({
        startDate: customStartDate,
        endDate: customEndDate,
      });
      setIsCustomRange(true);
    }
  };

  // Handle CSV export
  const handleExportCSV = () => {
    exportCSVMutation.mutate({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
  };

  // Prepare table data
  const tableData = useMemo(() => {
    if (!reportData) return [];

    const appTypes = reportData.appTypes || [];
    const reportDataObj = reportData.reportData || {};

    const rows = [
      {
        label: "No of registered Users",
        type: "registeredUsers",
      },
      {
        label: "Points Earning",
        type: "sectionHeader",
      },
      {
        label: "No of Users",
        type: "earnUserCount",
      },
      {
        label: "No of transaction",
        type: "earnTransactionCount",
      },
      {
        label: "Total Points Earned",
        type: "earnTotalPoints",
      },
      {
        label: "Points Redeemed",
        type: "sectionHeader",
      },
      {
        label: "No of Users",
        type: "redeemUserCount",
      },
      {
        label: "No of transaction",
        type: "redeemTransactionCount",
      },
      {
        label: "Total Points Redeemed",
        type: "redeemTotalPoints",
      },
      {
        label: "Opening Balance",
        type: "openingBalance",
      },
      {
        label: "Closing Balance",
        type: "closingBalance",
      },
    ];

    return rows.map((row) => {
      const rowData = { label: row.label };
      appTypes.forEach((appType) => {
        const appTypeName = appType.name;
        const data = reportDataObj[appTypeName];

        if (row.type === "sectionHeader") {
          rowData[appTypeName] = "";
        } else if (row.type === "registeredUsers") {
          rowData[appTypeName] = data?.registeredUsers || 0;
        } else if (row.type === "earnUserCount") {
          rowData[appTypeName] = data?.pointsEarning?.userCount || 0;
        } else if (row.type === "earnTransactionCount") {
          rowData[appTypeName] = data?.pointsEarning?.transactionCount || 0;
        } else if (row.type === "earnTotalPoints") {
          rowData[appTypeName] = data?.pointsEarning?.totalPoints || 0;
        } else if (row.type === "redeemUserCount") {
          rowData[appTypeName] = data?.pointsRedeemed?.userCount || 0;
        } else if (row.type === "redeemTransactionCount") {
          rowData[appTypeName] = data?.pointsRedeemed?.transactionCount || 0;
        } else if (row.type === "redeemTotalPoints") {
          rowData[appTypeName] = data?.pointsRedeemed?.totalPoints || 0;
        } else if (row.type === "openingBalance") {
          rowData[appTypeName] = reportData.openingBalance || 0;
        } else if (row.type === "closingBalance") {
          rowData[appTypeName] = reportData.closingBalance || 0;
        }
      });
      return rowData;
    });
  }, [reportData]);

  if (isLoading && !reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">
          Error loading report data: {error.message || "Unknown error"}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const appTypes = reportData?.appTypes || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <button
          onClick={handleExportCSV}
          disabled={exportCSVMutation.isPending || !reportData}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Date Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Date Range Filter
        </h2>

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => handlePresetRange("currentMonth")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              !isCustomRange &&
              dateRange.startDate ===
                new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  1
                )
                  .toISOString()
                  .split("T")[0]
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Current Month
          </button>
          <button
            onClick={() => handlePresetRange("last30Days")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isCustomRange
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => handlePresetRange("lastQuarter")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isCustomRange
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Last Quarter
          </button>
        </div>

        {/* Custom Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <button
              onClick={handleCustomRange}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Apply Custom Range
            </button>
          </div>
        </div>

        {/* Current Date Range Display */}
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-medium">Selected Range: </span>
          {new Date(dateRange.startDate).toLocaleDateString()} -{" "}
          {new Date(dateRange.endDate).toLocaleDateString()}
        </div>
      </div>

      {/* Summary Cards */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">
              Opening Balance
            </h3>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {reportData.openingBalance?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">
              Closing Balance
            </h3>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {reportData.closingBalance?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">
              Net Change
            </h3>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {(
                (reportData.closingBalance || 0) -
                (reportData.openingBalance || 0)
              ).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Data Table */}
      {reportData && appTypes.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Detailed Report
          </h2>
          <StyledTable>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                {appTypes.map((appType) => (
                  <th
                    key={appType._id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {appType.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((row, index) => (
                <tr
                  key={index}
                  className={
                    row.label === "Points Earning" ||
                    row.label === "Points Redeemed"
                      ? "bg-gray-50"
                      : "hover:bg-gray-50"
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.label}
                  </td>
                  {appTypes.map((appType) => (
                    <td
                      key={appType._id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {typeof row[appType.name] === "number"
                        ? row[appType.name].toLocaleString()
                        : row[appType.name] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </div>
      )}

      {reportData && appTypes.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            No app types found. Please add app types to generate reports.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;
