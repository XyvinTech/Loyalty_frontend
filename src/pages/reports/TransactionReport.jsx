import { useState, useEffect } from "react";
import { useReports } from "../../hooks/useReports";
import {
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Loader from "../../ui/Loader";

const TransactionReport = () => {
  const { useExportTransactionReport, useGetTransactionExportCount } =
    useReports();

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
  const [customStartDate, setCustomStartDate] = useState(dateRange.startDate);
  const [customEndDate, setCustomEndDate] = useState(dateRange.endDate);
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [showLargeExportWarning, setShowLargeExportWarning] = useState(false);

  const exportMutation = useExportTransactionReport();

  // Get transaction count for the selected date range
  const {
    data: countResponse,
    isLoading: isCountLoading,
    refetch: refetchCount,
  } = useGetTransactionExportCount(dateRange.startDate, dateRange.endDate);

  const exportCountData = countResponse?.data?.data || null;
  const transactionCount = exportCountData?.count || 0;
  const maxExportRows = exportCountData?.maxExportRows || 100000;
  const exceedsLimit = exportCountData?.exceedsLimit || false;
  const suggestedEndDate = exportCountData?.suggestedEndDate || null;

  // Refetch count when date range changes
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      refetchCount();
    }
  }, [dateRange.startDate, dateRange.endDate, refetchCount]);

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
      case "lastQuarter": {
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
        break;
      }
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

  // Handle applying suggested date range
  const handleApplySuggestedRange = () => {
    if (suggestedEndDate) {
      const suggestedDate = new Date(suggestedEndDate);
      const suggestedDateStr = suggestedDate.toISOString().split("T")[0];
      
      setDateRange({
        startDate: dateRange.startDate,
        endDate: suggestedDateStr,
      });
      setCustomEndDate(suggestedDateStr);
      setIsCustomRange(true);
    }
  };

  // Handle CSV export
  const handleExportCSV = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      alert("Please select a date range");
      return;
    }

    // Don't allow export if limit is exceeded (user must adjust date range first)
    if (exceedsLimit) {
      return;
    }

    // Show warning for large exports (but still allow if under limit)
    if (transactionCount > 50000 && !showLargeExportWarning) {
      setShowLargeExportWarning(true);
      return;
    }

    setShowLargeExportWarning(false);

    exportMutation.mutate({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num?.toLocaleString() || "0";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Transaction Report
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Export all transaction data within a specified time duration
          </p>
        </div>
        {!exceedsLimit && (
          <button
            onClick={handleExportCSV}
            disabled={exportMutation.isPending || transactionCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {exportMutation.isPending ? (
              <>
                <Loader />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <ArrowDownTrayIcon className="w-5 h-5" />
                <span>Export CSV</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Transaction Count Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Transactions in Selected Range
              </h3>
              {isCountLoading ? (
                <div className="flex items-center gap-2 mt-1">
                  <Loader />
                  <span className="text-sm text-gray-500">Counting...</span>
                </div>
              ) : (
                <p className="text-2xl font-semibold text-gray-900">
                  {formatNumber(transactionCount)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Adjustment Card - Shown when limit is exceeded */}
      {exceedsLimit && suggestedEndDate && !isCountLoading && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="w-8 h-8 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-900 mb-2">
                Date Range Adjustment Required
              </h3>
              <p className="text-sm text-amber-800 mb-4">
                Due to the large size of the total data ({formatNumber(transactionCount)} transactions), 
                only complete date ranges can be exported. The system has calculated a safe end date 
                that ensures you get full, complete data from the start date.
              </p>
              <div className="bg-white rounded-lg p-4 mb-4 border border-amber-200">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Current Range:</span>
                    <span className="text-sm text-gray-600">
                      {new Date(dateRange.startDate).toLocaleDateString()} -{" "}
                      {new Date(dateRange.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-700">
                        Suggested Range:
                      </span>
                      <span className="text-sm font-semibold text-green-700">
                        {new Date(dateRange.startDate).toLocaleDateString()} -{" "}
                        {new Date(suggestedEndDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      This range contains approximately {formatNumber(maxExportRows)} transactions 
                      with complete date coverage
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleApplySuggestedRange}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium text-sm transition-colors"
                >
                  Apply Suggested Date Range
                </button>
                <button
                  onClick={() => {
                    setCustomStartDate(dateRange.startDate);
                    setCustomEndDate(suggestedEndDate.split("T")[0]);
                  }}
                  className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 font-medium text-sm transition-colors"
                >
                  Manually Adjust Dates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Large Export Warning Modal */}
      {showLargeExportWarning && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-800">Large Export Warning</h3>
              <p className="text-sm text-amber-700 mt-1">
                You are about to export {formatNumber(transactionCount)}{" "}
                transactions. This may take several minutes to complete. Please
                do not close this page during the export.
              </p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => {
                    setShowLargeExportWarning(false);
                    handleExportCSV();
                  }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm"
                >
                  Continue Export
                </button>
                <button
                  onClick={() => setShowLargeExportWarning(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                new Date(new Date().getFullYear(), new Date().getMonth(), 1)
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
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Last 30 Days
          </button>
          <button
            onClick={() => handlePresetRange("lastQuarter")}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
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

      {/* Export Progress */}
      {exportMutation.isPending && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Loader />
            <div>
              <h3 className="font-medium text-blue-800">Export in Progress</h3>
              <p className="text-sm text-blue-700 mt-1">
                Generating CSV file with {formatNumber(transactionCount)}{" "}
                transactions. This may take a few minutes for large exports.
                Please keep this page open.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CSV Fields Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Export Details
        </h2>
        <p className="text-sm text-gray-600 mb-3">
          The CSV file will contain the following 12 columns:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span className="text-gray-700">Kedmah Customer ID</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span className="text-gray-700">Loyalty Transaction ID</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span className="text-gray-700">Khedmah Transaction ID</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span className="text-gray-700">Cancel Transaction ID</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span className="text-gray-700">Transaction Type</span>
          </div>
          <div className="flex items-start gap-2 ml-4">
            <span className="text-xs text-gray-500 mt-0.5">
              Adjust rows are sub-categorised as <code>redemption_cancellation</code>, <code>promotion</code>, or <code>admin_reduction</code> based on the transaction reference.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span className="text-gray-700">Points</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span className="text-gray-700">Criteria Code(s)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span className="text-gray-700">Requested By</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span className="text-gray-700">Transaction Date</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span className="text-gray-700">Created Date</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span className="text-gray-700">Expiry Date</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span className="text-gray-700">Status</span>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {exportMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Error exporting transaction data:{" "}
            {exportMutation.error?.message || "Unknown error"}
          </p>
        </div>
      )}

      {exportMutation.isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            Transaction report exported successfully!
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionReport;
