import apiClient from "./client";

const rootUrl = "/manual-points";

const manualPointsApi = {
  addIndividual: async (payload) => {
    const response = await apiClient.post(`${rootUrl}/add-individual`, payload);
    return response.data;
  },

  addBulk: async (formData) => {
    const response = await apiClient.post(`${rootUrl}/add-bulk`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 0,
    });
    return response.data;
  },

  getBulkJobStatus: async (jobId) => {
    const response = await apiClient.get(`${rootUrl}/add-bulk/status/${jobId}`);
    return response.data;
  },

  reduce: async (payload) => {
    const response = await apiClient.post(`${rootUrl}/reduce`, payload);
    return response.data;
  },

  downloadSampleTemplate: async () => {
    const response = await apiClient.get(`${rootUrl}/sample-template`, {
      responseType: "blob",
    });
    return response;
  },
};

export default manualPointsApi;



