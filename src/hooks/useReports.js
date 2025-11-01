import { useMutation } from "@tanstack/react-query";
import reportsApi from "../api/reports";
import useUiStore from "../store/ui";

/**
 * Custom hook for reports using TanStack Query
 */
export function useReports() {
  const { addToast } = useUiStore();

  /**
   * Update transaction app types from metadata
   */
  const useUpdateTransactionAppTypes = () => {
    return useMutation({
      mutationFn: () => reportsApi.updateTransactionAppTypes(),
      onSuccess: (response) => {
        const data = response?.data || {};
        addToast(
          `Successfully updated ${data.success || 0} transactions. Failed: ${
            data.failed || 0
          }`,
          "success"
        );
      },
      onError: (error) => {
        addToast(
          error?.response?.data?.message ||
            "Failed to update transaction app types",
          "error"
        );
      },
    });
  };

  /**
   * Generate and download points activity report
   */
  const useGeneratePointsReport = () => {
    return useMutation({
      mutationFn: (params) => reportsApi.generatePointsReport(params),
      onSuccess: (blob, variables) => {
        // Create a download link and trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Create filename with date range
        const startDate = variables.startDate
          ? new Date(variables.startDate).toISOString().split("T")[0]
          : "start";
        const endDate = variables.endDate
          ? new Date(variables.endDate).toISOString().split("T")[0]
          : "end";

        link.setAttribute(
          "download",
          `Points_Activity_Report_${startDate}_to_${endDate}.xlsx`
        );

        // Append to body, click, and cleanup
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Release the blob URL
        window.URL.revokeObjectURL(url);

        addToast("Report generated successfully", "success");
      },
      onError: (error) => {
        console.error("Report generation error:", error);
        addToast(
          error?.response?.data?.message ||
            "Failed to generate report. Please try again.",
          "error"
        );
      },
    });
  };

  return {
    useGeneratePointsReport,
    useUpdateTransactionAppTypes,
  };
}

