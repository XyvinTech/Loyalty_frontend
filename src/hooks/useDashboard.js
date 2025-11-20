import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard";

/**
 * Custom hook for dashboard statistics using TanStack Query
 */
export function useDashboard() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const response = await dashboardApi.getStats();
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });

  return {
    dashboardData: data,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  };
}



