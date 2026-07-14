import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import reportsApi from "../api/reports";

/**
 * Custom hook for reports using TanStack Query
 */
export function useReports() {
  const queryClient = useQueryClient();

  // Get report data
  const useGetReportData = (startDate, endDate) => {
    return useQuery({
      queryKey: ["reports", "data", startDate, endDate],
      queryFn: () => reportsApi.getReportData(startDate, endDate),
      staleTime: 2 * 60 * 1000, // 2 minutes
      enabled: !!(startDate && endDate),
    });
  };

  // Export report as CSV
  const useExportReportCSV = () => {
    return useMutation({
      mutationFn: ({ startDate, endDate }) =>
        reportsApi.exportReportCSV(startDate, endDate),
      onSuccess: (data, variables) => {
        // Create blob and download
        const blob = new Blob([data.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const filename = `reports_${variables.startDate}_${variables.endDate}.csv`;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      },
    });
  };

  // Get transaction export count for estimation
  const useGetTransactionExportCount = (startDate, endDate) => {
    return useQuery({
      queryKey: ["reports", "transaction-export-count", startDate, endDate],
      queryFn: () => reportsApi.getTransactionExportCount(startDate, endDate),
      staleTime: 30 * 1000, // 30 seconds
      enabled: !!(startDate && endDate),
    });
  };

  // Export transaction report as CSV (streaming)
  const useExportTransactionReport = () => {
    return useMutation({
      mutationFn: ({ startDate, endDate, limit }) =>
        reportsApi.exportTransactionReport(startDate, endDate, limit),
      onSuccess: (data, variables) => {
        // Create blob and download
        const blob = new Blob([data.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const filename = `transaction_report_${variables.startDate}_${variables.endDate}.csv`;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      },
    });
  };

  // Get offer summary report data
  const useGetOfferSummary = (startDate, endDate) => {
    return useQuery({
      queryKey: ["reports", "offer-summary", startDate, endDate],
      queryFn: () => reportsApi.getOfferSummary(startDate, endDate),
      staleTime: 2 * 60 * 1000,
    });
  };

  // Export offer summary as Excel
  const useExportOfferSummary = () => {
    return useMutation({
      mutationFn: ({ startDate, endDate }) =>
        reportsApi.exportOfferSummary(startDate, endDate),
    });
  };

  return {
    useGetReportData,
    useExportReportCSV,
    useGetTransactionExportCount,
    useExportTransactionReport,
    useGetOfferSummary,
    useExportOfferSummary,
  };
}




