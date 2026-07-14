import { useState } from "react";
import { ServerStackIcon } from "@heroicons/react/24/outline";
import StyledButton from "../../ui/StyledButton";
import useUiStore from "../../store/ui";
import { useFocus9 } from "../../hooks/useFocus9";

const Focus9Integration = () => {
  const { addToast } = useUiStore();
  const {
    useGenerateFocus9Summary,
    useSyncFocus9Sql,
    useGenerateAndSyncFocus9,
  } = useFocus9();

  const generateMutation = useGenerateFocus9Summary();
  const syncMutation = useSyncFocus9Sql();
  const fullTestMutation = useGenerateAndSyncFocus9();

  const [lastResult, setLastResult] = useState(null);

  const isBusy =
    generateMutation.isPending ||
    syncMutation.isPending ||
    fullTestMutation.isPending;

  const handleResult = (label, response, error) => {
    if (error) {
      const payload = {
        action: label,
        success: false,
        message: error?.response?.data?.message || error.message,
        data: error?.response?.data?.data || null,
      };
      setLastResult(payload);
      addToast({
        type: "error",
        message: payload.message || "Focus9 test failed",
      });
      return;
    }

    const payload = {
      action: label,
      success: true,
      message: response?.message,
      data: response?.data,
    };
    setLastResult(payload);
    addToast({
      type: "success",
      message: response?.message || "Focus9 test completed",
    });
  };

  const runGenerateSummary = () => {
    generateMutation.mutate(undefined, {
      onSuccess: (res) => handleResult("Generate Summary", res),
      onError: (err) => handleResult("Generate Summary", null, err),
    });
  };

  const runSyncSql = () => {
    syncMutation.mutate(undefined, {
      onSuccess: (res) => handleResult("Sync to SQL", res),
      onError: (err) => handleResult("Sync to SQL", null, err),
    });
  };

  const runFullTest = () => {
    fullTestMutation.mutate(undefined, {
      onSuccess: (res) => handleResult("Generate & Sync", res),
      onError: (err) => handleResult("Generate & Sync", null, err),
    });
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <ServerStackIcon className="h-7 w-7 text-green-700" />
            FOCUS SQL Integration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Test the daily Focus9 summary push to FOCUS SQL Server. Runs from
            the Loyalty backend server (not your local machine).
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-medium text-gray-800">Test Actions</h2>
        <p className="text-sm text-gray-500">
          Use <strong>Run Full Test</strong> to generate today&apos;s summary in
          Mongo and push unsynced rows to{" "}
          <code className="text-xs bg-gray-100 px-1 rounded">
            TblLoyaltyPoints
          </code>
          .
        </p>

        <div className="flex flex-wrap gap-3">
          <StyledButton
            name="Run Full Test"
            onClick={runFullTest}
            isLoading={fullTestMutation.isPending}
            loadingLabel="Running test…"
            disabled={isBusy && !fullTestMutation.isPending}
          />
          <StyledButton
            name="Generate Summary Only"
            variant="secondary"
            onClick={runGenerateSummary}
            isLoading={generateMutation.isPending}
            loadingLabel="Generating…"
            disabled={isBusy && !generateMutation.isPending}
          />
          <StyledButton
            name="Sync to SQL Only"
            variant="download"
            onClick={runSyncSql}
            isLoading={syncMutation.isPending}
            loadingLabel="Syncing…"
            disabled={isBusy && !syncMutation.isPending}
          />
        </div>
      </div>

      {lastResult && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-gray-800">Last Result</h2>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                lastResult.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {lastResult.success ? "Success" : "Failed"}
            </span>
          </div>
          <p className="text-sm text-gray-600">{lastResult.message}</p>
          <pre className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto max-h-96">
            {JSON.stringify(lastResult.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Focus9Integration;
