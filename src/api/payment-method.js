import apiClient from "./client";

const rootUrl = "/payment-method";

const paymentMethodApi = {
  getPaymentMethods: async (params) => {
    const response = await apiClient.get(rootUrl,{
      params
    });
    return response.data;
  },
  getPaymentMethodById: async (id) => {
    const response = await apiClient.get(`${rootUrl}/${id}`);
    return response.data;
  },
  createPaymentMethod: async (paymentMethodData) => {
    const response = await apiClient.post(rootUrl, paymentMethodData);
    return response.data;
  },

  updatePaymentMethod: async (id, paymentMethodData) => {
    const response = await apiClient.put(`${rootUrl}/${id}`, paymentMethodData);
    return response.data;
  },
  deletePaymentMethod: async (id) => {
    const response = await apiClient.delete(`${rootUrl}/${id}`);
    return response.data;
  },
};

export default paymentMethodApi;
