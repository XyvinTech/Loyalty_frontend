import apiClient from "./client";

const rootUrl = "http://localhost:3002/api/v1/auth";

// Authentication API service
const authApi = {
  // Login user
  login: async (credentials) => {
    console.log(credentials);
    const response = await apiClient.post(`${rootUrl}/login`, credentials);
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await apiClient.post(`${rootUrl}/register`, userData);
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await apiClient.get(`${rootUrl}/me`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await apiClient.put(`${rootUrl}/profile`, userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await apiClient.put(`${rootUrl}/change-password`, passwordData);
    return response.data;
  },

  // Logout user (server-side)
  logout: async () => {
    const response = await apiClient.post(`${rootUrl}/logout`);
    return response.data;
  },

};

export default authApi;
