import { useQuery } from "@tanstack/react-query";
import sdkApi from "../api/sdk";
import { safeStorage, safeConsole } from "../utils/errorHandler";

const STORAGE_KEY = "khedmah_customer_auth";

export const useGetCategories = (filter = {}) => {
  let customerID = null;
  let apiKey = null;

  try {
    const storedAuth = safeStorage.getItem(STORAGE_KEY);
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      customerID = parsed.customerID;
      apiKey = parsed.apiKey;
    }
  } catch (error) {
    safeConsole.error("Error parsing stored auth:", error);
  }

  return useQuery({
    queryKey: ["appcategories", { customerID, apiKey, ...filter }],
    queryFn: async () => {
      try {
        if (!customerID || !apiKey) {
          safeConsole.warn("Missing auth credentials for categories");
          return [];
        }

        const res = await sdkApi.getCategories(customerID, apiKey, {
          page: filter.page || 1,
          limit: filter.limit || 100,
          search: filter.search || "",
        });

        return res?.data || [];
      } catch (error) {
        safeConsole.error("Failed to fetch categories:", error);
        return [];
      }
    },
    enabled: !!customerID && !!apiKey,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    onError: (error) => {
      safeConsole.error("Categories query error:", error);
    },
    useErrorBoundary: false,
  });
};
