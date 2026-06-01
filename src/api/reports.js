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

  // Get transaction count for export estimation
  getTransactionExportCount: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return apiClient.get(`${rootUrl}/transaction-export/count?${params.toString()}`);
  },

  // Export transaction report as CSV (streaming)
  exportTransactionReport: (startDate, endDate, limit) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (limit) params.append("limit", limit);
    return apiClient.get(`${rootUrl}/transaction-export?${params.toString()}`, {
      responseType: "blob",
      timeout: 0, // No timeout - streaming response
    });
  },

  // Get offer summary report data (JSON)
  getOfferSummary: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return apiClient.get(`${rootUrl}/offer-summary?${params.toString()}`);
  },

  // Export offer summary as Excel blob
  exportOfferSummary: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return apiClient.get(`${rootUrl}/offer-summary/export?${params.toString()}`, {
      responseType: "blob",
    });
  },
};

export default reportsApi;




