import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import focus9Api from "../api/focus9";

export function useFocus9() {
  const queryClient = useQueryClient();

  const useGetFocus9SqlStatus = () =>
    useQuery({
      queryKey: ["focus9SqlStatus"],
      queryFn: () => focus9Api.getSqlStatus(),
      staleTime: 30 * 1000,
      retry: 1,
    });

  const useGetFocus9SqlData = (enabled = true, limit = 50) =>
    useQuery({
      queryKey: ["focus9SqlData", limit],
      queryFn: () => focus9Api.getSqlData(limit),
      enabled,
      staleTime: 30 * 1000,
      retry: 1,
    });

  const refreshFocus9Views = () => {
    queryClient.invalidateQueries({ queryKey: ["focus9SqlStatus"] });
    queryClient.invalidateQueries({ queryKey: ["focus9SqlData"] });
  };

  const useGenerateFocus9Summary = () =>
    useMutation({
      mutationFn: () => focus9Api.generateSummary(),
      onSuccess: () => refreshFocus9Views(),
    });

  const useSyncFocus9Sql = () =>
    useMutation({
      mutationFn: () => focus9Api.syncSql(),
      onSuccess: () => refreshFocus9Views(),
    });

  const useGenerateAndSyncFocus9 = () =>
    useMutation({
      mutationFn: () => focus9Api.generateAndSync(),
      onSuccess: () => refreshFocus9Views(),
    });

  const useDeleteFocus9SqlRow = () =>
    useMutation({
      mutationFn: (id) => focus9Api.deleteSqlRow(id),
      onSuccess: () => refreshFocus9Views(),
    });

  return {
    useGetFocus9SqlStatus,
    useGetFocus9SqlData,
    refreshFocus9Views,
    useGenerateFocus9Summary,
    useSyncFocus9Sql,
    useGenerateAndSyncFocus9,
    useDeleteFocus9SqlRow,
  };
}
