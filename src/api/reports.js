import apiClient from "./client";

const rootUrl = "/reports";

export const reportsApi = {
  // Get report data
  getReportData: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return apiClient.get(`${rootUrl}/data?${params.toString()}`);
  },

  // Export report as CSV
  exportReportCSV: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return apiClient.get(`${rootUrl}/export-csv?${params.toString()}`, {
      responseType: "blob",
    });
  },
};

export default reportsApi;




