import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_PROD,
  headers: {
    "Content-Type": "application/json",
    "api-key": import.meta.env.VITE_API_KEY,
  },
  timeout: 10000, // 10 secondss
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle authentication errors
    if (response && response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    // Handle server errors
    if (response && response.status >= 500) {
      console.error("Server error:", error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
