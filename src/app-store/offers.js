import { useQuery } from "@tanstack/react-query";
import { useCustomerAuth } from "../hooks/useCustomerAuth";
import sdkApi from "../api/sdk";

export const useGetOffers = (filter = {}) => {
  const { customerID, apiKey } = useCustomerAuth();

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
      if (!customerID || !apiKey) return [];
      const params = {
        page: filter.page || 1,
        limit: filter.limit || 100,
        search: filter.search || "",
      };

      if (filter.brandId) params.brandId = filter.brandId;
      if (filter.categoryId) params.categoryId = filter.categoryId;

      const res = await sdkApi.getMerchantOffers(customerID, apiKey, params);
      return res?.data || [];
    },
    enabled: !!customerID && !!apiKey,
    keepPreviousData: true,
  });
};
