import apiClient from "./client";

const rootUrl = "/focus9";

const focus9Api = {
  getSqlStatus: async () => {
    const response = await apiClient.get(`${rootUrl}/sql-status`, {
      timeout: 30000,
    });
    return response.data;
  },

  getSqlData: async (limit = 50) => {
    const response = await apiClient.get(`${rootUrl}/sql-data`, {
      params: { limit },
      timeout: 30000,
    });
    return response.data;
  },

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
