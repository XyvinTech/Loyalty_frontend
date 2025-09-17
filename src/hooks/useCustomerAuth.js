import { useState, useEffect, useCallback } from "react";
import sdkApi from "../api/sdk";

const STORAGE_KEY = "khedmah_customer_auth";

export const useCustomerAuth = () => {
  const [customerAuth, setCustomerAuth] = useState({
    customerID: null,
    apiKey: null,
    name: null,
    isAuthenticated: false,
    customerData: null,
  });

  const [apiStatus, setApiStatus] = useState(null); // <-- track API status (200, 404, etc.)

  const updateCustomerData = useCallback((data) => {
    setApiStatus(200); // success
    setCustomerAuth((prevAuth) => {
      const updatedAuth = { ...prevAuth, customerData: data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAuth));
      return updatedAuth;
    });
  }, []);

  const clearAuth = useCallback(() => {
    setApiStatus(null);
    const clearedAuth = {
      customerID: null,
      apiKey: null,
      name: null,
      isAuthenticated: false,
      customerData: null,
    };
    setCustomerAuth(clearedAuth);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const setAuth = useCallback(
    (customerID, apiKey, name = null, customerData = null) => {
      setApiStatus(null);
      const authData = {
        customerID,
        apiKey,
        name,
        isAuthenticated: true,
        customerData,
      };
      setCustomerAuth(authData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    },
    []
  );

  const refreshCustomerData = useCallback(async () => {
    const { customerID, apiKey } = customerAuth;
    if (!customerID || !apiKey) return;

    try {
      const response = await sdkApi.getCustomerDetails(customerID, apiKey);
      setApiStatus(response.status); // track status
      if (response.status === 200 && response.data) {
        updateCustomerData(response.data);
      }
    } catch (error) {
      const status = error.response?.status || null;
      setApiStatus(status); // track error status (e.g., 404)
      console.error("Failed to refresh customer data:", error);
    }
  }, [customerAuth, updateCustomerData]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      const { customerID, apiKey, customerData, isAuthenticated } = customerAuth;

      if (isAuthenticated && customerID && apiKey && !customerData) {
        try {
          const response = await sdkApi.getCustomerDetails(customerID, apiKey);
          setApiStatus(response.status);
          if (response.status === 200 && response.data) {
            updateCustomerData(response.data);
          }
        } catch (error) {
          const status = error.response?.status || null;
          setApiStatus(status); // track error status
          console.error("Error fetching customer data:", error);
        }
      }
    };

    fetchCustomerData();
  }, [customerAuth, updateCustomerData]);

  useEffect(() => {
    const initializeAuth = () => {
      const queryParams = new URLSearchParams(window.location.search);
      const urlCustomerID = queryParams.get("customerID");
      const urlApiKey = queryParams.get("apiKey");
      const urlName = queryParams.get("name");

      if (urlCustomerID && urlApiKey) {
        const authData = {
          customerID: urlCustomerID,
          apiKey: urlApiKey,
          name: urlName,
          isAuthenticated: true,
          customerData: null,
        };
        setCustomerAuth(authData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
        return;
      }

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedAuth = JSON.parse(stored);
          if (parsedAuth.customerID && parsedAuth.apiKey) {
            setCustomerAuth(parsedAuth);
            return;
          }
        }
      } catch (error) {
        console.error("Error reading customer auth from localStorage:", error);
      }

      setCustomerAuth({
        customerID: null,
        apiKey: null,
        name: null,
        isAuthenticated: false,
        customerData: null,
      });
    };

    initializeAuth();
  }, []);

  return {
    ...customerAuth,
    apiStatus, // <-- expose API status
    updateCustomerData,
    clearAuth,
    setAuth,
    refreshCustomerData,
  };
};
