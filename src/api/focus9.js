import apiClient from "./client";

const rootUrl = "/focus9";

const focus9Api = {
  generateSummary: async () => {
    const response = await apiClient.post(
      `${rootUrl}/generate-summary`,
      {},
      { timeout: 120000 }
    );
    return response.data;
  },

  syncSql: async () => {
    const response = await apiClient.post(
      `${rootUrl}/sync-sql`,
      {},
      { timeout: 120000 }
    );
    return response.data;
  },

  generateAndSync: async () => {
    const response = await apiClient.post(
      `${rootUrl}/generate-and-sync`,
      {},
      { timeout: 120000 }
    );
    return response.data;
  },
};

export default focus9Api;
