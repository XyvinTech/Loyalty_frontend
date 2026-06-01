import apiClient from "./client";
const rootUrl = "/customer";

// Customer management API service
const customersApi = {
  // Get all customers with pagination
  getCustomers: async (params) => {
    const response = await apiClient.get(rootUrl, { params });
    return response.data;
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    const response = await apiClient.get(`${rootUrl}/${id}`);
    return response.data;
  },

  // Create new customer
  createCustomer: async (customerData) => {
    const response = await apiClient.post(rootUrl, customerData);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    const response = await apiClient.put(`${rootUrl}/${id}`, customerData);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id) => {
    const response = await apiClient.delete(`${rootUrl}/${id}`);
    return response.data;
  },

  // Get customer dashboard summary (points, tier progress, recent transactions)
  getCustomerDashboard: async (customerId) => {
    const response = await apiClient.get(`${rootUrl}/${customerId}/dashboard`);
    return response.data;
  },

  // Get customer transactions via the transaction module endpoint
  getCustomerTransactions: async (customerId, params) => {
    const response = await apiClient.get(
      `/transaction/customer/${customerId}`,
      { params }
    );
    return response.data;
  },

 

  // Export customers as CSV (blob)
  exportCustomers: async (params) => {
    const response = await apiClient.get(`${rootUrl}/export`, {
      params,
      responseType: "blob",
      timeout: 0,
    });
    return response.data;
  },
};

export default customersApi;
