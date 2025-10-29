import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import sdkApi from "../api/sdk";
import { safeStorage, safeConsole } from "../utils/errorHandler";

const STORAGE_KEY = "khedmah_customer_auth";

export const useCustomerAuth = () => {
  const [customerAuth, setCustomerAuth] = useState({
    customerID: null,
    apiKey: null,
    name: null,
    isAuthenticated: false,
  });

  // ✅ Initialize from URL or localStorage with error handling
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const customerID = params.get("customerID");
      const apiKey = params.get("apiKey");
      const name = params.get("name");

      if (customerID && apiKey) {
        const authData = { customerID, apiKey, name, isAuthenticated: true };
        setCustomerAuth(authData);
        safeStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
        return;
      }

      const stored = safeStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.customerID && parsed.apiKey) {
            setCustomerAuth(parsed);
          }
        } catch (error) {
          safeConsole.error("Error parsing stored auth:", error);
          // Clear corrupted storage
          safeStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      safeConsole.error("Error in auth initialization:", error);
    }
  }, []);

  // ✅ Fetch customer details using TanStack Query with enhanced error handling
  const {
    data: customerData = null,
    status: queryStatus,
    refetch: refreshCustomerData,
    isFetching: isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["customerDetails", customerAuth.customerID, customerAuth.apiKey],
    queryFn: async () => {
      try {
        const res = await sdkApi.getCustomerDetails(
          customerAuth.customerID,
          customerAuth.apiKey
        );
        return res?.data || null;
      } catch (error) {
        safeConsole.error("Failed to fetch customer details:", error);
        // Check if it's a 404 error
        if (error?.response?.status === 404) {
          throw error; // Allow 404 to propagate for proper handling
        }
        // For other errors, return null instead of throwing
        return null;
      }
    },
    enabled: !!customerAuth.customerID && !!customerAuth.apiKey,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404
      if (error?.response?.status === 404) return false;
      // Retry other errors once
      return failureCount < 1;
    },
    // Prevent error from crashing the app
    useErrorBoundary: false,
    onError: (error) => {
      safeConsole.error("Customer details query error:", error);
    },
  });

  // ✅ Set and clear auth with safe storage
  const setAuth = (customerID, apiKey, name = null) => {
    try {
      const authData = { customerID, apiKey, name, isAuthenticated: true };
      setCustomerAuth(authData);
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    } catch (error) {
      safeConsole.error("Error setting auth:", error);
    }
  };

  const clearAuth = () => {
    try {
      setCustomerAuth({
        customerID: null,
        apiKey: null,
        name: null,
        isAuthenticated: false,
      });
      safeStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      safeConsole.error("Error clearing auth:", error);
    }
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
