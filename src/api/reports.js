import apiClient from "./client";

const baseURL = import.meta.env.VITE_API;
const rootUrl = `${baseURL}reports`;

// Reports API service
const reportsApi = {
  /**
   * Generate and download points activity report
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date (ISO string or date)
   * @param {string} params.endDate - End date (ISO string or date)
   * @param {string} params.appType - Optional app type filter
   * @param {boolean} params.includeInactive - Include inactive customers
   * @returns {Promise<Blob>} Excel file as blob
   */
  generatePointsReport: async (params) => {
    const response = await apiClient.get(`${rootUrl}/points-activity`, {
      params,
      responseType: "blob", // Important for file download
    });
    return response.data;
  },

  /**
   * Update transactions with null app_type by looking up from metadata.requested_by
   * @returns {Promise<Object>} Update result with statistics
   */
  updateTransactionAppTypes: async () => {
    const response = await apiClient.post(
      `${rootUrl}/update-transaction-app-types`
    );
    return response.data;
  },
};

export default reportsApi;

