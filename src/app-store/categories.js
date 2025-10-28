import { useQuery } from "@tanstack/react-query";
import { useCustomerAuth } from "../hooks/useCustomerAuth";
import sdkApi from "../api/sdk";

export const useGetCategories = (filter = {}) => {
  const { customerID, apiKey } = useCustomerAuth();

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
  });
};
