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

  return {
    useGetReportData,
    useExportReportCSV,
  };
}

