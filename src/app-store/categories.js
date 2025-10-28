import { useQuery } from "@tanstack/react-query";
import sdkApi from "../api/sdk";
const STORAGE_KEY = "khedmah_customer_auth";
export const useGetCategories = (filter = {}) => {
  const storedAuth = localStorage.getItem(STORAGE_KEY);
  const { customerID, apiKey } = storedAuth ? JSON.parse(storedAuth) : {};

  return useQuery({
    queryKey: ["appcategories", { customerID, apiKey, ...filter }],
    queryFn: async () => {
      if (!customerID || !apiKey) return [];
      const res = await sdkApi.getCategories(customerID, apiKey, {
        page: filter.page || 1,
        limit: filter.limit || 100,
        search: filter.search || "",
      });
      return res?.data || [];
    },
    enabled: !!customerID && !!apiKey,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
