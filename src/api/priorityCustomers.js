import apiClient from "./client";

const rootUrl = "/priority-customers";

const priorityCustomersApi = {
  getPriorityCustomers: async (params = {}) => {
    const response = await apiClient.get(rootUrl, { params });
    return response.data;
  },

  getPriorityCustomerById: async (id) => {
    const response = await apiClient.get(`${rootUrl}/${id}`);
    return response.data;
  },

  createPriorityCustomer: async (payload) => {
    const response = await apiClient.post(rootUrl, payload);
    return response.data;
  },

  updatePriorityCustomer: async (id, payload) => {
    const response = await apiClient.put(`${rootUrl}/${id}`, payload);
    return response.data;
  },

  deletePriorityCustomer: async (id) => {
    const response = await apiClient.delete(`${rootUrl}/${id}`);
    return response.data;
  },

  checkPriorityStatus: async (customerId) => {
    const response = await apiClient.get(`${rootUrl}/check/${customerId}`);
    return response.data;
  },
};

export default priorityCustomersApi;

