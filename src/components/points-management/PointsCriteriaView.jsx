import React from "react";
import { usePointsCriteria } from "../../hooks/usePointsCriteria";
import { XMarkIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import moment from "moment/moment";

const PointsCriteriaView = ({ open, onClose, id }) => {
  const { useGetPointsCriteriaById } = usePointsCriteria();
  const { data: selectedCriteria } = useGetPointsCriteriaById(id);

  if (!open) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here if needed
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col mt-17">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedCriteria?.data?.serviceType?.icon && (
              <img
                src={selectedCriteria?.data?.serviceType?.icon}
                alt={selectedCriteria?.data?.serviceType?.title?.en}
                className="w-14 h-14 rounded-lg shadow-sm"
              />
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {selectedCriteria?.data?.serviceType?.title?.en ||
                  "Service Details"}
              </h2>
              {selectedCriteria?.data?.unique_code && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="inline-flex items-center bg-blue-100 border border-blue-200 rounded-lg px-3 py-1.5">
                    <span className="text-xs font-medium text-blue-600 mr-2">CODE:</span>
                    <span className="text-sm font-mono font-semibold text-blue-800 tracking-wider">
                      {selectedCriteria.data.unique_code}
                    </span>
                  
                  </div>
                </div>
              )}
              <p className="text-gray-600 text-sm mt-1">
                <span className="font-medium">Valid:</span>{" "}
                {selectedCriteria?.data?.startDate
                  ? moment(selectedCriteria.data.startDate).locale("en").format(
                      "MMM D, YYYY"
                    )
                  : "N/A"}{" "}
                -{" "}
                {selectedCriteria?.data?.endDate
                  ? moment(selectedCriteria.data.endDate).locale("en").format("MMM D, YYYY")
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                selectedCriteria?.data?.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {selectedCriteria?.data?.isActive ? "Active" : "Inactive"}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/90 text-gray-500 hover:text-gray-900 transition shadow-sm"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <h3 className="text-gray-800 font-medium mb-3 text-sm uppercase tracking-wide">
                Event Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium">
                    {selectedCriteria?.data?.eventType?.name?.en || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Description</span>
                  <span>
                    {selectedCriteria?.data?.eventType?.description?.en ||
                      "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <h3 className="text-gray-800 font-medium mb-3 text-sm uppercase tracking-wide">
                Service Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-500">Title</span>
                  <span className="font-medium">
                    {selectedCriteria?.data?.serviceType?.title?.en || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Description</span>
                  <span>
                    {selectedCriteria?.data?.serviceType?.description?.en ||
                      "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <h3 className="text-gray-800 font-medium mb-3 text-sm uppercase tracking-wide">
              App Type Details
            </h3>
            <div className="flex items-center gap-4">
              {selectedCriteria?.data?.appType?.icon && (
                <img
                  src={selectedCriteria?.data?.appType?.icon}
                  alt={selectedCriteria?.data?.appType?.name}
                  className="w-16 h-16 rounded-lg shadow-sm object-cover"
                />
              )}
              <div className="flex-grow space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {selectedCriteria?.data?.appType?.name || "N/A"}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      {selectedCriteria?.data?.appType?.description ||
                        "No description available"}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      selectedCriteria?.data?.appType?.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedCriteria?.data?.appType?.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <h3 className="text-gray-800 font-medium mb-3 text-sm uppercase tracking-wide">
              Transaction Conditions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <span className="text-xs text-gray-500 font-medium">
                  Transaction Limits
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">Weekly</div>
                    <div className="text-lg font-medium">
                      {selectedCriteria?.data?.conditions?.maxTransactions
                        ?.weekly
                        ? selectedCriteria.data.conditions.maxTransactions
                            .weekly
                        : "Unlimited"}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">Monthly</div>
                    <div className="text-lg font-medium">
                      {selectedCriteria?.data?.conditions?.maxTransactions
                        ?.monthly == null ||
                      selectedCriteria?.data?.conditions?.maxTransactions
                        ?.monthly === 0
                        ? "Unlimited"
                        : selectedCriteria?.data?.conditions?.maxTransactions
                            ?.monthly}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <span className="text-xs text-gray-500 font-medium">
                  Value Limits
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">Minimum</div>
                    <div className="text-lg font-medium">
                      {selectedCriteria?.data?.conditions
                        ?.transactionValueLimits?.minValue == null ||
                      selectedCriteria?.data?.conditions?.transactionValueLimits
                        ?.minValue === 0
                        ? "Unlimited"
                        : `OMR ${selectedCriteria?.data?.conditions?.transactionValueLimits?.minValue}`}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">Maximum</div>
                    <div className="text-lg font-medium">
                      {selectedCriteria?.data?.conditions
                        ?.transactionValueLimits?.maxValue == null ||
                      selectedCriteria?.data?.conditions?.transactionValueLimits
                        ?.maxValue === 0
                        ? "Unlimited"
                        : `OMR ${selectedCriteria?.data?.conditions?.transactionValueLimits?.maxValue}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <h3 className="text-gray-800 font-medium mb-3 text-sm uppercase tracking-wide">
              Point System
            </h3>
            <div className="overflow-hidden rounded-lg border border-gray-100">
              {selectedCriteria?.data?.pointSystem?.map((point, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 text-sm ${
                    index > 0 ? "border-t border-gray-100" : ""
                  }`}
                >
                  <div className="p-3 bg-gray-50">{point.paymentMethod}</div>
                  <div className="p-3 capitalize">{point.pointType}</div>
                  <div className="p-3 font-medium">
                    {point.pointType === "percentage"
                      ? `${point.pointRate}%`
                      : point.pointRate}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 pt-2">
            <div>Created: {formatDate(selectedCriteria?.data?.createdAt)}</div>
            <div>Updated: {formatDate(selectedCriteria?.data?.updatedAt)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsCriteriaView;