import { useState } from "react";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ServerStackIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import StyledButton from "../../ui/StyledButton";
import useUiStore from "../../store/ui";
import { useFocus9 } from "../../hooks/useFocus9";

const SQL_COLUMNS = [
  { key: "iTransactionId", label: "ID" },
  { key: "TransactionDate", label: "Date" },
  { key: "TransactionType", label: "Type" },
  { key: "AdditionAmount", label: "Addition" },
  { key: "ExpiryAmount", label: "Expiry" },
  { key: "RedemptionAmount", label: "Redemption" },
  { key: "RedemptionCancel", label: "Redeem Cancel" },
  { key: "ManualAddition", label: "Manual +" },
  { key: "ManualDeduction", label: "Manual -" },
  { key: "PostedStatus", label: "Posted" },
];

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(value) {
  if (value === null || value === undefined) return "0.000";
  return Number(value).toFixed(3);
}

const Focus9Integration = () => {
  const { addToast } = useUiStore();
  const {
    useGetFocus9SqlStatus,
    useGetFocus9SqlData,
    refreshFocus9Views,
    useGenerateFocus9Summary,
    useSyncFocus9Sql,
    useGenerateAndSyncFocus9,
  } = useFocus9();

  const {
    data: statusResponse,
    isLoading: statusLoading,
    isFetching: statusFetching,
    refetch: refetchStatus,
  } = useGetFocus9SqlStatus();

  const sqlStatus = statusResponse?.data?.sql;
  const mongoStatus = statusResponse?.data?.mongo;
  const isSqlConnected = Boolean(sqlStatus?.connected);

  const {
    data: sqlDataResponse,
    isLoading: sqlDataLoading,
    isFetching: sqlDataFetching,
    refetch: refetchSqlData,
  } = useGetFocus9SqlData(isSqlConnected, 50);

  const generateMutation = useGenerateFocus9Summary();
  const syncMutation = useSyncFocus9Sql();
  const fullTestMutation = useGenerateAndSyncFocus9();

  const [lastResult, setLastResult] = useState(null);

  const isBusy =
    generateMutation.isPending ||
    syncMutation.isPending ||
    fullTestMutation.isPending;

  const sqlRows = sqlDataResponse?.data?.rows || [];

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

  const refreshAll = () => {
    refetchStatus();
    if (isSqlConnected) refetchSqlData();
    refreshFocus9Views();
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
            Check SQL connectivity and view live data from{" "}
            <code className="text-xs bg-gray-100 px-1 rounded">
              TblLoyaltyPoints
            </code>
            .
          </p>
        </div>
        <StyledButton
          name="Refresh Status"
          variant="download"
          onClick={refreshAll}
          isLoading={statusFetching || sqlDataFetching}
          loadingLabel="Refreshing…"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
            SQL Connection
          </p>
          {statusLoading ? (
            <p className="text-sm text-gray-400">Checking…</p>
          ) : (
            <div className="flex items-center gap-2">
              {isSqlConnected ? (
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              ) : (
                <XCircleIcon className="h-6 w-6 text-red-500" />
              )}
              <span
                className={`text-lg font-semibold ${
                  isSqlConnected ? "text-green-700" : "text-red-600"
                }`}
              >
                {isSqlConnected ? "Connected" : "Not Connected"}
              </span>
            </div>
          )}
          {sqlStatus?.error && (
            <p className="text-xs text-red-600 mt-2">{sqlStatus.error}</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
            SQL Target
          </p>
          <p className="text-sm text-gray-800 font-medium">
            {sqlStatus?.host || "-"}:{sqlStatus?.port || "-"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            DB: {sqlStatus?.database || "-"}
          </p>
          <p className="text-xs text-gray-500">
            Table: {sqlStatus?.table || "-"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Enabled: {sqlStatus?.enabled ? "Yes" : "No"}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
            Mongo Sync Queue
          </p>
          <p className="text-2xl font-semibold text-gray-800">
            {mongoStatus?.unsyncedCount ?? 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">unsynced summaries</p>
          {mongoStatus?.latestSynced?.date && (
            <p className="text-xs text-gray-500 mt-2">
              Last synced: {formatDate(mongoStatus.latestSynced.sql_synced_at)}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-medium text-gray-800">Test Actions</h2>
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

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-800">
              FOCUS SQL Table Data
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Latest rows from TblLoyaltyPoints
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetchSqlData()}
            disabled={!isSqlConnected || sqlDataFetching}
            className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            <ArrowPathIcon
              className={`h-4 w-4 ${sqlDataFetching ? "animate-spin" : ""}`}
            />
            Refresh table
          </button>
        </div>

        {!isSqlConnected ? (
          <div className="p-6 text-sm text-gray-500">
            SQL is not connected. Fix the connection to view table data.
          </div>
        ) : sqlDataLoading ? (
          <div className="p-6 text-sm text-gray-500">Loading SQL data…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {SQL_COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sqlRows.length > 0 ? (
                  sqlRows.map((row) => (
                    <tr key={row.iTransactionId} className="hover:bg-gray-50">
                      {SQL_COLUMNS.map((col) => (
                        <td
                          key={col.key}
                          className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
                        >
                          {col.key === "TransactionDate"
                            ? formatDate(row[col.key])
                            : col.key.includes("Amount")
                              ? formatAmount(row[col.key])
                              : row[col.key] ?? "-"}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={SQL_COLUMNS.length}
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      No rows in SQL table yet. Run a test to insert data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {lastResult && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-gray-800">Last Test Result</h2>
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
          {lastResult.data?.sqlStatus && (
            <p className="text-sm text-gray-600">
              SQL after test:{" "}
              <strong>
                {lastResult.data.sqlStatus.connected
                  ? "Connected"
                  : "Not Connected"}
              </strong>
              {lastResult.data.sqlStatus.error
                ? ` — ${lastResult.data.sqlStatus.error}`
                : ""}
            </p>
          )}
          <pre className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto max-h-64">
            {JSON.stringify(lastResult.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Focus9Integration;
