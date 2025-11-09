import { useMutation, useQueryClient } from "@tanstack/react-query";
import manualPointsApi from "../api/manual_points";

export const useManualPoints = () => {
  const queryClient = useQueryClient();

  const invalidateCaches = () => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["customers"] });
  };

  const useAddPointsIndividual = () =>
    useMutation({
      mutationFn: manualPointsApi.addIndividual,
      onSuccess: () => {
        invalidateCaches();
      },
    });

  const useAddPointsBulk = () =>
    useMutation({
      mutationFn: manualPointsApi.addBulk,
      onSuccess: () => {
        invalidateCaches();
      },
    });

  const useReducePoints = () =>
    useMutation({
      mutationFn: manualPointsApi.reduce,
      onSuccess: () => {
        invalidateCaches();
      },
    });

  const useDownloadSampleTemplate = () =>
    useMutation({
      mutationFn: manualPointsApi.downloadSampleTemplate,
      onSuccess: (response) => {
        if (!response?.data) return;

        const blob = new Blob([response.data], {
          type: response.headers?.["content-type"] || "application/octet-stream",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        const contentDisposition = response.headers?.["content-disposition"];
        let fileName = "manual-points-template.xlsx";

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match?.[1]) {
            fileName = match[1];
          }
        }

        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
    });

  return {
    useAddPointsIndividual,
    useAddPointsBulk,
    useReducePoints,
    useDownloadSampleTemplate,
  };
};

export default useManualPoints;


