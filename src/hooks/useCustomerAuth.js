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

  const updateCustomerData = useCallback((data) => {
    setCustomerAuth((prevAuth) => {
      const updatedAuth = {
        ...prevAuth,
        customerData: data,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAuth));
      return updatedAuth;
    });
  }, []);

  const clearAuth = useCallback(() => {
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

  const setAuth = useCallback((customerID, apiKey, name = null, customerData = null) => {
    const authData = {
      customerID,
      apiKey,
      name,
      isAuthenticated: true,
      customerData,
    };
    setCustomerAuth(authData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
  }, []);

  const refreshCustomerData = useCallback(async () => {
    const { customerID, apiKey } = customerAuth;
    if (!customerID || !apiKey) return;

    try {
      const response = await sdkApi.getCustomerDetails(customerID, apiKey);
      if (response.status === 200 && response.data) {
        updateCustomerData(response.data);
      }
    } catch (error) {
      console.error("Failed to refresh customer data:", error);
    }
  }, [customerAuth, updateCustomerData]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      const { customerID, apiKey, customerData, isAuthenticated } = customerAuth;

      if (isAuthenticated && customerID && apiKey && !customerData) {
        try {
          const response = await sdkApi.getCustomerDetails(customerID, apiKey);
          if (response.status === 200 && response.data) {
            updateCustomerData(response.data);
          }
        } catch (error) {
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
    updateCustomerData,
    clearAuth,
    setAuth,
    refreshCustomerData,
  };
};