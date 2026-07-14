import { useMutation } from "@tanstack/react-query";
import focus9Api from "../api/focus9";

export function useFocus9() {
  const useGenerateFocus9Summary = () =>
    useMutation({
      mutationFn: () => focus9Api.generateSummary(),
    });

  const useSyncFocus9Sql = () =>
    useMutation({
      mutationFn: () => focus9Api.syncSql(),
    });

  const useGenerateAndSyncFocus9 = () =>
    useMutation({
      mutationFn: () => focus9Api.generateAndSync(),
    });

  return {
    useGenerateFocus9Summary,
    useSyncFocus9Sql,
    useGenerateAndSyncFocus9,
  };
}
