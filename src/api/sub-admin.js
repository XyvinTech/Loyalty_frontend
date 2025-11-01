import apiClient from "./client";

const rootUrl = "/sub-admin";

const subAdminApi = {
  getSubAdmin: async (params) => {
    const response = await apiClient.get(rootUrl, {
      params,
    });
    return response.data;
  },

  getSubAdminById: async (id) => {
    const response = await apiClient.get(`${rootUrl}/${id}`);
    return response.data;
  },

  createSubAdmin: async (data) => {
    const response = await apiClient.post(rootUrl, data);
    return response.data;
  },

  updateSubAdmin: async (id, data) => {
    const response = await apiClient.put(`${rootUrl}/${id}`, data);
    return response.data;
  },
  deleteSubAdmin: async (id) => {
    const response = await apiClient.delete(`${rootUrl}/${id}`);
    return response.data;
  },

  // Password Change Request APIs
  createPasswordChangeRequest: async () => {
    const response = await apiClient.post(`${rootUrl}/password-change-request`);
    return response.data;
  },

  getAllPasswordChangeRequests: async (params) => {
    const response = await apiClient.get(
      `${rootUrl}/password-change-requests`,
      {
        params,
      }
    );
    return response.data;
  },

  getMyPasswordChangeRequests: async () => {
    const response = await apiClient.get(
      `${rootUrl}/my-password-change-requests`
    );
    return response.data;
  },

  approvePasswordChangeRequest: async (requestId, data) => {
    const response = await apiClient.post(
      `${rootUrl}/password-change-request/${requestId}/approve`,
      data
    );
    return response.data;
  },

  rejectPasswordChangeRequest: async (requestId, data) => {
    const response = await apiClient.post(
      `${rootUrl}/password-change-request/${requestId}/reject`,
      data
    );
    return response.data;
  },
};

export default subAdminApi;
