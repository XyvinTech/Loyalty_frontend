import React from "react";
import { useAudits } from "../../hooks/useAudit";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ViewLog = ({ open, onClose, id }) => {
  const { useGetLogById } = useAudits();
  const { data: logs } = useGetLogById(id);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl min-h-[500px] max-h-[60vh] overflow-y-auto p-6 mt-17 custom-scrollbar">
        <div className="absolute right-4 top-4 z-10">
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full bg-white/90 text-gray-500 hover:text-gray-900 transition shadow-sm"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Log Details</h2>
          {logs?.data && (
            <p className="text-sm text-gray-500 mt-1">
              Recorded on {new Date(logs.data.timestamp).toLocaleString()}
            </p>
          )}
        </div>

        {logs?.data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Basic Information
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Category:</span>{" "}
                    <span className="text-gray-600">{logs.data.category}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Action:</span>{" "}
                    <span className="text-gray-600">{logs.data.action}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Status:</span>{" "}
                    <span
                      className={`font-medium ${
                        logs.data.status === "success"
                          ? "text-green-600"
                          : logs.data.status === "error"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {logs.data.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  User Information
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">User:</span>{" "}
                    <span className="text-gray-600">
                      {logs?.data?.userName || logs?.data?.details?.username}
                    </span>
                  </p>
                  {logs.data.userEmail && (
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Email:</span>{" "}
                      <span className="text-gray-600">
                        {logs.data.userEmail}
                      </span>
                    </p>
                  )}
                  {logs.data.userModel && (
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Role:</span>{" "}
                      <span className="text-gray-600">
                        {logs.data.userModel}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Technical Details
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">
                      IP Address:
                    </span>{" "}
                    <span className="text-gray-600">{logs.data.ip}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">
                      User Agent:
                    </span>{" "}
                    <span className="text-gray-600 break-words">
                      {logs.data.userAgent}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">
                      Request ID:
                    </span>{" "}
                    <span className="text-gray-600">{logs.data.requestId}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">
                      Target Model:
                    </span>{" "}
                    <span className="text-gray-600">
                      {logs.data.targetModel || "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Timestamps
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Created:</span>{" "}
                    <span className="text-gray-600">
                      {new Date(logs.data.createdAt).toLocaleString()}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Updated:</span>{" "}
                    <span className="text-gray-600">
                      {new Date(logs.data.updatedAt).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 bg-gray-50 p-3 rounded-md">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Description
              </h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {logs.data.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No log data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLog;
