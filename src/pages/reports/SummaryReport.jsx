import { useState, useMemo, useRef, useEffect } from "react";
import { useReports } from "../../hooks/useReports";
import StyledTable from "../../ui/StyledTable";
import {
  ArrowDownTrayIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Loader from "../../ui/Loader";

// Metric explanations with formulas
const metricExplanations = {
  openingBalance: {
    description:
      "The total points balance at the beginning of your selected date range. This shows all points that existed before the start date.",
    formula:
      "Adding up all points from completed transactions before the start date",
    dataSource: "Transaction records",
    filters: "Only includes completed transactions for this app type",
  },
  registeredUsers: {
    description:
      "The number of new customers who signed up during your selected date range. Each customer is counted only once.",
    formula:
      "Counting unique customers created between start date and end date",
    dataSource: "Customer records",
    filters: "Filtered by sign-up date and app type",
  },
  newRegistration: {
    description:
      "New customer registrations during the selected period. This is the same as 'No of registered Users'.",
    formula:
      "Counting unique customers created between start date and end date",
    dataSource: "Customer records",
    filters: "Filtered by sign-up date and app type",
  },
  closingBalance: {
    description:
      "The total points balance at the end of your selected date range. This shows all points that exist up to and including the end date.",
    formula:
      "Adding up all points from completed transactions up to the end date",
    dataSource: "Transaction records",
    filters: "Only includes completed transactions for this app type",
  },
  earnUserCount: {
    description:
      "The number of different customers who earned points during your selected period. Each customer is counted only once, even if they earned points multiple times.",
    formula:
      "Counting unique customers who have earn transactions in the date range",
    dataSource: "Transaction records",
    filters:
      "Only completed earn transactions within date range for this app type",
  },
  earnTransactionCount: {
    description:
      "The total number of times points were earned during your selected period. This counts every earning transaction.",
    formula: "Counting all completed earn transactions in the date range",
    dataSource: "Transaction records",
    filters:
      "Only completed earn transactions within date range for this app type",
  },
  earnTotalPoints: {
    description:
      "The total amount of points earned during your selected period. This adds up all the points from earning transactions.",
    formula:
      "Adding up all points from completed earn transactions in the date range",
    dataSource: "Transaction records",
    filters:
      "Only completed earn transactions within date range for this app type",
  },
  totalPromoPoints: {
    description:
      "The total points given as promotions during your selected period. These are special promotional points identified by 'PROMO' in the transaction ID.",
    formula:
      "Adding up points from earn transactions that have 'PROMO' in their transaction ID",
    dataSource: "Transaction records",
    filters:
      "Only promotional earn transactions within date range for this app type",
  },
  redeemUserCount: {
    description:
      "The number of different customers who redeemed points during your selected period. Each customer is counted only once.",
    formula:
      "Counting unique customers who have redeem transactions in the date range",
    dataSource: "Transaction records",
    filters:
      "Only completed redeem transactions within date range for this app type",
  },
  redeemTransactionCount: {
    description:
      "The total number of times points were redeemed during your selected period. This counts every redemption transaction.",
    formula: "Counting all completed redeem transactions in the date range",
    dataSource: "Transaction records",
    filters:
      "Only completed redeem transactions within date range for this app type",
  },
  redeemTotalPoints: {
    description:
      "The total amount of points redeemed during your selected period. This adds up all the points that were spent.",
    formula:
      "Adding up all points from completed redeem transactions in the date range",
    dataSource: "Transaction records",
    filters:
      "Only completed redeem transactions within date range for this app type",
  },
  totalExpiredPoints: {
    description:
      "The total points that expired during your selected period. These are points that reached their expiration date and were removed from customer accounts.",
    formula: "Adding up points from expire transactions in the date range",
    dataSource: "Transaction records",
    filters:
      "Only completed expire transactions within date range for this app type",
  },
  adminReductionPoints: {
    description:
      "The total points manually reduced by administrators during your selected period. These are identified by 'ADMIN' in the transaction ID.",
    formula:
      "Adding up points from redeem transactions that have 'ADMIN' in their transaction ID",
    dataSource: "Transaction records",
    filters:
      "Only admin redeem transactions within date range for this app type",
  },
  redemptionCancellations: {
    description:
      "Points restored to customers when their redemptions were cancelled during the selected period. These are positive-point reversals that offset prior redemptions.",
    formula:
      "Adding up points from adjust transactions whose transaction ID ends with '_cancelled'",
    dataSource: "Transaction records",
    filters:
      "Only completed cancellation adjustments within date range for this app type",
  },
  netMovement: {
    description:
      "The net change in points during your selected period. This shows the overall movement of points after accounting for all earning, redeeming, expiring, adjusting, and admin reductions.",
    formula:
      "Points Earned minus Points Redeemed minus Points Expired minus Admin Reductions plus Points Adjusted",
    dataSource: "Calculated from other metrics above",
    filters: "Uses the same date range and app type filters",
  },
  netChange: {
    description:
      "The difference between the closing balance and opening balance for your selected period. This shows the net change in points balance from the start to the end of the period.",
    formula: "Closing Balance minus Opening Balance",
    dataSource: "Calculated from opening and closing balance values",
    filters: "Based on the selected date range",
  },
};

// Enhanced Tooltip component with standard light theme and detailed information
/* eslint-disable react/prop-types */
const MetricTooltip = ({ explanation, children, position = "bottom" }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);

  // Handle both old string format and new object format
  const isDetailedFormat = typeof explanation === "object";

  // Check if tooltip should be shown above or below based on viewport
  useEffect(() => {
    if (showTooltip && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      // If there's less than 300px below and more space above, show tooltip above
      if (spaceBelow < 300 && spaceAbove > spaceBelow) {
        setActualPosition("top");
      } else {
        setActualPosition("bottom");
      }
    }
  }, [showTooltip]);

  return (
    <div className="relative inline-flex items-center">
      {children}
      <button
        ref={buttonRef}
        type="button"
        className="ml-1.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 rounded"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        aria-label="Show explanation"
      >
        <InformationCircleIcon className="w-4 h-4" />
      </button>
      {showTooltip && (
        <div
          ref={tooltipRef}
          className={`absolute ${
            actualPosition === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
          } left-0 w-[32rem] max-w-[calc(100vw-2rem)] bg-white border border-gray-200 text-gray-800 text-sm rounded-lg p-4 shadow-xl z-[100] pointer-events-none transition-all duration-200`}
          style={{ opacity: showTooltip ? 1 : 0 }}
        >
          <div className="relative space-y-3 overflow-hidden">
            {isDetailedFormat ? (
              <>
                {/* Formula */}
                <div className="w-full">
                  <div className="text-xs font-semibold text-gray-600 mb-1">
                    Description:
                  </div>
                  <code
                    className="text-xs font-mono text-gray-800 break-words whitespace-normal block"
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    {explanation.description}
                  </code>
                </div>

                {/* Formula */}
                <div className="bg-gray-50 rounded p-2 border border-gray-200 w-full">
                  <div className="text-xs font-semibold text-gray-600 mb-1">
                    Formula:
                  </div>
                  <code
                    className="text-xs font-mono text-gray-800 break-words whitespace-normal block"
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    {explanation.formula}
                  </code>
                </div>

                {/* Data Source */}
                <div className="flex items-start gap-2 w-full min-w-0">
                  <span className="text-xs font-semibold text-gray-600 min-w-fit shrink-0">
                    Data Source:
                  </span>
                  <span
                    className="text-xs text-gray-700 break-words flex-1 min-w-0"
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    {explanation.dataSource}
                  </span>
                </div>

                {/* Filters */}
                <div className="flex items-start gap-2 w-full min-w-0">
                  <span className="text-xs font-semibold text-gray-600 min-w-fit shrink-0">
                    Filters:
                  </span>
                  <span
                    className="text-xs text-gray-700 break-words flex-1 min-w-0"
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    {explanation.filters}
                  </span>
                </div>
              </>
            ) : (
              // Fallback for simple string explanations
              <p
                className="leading-relaxed break-words"
                style={{
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                {explanation}
              </p>
            )}

            {/* Arrow pointer */}
            <div
              className={`absolute ${
                actualPosition === "bottom" ? "-top-1.5" : "-bottom-1.5"
              } left-6 w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45`}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryReport = () => {
  const { useGetReportData } = useReports();

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

  // Fetch report data
  const {
    data: reportDataResponse,
    isLoading,
    error,
    refetch,
  } = useGetReportData(dateRange.startDate, dateRange.endDate);

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

  // Handle CSV export - Generate CSV from existing data
  const handleExportCSV = () => {
    if (!reportData || !tableData || tableData.length === 0) {
      alert("No data available to export");
      return;
    }

    // Get app type names for CSV headers
    const appTypes = reportData.appTypes || [];
    const headers = ["Metric", ...appTypes.map((at) => at.name), "Total"];

    // Convert tableData to CSV rows
    const csvRows = [];

    // Add date range header
    csvRows.push("Report Period:");
    csvRows.push(`Start Date: ${dateRange.startDate}`);
    csvRows.push(`End Date: ${dateRange.endDate}`);
    csvRows.push(""); // Blank row before data headers

    // Add headers
    csvRows.push(headers.join(","));

    tableData.forEach((row) => {
      const rowValues = [
        row.label,
        ...appTypes.map((appType) => {
          const value = row[appType.name];
          // Handle empty strings, numbers, and section headers
          if (value === "" || value === null || value === undefined) {
            return "";
          }
          if (typeof value === "number") {
            return value.toString();
          }
          // Escape commas and quotes in string values
          return `"${String(value).replace(/"/g, '""')}"`;
        }),
        row["Total"] !== undefined && row["Total"] !== null
          ? typeof row["Total"] === "number"
            ? row["Total"].toString()
            : `"${String(row["Total"]).replace(/"/g, '""')}"`
          : "",
      ];
      csvRows.push(rowValues.join(","));
    });

    // Add blank row for separation
    csvRows.push("");

    // Add Opening Balance Points row at the end
    const reportDataObj = reportData.reportData || {};
    const openingBalanceRow = ["Opening Balance Points"];
    appTypes.forEach((appType) => {
      const appTypeData = reportDataObj[appType.name];
      const balance = appTypeData?.openingBalance || 0;
      openingBalanceRow.push(balance.toString());
    });
    openingBalanceRow.push((reportData.openingBalance || 0).toString());
    csvRows.push(openingBalanceRow.join(","));

    // Add Closing Balance Points row at the end
    const closingBalanceRow = ["Closing Balance Points"];
    appTypes.forEach((appType) => {
      const appTypeData = reportDataObj[appType.name];
      const balance = appTypeData?.closingBalance || 0;
      closingBalanceRow.push(balance.toString());
    });
    closingBalanceRow.push((reportData.closingBalance || 0).toString());
    csvRows.push(closingBalanceRow.join(","));

    // Create CSV content
    const csvContent = csvRows.join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filename = `reports_${dateRange.startDate}_${dateRange.endDate}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  // Prepare table data
  const tableData = useMemo(() => {
    if (!reportData) return [];

    const appTypes = reportData.appTypes || [];
    const reportDataObj = reportData.reportData || {};

    const rows = [
      {
        label: "Opening User Count ",
        type: "openingUserCount",
        explanation: metricExplanations.openingBalance,
      },

      {
        label: "New Registration during the period",
        type: "newRegistration",
        explanation: metricExplanations.newRegistration,
      },
      {
        label: "Closing User Count",
        type: "closingUserCount",
        explanation: metricExplanations.closingBalance,
      },
      {
        label: "Points Earning",
        type: "sectionHeader",
      },
      {
        label: "No of Users",
        type: "earnUserCount",
        explanation: metricExplanations.earnUserCount,
      },
      {
        label: "No of transaction",
        type: "earnTransactionCount",
        explanation: metricExplanations.earnTransactionCount,
      },
      {
        label: "Total Points Earned",
        type: "earnTotalPoints",
        explanation: metricExplanations.earnTotalPoints,
      },
      {
        label: "Admin Manual Promotion Points Addition",
        type: "totalPromoPoints",
        explanation: metricExplanations.totalPromoPoints,
      },
      {
        label: "Points Redeemed",
        type: "sectionHeader",
      },
      {
        label: "No of Users",
        type: "redeemUserCount",
        explanation: metricExplanations.redeemUserCount,
      },
      {
        label: "No of transaction",
        type: "redeemTransactionCount",
        explanation: metricExplanations.redeemTransactionCount,
      },
      {
        label: "Total Points Redeemed",
        type: "redeemTotalPoints",
        explanation: metricExplanations.redeemTotalPoints,
      },
      {
        label: "Total Points Expired",
        type: "totalExpiredPoints",
        explanation: metricExplanations.totalExpiredPoints,
      },
      {
        label: "Admin Manual Point Reduction",
        type: "adminReductionPoints",
        explanation: metricExplanations.adminReductionPoints,
      },
      {
        label: "Redemption Cancellations",
        type: "redemptionCancellations",
        explanation: metricExplanations.redemptionCancellations,
      },
      {
        label: "Net Movement",
        type: "netMovement",
        explanation: metricExplanations.netMovement,
      },
    ];

    const totals = reportData.totals || {};

    return rows.map((row) => {
      const rowData = {
        label: row.label,
        explanation: row.explanation, // Preserve explanation for tooltip
      };
      appTypes.forEach((appType) => {
        const appTypeName = appType.name;
        const data = reportDataObj[appTypeName];

        if (row.type === "sectionHeader") {
          rowData[appTypeName] = "";
        } else if (row.type === "openingUserCount") {
          rowData[appTypeName] = data?.openingUserCount || 0;
        } else if (row.type === "openingBalance") {
          rowData[appTypeName] = data?.openingBalance || 0;
        } else if (row.type === "registeredUsers") {
          rowData[appTypeName] = data?.registeredUsers || 0;
        } else if (row.type === "newRegistration") {
          rowData[appTypeName] = data?.registeredUsers || 0;
        } else if (row.type === "closingUserCount") {
          rowData[appTypeName] = data?.closingUserCount || 0;
        } else if (row.type === "closingBalance") {
          rowData[appTypeName] = data?.closingBalance || 0;
        } else if (row.type === "earnUserCount") {
          rowData[appTypeName] = data?.pointsEarning?.userCount || 0;
        } else if (row.type === "earnTransactionCount") {
          rowData[appTypeName] = data?.pointsEarning?.transactionCount || 0;
        } else if (row.type === "earnTotalPoints") {
          rowData[appTypeName] = data?.pointsEarning?.totalPoints || 0;
        } else if (row.type === "totalPromoPoints") {
          rowData[appTypeName] = data?.totalPromoPoints || 0;
        } else if (row.type === "redeemUserCount") {
          rowData[appTypeName] = data?.pointsRedeemed?.userCount || 0;
        } else if (row.type === "redeemTransactionCount") {
          rowData[appTypeName] = data?.pointsRedeemed?.transactionCount || 0;
        } else if (row.type === "redeemTotalPoints") {
          rowData[appTypeName] = data?.pointsRedeemed?.totalPoints || 0;
        } else if (row.type === "totalExpiredPoints") {
          rowData[appTypeName] = data?.totalExpiredPoints || 0;
        } else if (row.type === "adminReductionPoints") {
          rowData[appTypeName] = data?.adminReductionPoints || 0;
        } else if (row.type === "redemptionCancellations") {
          rowData[appTypeName] =
            data?.redemptionCancellations?.totalPoints || 0;
        } else if (row.type === "netMovement") {
          // Calculate per app type net movement (closing - opening, since points have signs)
          const appTypeClosing = data?.closingBalance || 0;
          const appTypeOpening = data?.openingBalance || 0;
          rowData[appTypeName] = appTypeClosing - appTypeOpening;
        }
      });

      // Add Total column
      if (row.type === "sectionHeader") {
        rowData["Total"] = "";
      } else if (row.type === "openingUserCount") {
        rowData["Total"] = totals.openingUserCount || 0;
      } else if (row.type === "openingBalance") {
        rowData["Total"] = totals.openingBalance || 0;
      } else if (row.type === "registeredUsers") {
        rowData["Total"] = totals.registeredUsers || 0;
      } else if (row.type === "newRegistration") {
        rowData["Total"] = totals.registeredUsers || 0;
      } else if (row.type === "closingUserCount") {
        rowData["Total"] = totals.closingUserCount || 0;
      } else if (row.type === "closingBalance") {
        rowData["Total"] = totals.closingBalance || 0;
      } else if (row.type === "earnUserCount") {
        rowData["Total"] = totals.pointsEarning?.userCount || 0;
      } else if (row.type === "earnTransactionCount") {
        rowData["Total"] = totals.pointsEarning?.transactionCount || 0;
      } else if (row.type === "earnTotalPoints") {
        rowData["Total"] = totals.pointsEarning?.totalPoints || 0;
      } else if (row.type === "totalPromoPoints") {
        rowData["Total"] = totals.totalPromoPoints || 0;
      } else if (row.type === "redeemUserCount") {
        rowData["Total"] = totals.pointsRedeemed?.userCount || 0;
      } else if (row.type === "redeemTransactionCount") {
        rowData["Total"] = totals.pointsRedeemed?.transactionCount || 0;
      } else if (row.type === "redeemTotalPoints") {
        rowData["Total"] = totals.pointsRedeemed?.totalPoints || 0;
      } else if (row.type === "totalExpiredPoints") {
        rowData["Total"] = totals.totalExpiredPoints || 0;
      } else if (row.type === "adminReductionPoints") {
        rowData["Total"] = totals.adminReductionPoints || 0;
      } else if (row.type === "redemptionCancellations") {
        rowData["Total"] = totals.redemptionCancellations?.totalPoints || 0;
      } else if (row.type === "netMovement") {
        rowData["Total"] = totals.netMovement || 0;
      }

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
        <h1 className="text-2xl font-semibold text-gray-900">Summary Report</h1>
        <button
          onClick={handleExportCSV}
          disabled={!reportData || isLoading}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-medium text-gray-500">
                Opening Balance
              </h3>
              <MetricTooltip
                explanation={metricExplanations.openingBalance}
                position="bottom"
              >
                <span></span>
              </MetricTooltip>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {reportData.openingBalance?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-medium text-gray-500">
                Closing Balance
              </h3>
              <MetricTooltip
                explanation={metricExplanations.closingBalance}
                position="bottom"
              >
                <span></span>
              </MetricTooltip>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {reportData.closingBalance?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-medium text-gray-500">Net Change</h3>
              <MetricTooltip
                explanation={metricExplanations.netChange}
                position="bottom"
              >
                <span></span>
              </MetricTooltip>
            </div>

            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {(
                (reportData.closingBalance || 0) -
                (reportData.openingBalance || 0)
              ).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-medium text-gray-500">
                Net Movement
              </h3>
              <MetricTooltip
                explanation={metricExplanations.netMovement}
                position="bottom"
              >
                <span></span>
              </MetricTooltip>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {reportData.totals?.netMovement?.toLocaleString() || 0}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 relative">
                    {row.explanation ? (
                      <MetricTooltip explanation={row.explanation}>
                        <span>{row.label}</span>
                      </MetricTooltip>
                    ) : (
                      <span>{row.label}</span>
                    )}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">
                    {typeof row["Total"] === "number"
                      ? row["Total"].toLocaleString()
                      : row["Total"] || "-"}
                  </td>
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

export default SummaryReport;
