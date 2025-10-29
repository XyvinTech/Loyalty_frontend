import { useQuery } from "@tanstack/react-query";
import sdkApi from "../api/sdk";
import { safeStorage, safeConsole } from "../utils/errorHandler";

const STORAGE_KEY = "khedmah_customer_auth";

export const useGetOffers = (filter = {}) => {
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
    queryKey: [
      "appoffers",
      {
        customerID,
        apiKey,
        page: filter.page || 1,
        limit: filter.limit || 100,
        search: filter.search || "",
        brandId: filter.brandId || null,
        categoryId: filter.categoryId || null,
      },
    ],
    queryFn: async () => {
      try {
        if (!customerID || !apiKey) {
          safeConsole.warn("Missing auth credentials for offers");
          return [];
        }

        const params = {
          page: filter.page || 1,
          limit: filter.limit || 100,
          search: filter.search || "",
        };

        if (filter.brandId) params.brandId = filter.brandId;
        if (filter.categoryId) params.categoryId = filter.categoryId;

        const res = await sdkApi.getMerchantOffers(customerID, apiKey, params);
        return res?.data || [];
      } catch (error) {
        safeConsole.error("Failed to fetch offers:", error);
        return [];
      }
    },
    enabled: !!customerID && !!apiKey,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    onError: (error) => {
      safeConsole.error("Offers query error:", error);
    },
    useErrorBoundary: false,
  });
};
