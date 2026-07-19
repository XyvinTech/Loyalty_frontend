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

  getMongoData: async (limit = 50) => {
    const response = await apiClient.get(`${rootUrl}/mongo-data`, {
      params: { limit },
      timeout: 30000,
    });
    return response.data;
  },

  backfill: async ({ from, to, skipSql = false }) => {
    const response = await apiClient.post(
      `${rootUrl}/backfill`,
      { from, to, skipSql },
      { timeout: 300000 }
    );
    return response.data;
  },

  deleteSqlRow: async (id) => {
    const response = await apiClient.delete(`${rootUrl}/sql-data/${id}`, {
      timeout: 30000,
    });
    return response.data;
  },
};

export default focus9Api;
