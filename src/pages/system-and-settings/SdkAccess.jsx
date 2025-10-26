import React, { useEffect, useState } from "react";
import { useSdkAccessKeyGen } from "../../hooks/useSdkAccessKeyGen";
import { useAppTypes } from "../../hooks/useAppTypes";
import {
  CodeBracketIcon,
  BookOpenIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";

const SdkAccess = () => {
  const { useGetAppTypes } = useAppTypes();
  const { data: appTypeData } = useGetAppTypes();
  const appTypes = appTypeData?.data;

  const [selectedAppType, setSelectedAppType] = useState(null);
  const {
    useGetSdkAccessKeyGen,
    useUpdateSdkAccessKey,
    useGenerateSdkAccessKey,
  } = useSdkAccessKeyGen();
  const { data: sdkAccessKeyGen } = useGetSdkAccessKeyGen(selectedAppType);
  const [copySuccess, setCopySuccess] = useState(false);
  const updateMutation = useUpdateSdkAccessKey();
  const createMutation = useGenerateSdkAccessKey();
  useEffect(() => {
    if (appTypes && appTypes.length > 0) {
      setSelectedAppType(appTypes[0]._id);
    }
  }, [appTypes]);
  const handleCreateAccess = () => {
    if (selectedAppType) {
      createMutation.mutate({
        app_id: selectedAppType,
      });
    }
  };

  const handleCopyToken = () => {
    if (sdkAccessKeyGen?.data?.key?.key) {
      navigator.clipboard
        .writeText(sdkAccessKeyGen.data.key.key)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };
  const handleGenerateToken = () => {
    if (selectedAppType) {
      updateMutation.mutate(sdkAccessKeyGen?.data?.key?._id);
    }
  };
  return (
    <div className="p-8 space-y-8">
      

      {appTypes && appTypes.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">App Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appTypes.map((appType) => (
              <div
                key={appType._id}
                className={`bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center space-x-4 cursor-pointer 
                ${
                  selectedAppType === appType._id
                    ? "ring-2 ring-green-500 bg-green-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedAppType(appType?._id)}
              >
                {appType.icon && (
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={appType.icon}
                      alt={appType.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    {appType.name}
                  </p>
                  {appType.description && (
                    <p className="text-xs text-gray-600">
                      {appType.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        {selectedAppType && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <KeyIcon className="w-6 h-6 text-green-600" />
                <h2 className="text-lg font-medium text-gray-900">
                  SDK Access Key
                </h2>
              </div>

              {!sdkAccessKeyGen?.data?.key && (
                <button
                  onClick={handleCreateAccess}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Create Access Key
                </button>
              )}
            </div>

            {sdkAccessKeyGen?.data?.key ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Key Details
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {sdkAccessKeyGen.data.key.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Environment</p>
                        <p className="text-sm font-medium">
                          {sdkAccessKeyGen.data.key.environment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Usage Statistics
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Total Requests</p>
                        <p className="text-sm font-medium">
                          {sdkAccessKeyGen.data.key.usage_stats.total_requests}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          Last 24h Requests
                        </p>
                        <p className="text-sm font-medium">
                          {
                            sdkAccessKeyGen.data.key.usage_stats
                              .last_24h_requests
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    Access Token
                  </h3>
                  <div className="mt-2 bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                    <code className="text-sm break-all">
                      {sdkAccessKeyGen.data.key.key}
                    </code>
                    <button
                      className="ml-2 text-sm text-green-600 hover:text-green-700 focus:outline-none"
                      onClick={handleCopyToken}
                    >
                      {copySuccess ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
                {sdkAccessKeyGen?.data?.key?.permissions && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Permissions
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(
                        sdkAccessKeyGen?.data?.key?.permissions
                      )?.map(
                        ([permission, isEnabled]) =>
                          isEnabled && (
                            <div
                              key={permission}
                              className="bg-gray-50 p-2 rounded-lg text-center"
                            >
                              <span className="text-xs font-medium text-gray-800">
                                {permission.replace("_", " ")}
                              </span>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Quick Start Guide
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-medium text-gray-700">
                        1. Install the SDK
                      </h4>
                      <pre className="mt-1 bg-gray-50 p-2 rounded-lg text-xs">
                        npm install @khedmah/loyalty-sdk
                      </pre>
                    </div>

                    <div>
                      <h4 className="text-xs font-medium text-gray-700">
                        2. Initialize the SDK
                      </h4>
                      <pre className="mt-1 bg-gray-50 p-2 rounded-lg text-xs">
                        {`import { KhedmahSDK } from '@khedmah/loyalty-sdk';

const sdk = new KhedmahSDK({
  token: '${sdkAccessKeyGen.data.key.key}',
  environment: '${sdkAccessKeyGen.data.key.environment}'
});`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="text-xs font-medium text-gray-700">
                        3. Make API Calls
                      </h4>
                      <pre className="mt-1 bg-gray-50 p-2 rounded-lg text-xs">
                        {`// Example: Get user points
const points = await sdk.points.getBalance(userId);

// Example: Record a transaction
await sdk.points.record({
  userId,
  amount: 100,
  type: 'purchase'
});`}
                      </pre>
                    </div>
                    <button
                      onClick={handleGenerateToken}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      Generate Token
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No access key generated for this app type yet.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Create an access key to integrate with your application.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SdkAccess;
