import { useState } from "react";
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useReports } from "../../hooks/useReports";
import StyledTable from "../../ui/StyledTable";
import StyledButton from "../../ui/StyledButton";
import RefreshButton from "../../ui/RefreshButton";
import Loader from "../../ui/Loader";
import useUiStore from "../../store/ui";

// Format date to YYYY-MM-DD for input[type=date]
const toInputDate = (d) => {
  const date = new Date(d);
  return date.toISOString().split("T")[0];
};

const DEFAULT_DATES = (() => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    startDate: toInputDate(start),
    endDate: toInputDate(now),
  };
})();

const OfferSummaryReport = () => {
  const { addToast } = useUiStore();
  const { useGetOfferSummary, useExportOfferSummary } = useReports();

  const [dateRange, setDateRange] = useState(DEFAULT_DATES);
  const [appliedRange, setAppliedRange] = useState(DEFAULT_DATES);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading, isFetching, refetch } = useGetOfferSummary(
    appliedRange.startDate,
    appliedRange.endDate
  );

  const exportMutation = useExportOfferSummary();

  const rows = data?.data?.data || [];

  // Collect all tier column names from data
  const tierColumns = (() => {
    const tierSet = new Set();
    rows.forEach((r) => {
      Object.keys(r.tierBreakdown || {}).forEach((t) => tierSet.add(t));
    });
    return Array.from(tierSet).sort();
  })();

  // Filter by search term (category, brand, title)
  const filteredRows = rows.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.category?.toLowerCase().includes(q) ||
      r.brand?.toLowerCase().includes(q) ||
      r.title?.toLowerCase().includes(q)
    );
  });

  const handleApplyFilter = () => {
    setAppliedRange(dateRange);
    setShowFilters(false);
  };

  const handleDownload = async () => {
    addToast({
      type: "info",
      message: "Preparing Offer Summary Excel. Please wait…",
    });
    try {
      const response = await exportMutation.mutateAsync({
        startDate: appliedRange.startDate,
        endDate: appliedRange.endDate,
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `offer_summary_${appliedRange.startDate}_${appliedRange.endDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      addToast({ type: "success", message: "Offer Summary Excel downloaded." });
    } catch {
      addToast({ type: "error", message: "Failed to export Offer Summary." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Offer Summary Report</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Offer usage, redemption counts and per-tier user breakdown
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <RefreshButton onClick={() => refetch()} isLoading={isFetching} />
          <StyledButton
            name={
              <>
                <FunnelIcon className="h-4 w-4" />
                Filter
              </>
            }
            onClick={() => setShowFilters(true)}
            variant="secondary"
          />
          <StyledButton
            name={
              exportMutation.isPending ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Exporting…
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Download Excel
                </>
              )
            }
            onClick={handleDownload}
            disabled={exportMutation.isPending || rows.length === 0}
            variant="primary"
          />
        </div>
      </div>

      {/* Applied date range badge */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
          {appliedRange.startDate} → {appliedRange.endDate}
        </span>
        <span>{rows.length} offers</span>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search category, brand, offer title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Category",
                    "Brand",
                    "Offer Title",
                    "Description",
                    "Total Redemptions",
                    ...tierColumns.map((t) => `Users – ${t}`),
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRows.length > 0 ? (
                  filteredRows.map((row, idx) => (
                    <tr key={row.offer_id || idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {row.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {row.brand}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-[200px] truncate" title={row.title}>
                        {row.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-[220px] truncate" title={row.description}>
                        {row.description}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-indigo-600 text-center">
                        {row.totalRedemptions?.toLocaleString() || 0}
                      </td>
                      {tierColumns.map((t) => (
                        <td key={t} className="px-4 py-3 text-sm text-gray-600 text-center">
                          {row.tierBreakdown?.[t]?.toLocaleString() || 0}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5 + tierColumns.length}
                      className="px-4 py-10 text-center text-gray-400 text-sm"
                    >
                      {rows.length === 0
                        ? "No offer redemptions found for the selected period."
                        : "No offers match your search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filter modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Filter by Date Range</h3>
              <button onClick={() => setShowFilters(false)}>
                <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange((d) => ({ ...d, startDate: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange((d) => ({ ...d, endDate: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <StyledButton
                name="Cancel"
                onClick={() => setShowFilters(false)}
                variant="secondary"
              />
              <StyledButton
                name="Apply"
                onClick={handleApplyFilter}
                variant="primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferSummaryReport;
