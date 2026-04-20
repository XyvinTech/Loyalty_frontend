import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import useUiStore, { selectBulkJob } from "../store/ui";
import manualPointsApi from "../api/manual_points";

const POLL_INTERVAL_MS = 5000;
const AUTO_DISMISS_SUCCESS_MS = 10000;

const formatEstimatedTime = (ms) => {
  if (!ms || ms <= 0) return "calculating...";
  const minutes = Math.ceil(ms / 60000);
  if (minutes < 60) {
    return `~${minutes} minute${minutes === 1 ? "" : "s"}`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `~${hours}h ${mins}m`;
};

export default function BulkJobBanner() {
  const bulkJob = useUiStore(selectBulkJob);
  const clearBulkJob = useUiStore((s) => s.clearBulkJob);
  const setBulkJob = useUiStore((s) => s.setBulkJob);
  const queryClient = useQueryClient();
  const pollIntervalRef = useRef(null);
  const dismissTimerRef = useRef(null);

  useEffect(() => {
    if (!bulkJob?.jobId) return;

    const status = bulkJob.status || "pending";
    if (status === "completed" || status === "failed") {
      if (status === "completed") {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        dismissTimerRef.current = setTimeout(() => {
          clearBulkJob();
        }, AUTO_DISMISS_SUCCESS_MS);
      }
      return () => {
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      };
    }

    const fetchStatus = async () => {
      try {
        const res = await manualPointsApi.getBulkJobStatus(bulkJob.jobId);
        const payload = res?.data ?? res;
        const jobData = typeof payload === "object" && payload?.data ? payload.data : payload;
        setBulkJob({
          ...bulkJob,
          ...jobData,
        });
      } catch (err) {
        console.error("Bulk job status fetch error:", err);
      }
    };

    fetchStatus();
    pollIntervalRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [bulkJob?.jobId, bulkJob?.status]);

  if (!bulkJob?.jobId) return null;

  const status = bulkJob.status || "pending";
  const isProcessing = status === "pending" || status === "processing";
  const isCompleted = status === "completed";
  const isFailed = status === "failed";

  const handleDismiss = () => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    clearBulkJob();
  };

  return (
    <div
      className={`fixed left-0 right-0 top-16 z-40 flex items-center justify-between gap-4 px-4 py-3 shadow-md ${
        isFailed
          ? "bg-red-50 text-red-800 border-b border-red-200"
          : isCompleted
            ? "bg-green-50 text-green-800 border-b border-green-200"
            : "bg-amber-50 text-amber-900 border-b border-amber-200"
      }`}
    >
      <div className="flex flex-1 items-center gap-4 overflow-hidden">
        {isProcessing && (
          <div className="flex shrink-0 items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            <span className="text-sm font-medium">
              Bulk points upload in progress — This may take {formatEstimatedTime(bulkJob.estimatedTimeMs)}. You can navigate away and check back later.
            </span>
          </div>
        )}
        {isCompleted && (
          <div className="flex shrink-0 items-center gap-2">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium">
              Bulk upload completed: {bulkJob.successCount ?? bulkJob.result?.success_count ?? 0} rows processed successfully
              {bulkJob.skippedCount > 0 && `, ${bulkJob.skippedCount} skipped (duplicates)`}
            </span>
          </div>
        )}
        {isFailed && (
          <div className="flex shrink-0 items-center gap-2">
            <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
            <span className="text-sm font-medium">
              Bulk upload failed: {bulkJob.error || "Unknown error"}
            </span>
          </div>
        )}

        {isProcessing && (
          <div className="flex min-w-[200px] flex-1 items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-amber-200">
              <div
                className="h-full rounded-full bg-amber-600 transition-all duration-300"
                style={{ width: `${bulkJob.progress ?? 0}%` }}
              />
            </div>
            <span className="text-xs font-medium shrink-0">{bulkJob.progress ?? 0}%</span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 rounded p-1 hover:bg-black/5"
        aria-label="Dismiss"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
