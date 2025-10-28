import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import sdkApi from "../api/sdk";

const STORAGE_KEY = "khedmah_customer_auth";

export const useCustomerAuth = () => {
  const [customerAuth, setCustomerAuth] = useState({
    customerID: null,
    apiKey: null,
    name: null,
    isAuthenticated: false,
  });

  // ✅ Initialize from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const customerID = params.get("customerID");
    const apiKey = params.get("apiKey");
    const name = params.get("name");

    if (customerID && apiKey) {
      const authData = { customerID, apiKey, name, isAuthenticated: true };
      setCustomerAuth(authData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.customerID && parsed.apiKey) {
          setCustomerAuth(parsed);
        }
      } catch (error) {
        console.error("Error parsing stored auth:", error);
      }
    }
  }, []);

  // ✅ Fetch customer details using TanStack Query
  const {
    data: customerData = null,
    status: queryStatus,
    refetch: refreshCustomerData,
    isFetching: isLoading,
  } = useQuery({
    queryKey: ["customerDetails", customerAuth.customerID, customerAuth.apiKey],
    queryFn: async () => {
      const res = await sdkApi.getCustomerDetails(
        customerAuth.customerID,
        customerAuth.apiKey
      );
      return res?.data || null;
    },
    enabled: !!customerAuth.customerID && !!customerAuth.apiKey,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: 1,
  });

  // ✅ Set and clear auth
  const setAuth = (customerID, apiKey, name = null) => {
    const authData = { customerID, apiKey, name, isAuthenticated: true };
    setCustomerAuth(authData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
  };

  const clearAuth = () => {
    setCustomerAuth({
      customerID: null,
      apiKey: null,
      name: null,
      isAuthenticated: false,
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    ...customerAuth,
    customerData,
    apiStatus: queryStatus,
    isLoading,
    setAuth,
    clearAuth,
    refreshCustomerData,
  };
};
