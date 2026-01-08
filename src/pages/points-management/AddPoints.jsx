import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  CloudArrowUpIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import StyledButton from "../../ui/StyledButton";
import Loader from "../../ui/Loader";
import useUiStore from "../../store/ui";
import { useCustomers } from "../../hooks/useCustomers";
import { usePointsCriteria } from "../../hooks/usePointsCriteria";
import { useManualPoints } from "../../hooks/useManualPoints";
import { useAppTypes } from "../../hooks/useAppTypes";
import { useTiers } from "../../hooks/useTiers";
import SearchableSelect from "../../ui/SearchableSelect";
import useDebouncedValue from "../../hooks/useDebouncedValue";

const tabs = [
  { id: "individual", label: "Individual" },
  { id: "bulk", label: "Bulk Upload" },
];

const initialIndividualState = {
  customerId: "",
  pointCriteria: "",
  requestedBy: "",
  note: "",
};

const requiredColumns = ["customer_id", "point_criteria", "note"];

const AddPoints = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("individual");
  const [individualForm, setIndividualForm] = useState(initialIndividualState);
  const [customerSearchInput, setCustomerSearchInput] = useState("");
  const [pointCriteriaSearchInput, setPointCriteriaSearchInput] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkPreview, setBulkPreview] = useState([]);
  const [bulkRequestedBy, setBulkRequestedBy] = useState("");
  const [bulkError, setBulkError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const fileInputRef = useRef(null);

  const customerSearch = useDebouncedValue(customerSearchInput, 400);
  const pointCriteriaSearch = useDebouncedValue(pointCriteriaSearchInput, 400);

  const { addToast } = useUiStore();

  const { useGetCustomers } = useCustomers();
  const { data: customersData, isLoading: isLoadingCustomers } =
    useGetCustomers({
      page: 1,
      limit: 50,
      name: customerSearch || undefined,
      tier_id: tierFilter || undefined,
    });

  const { useGetPointsCriteria } = usePointsCriteria();
  const { data: pointsCriteriaData, isLoading: isLoadingCriteria } =
    useGetPointsCriteria({
      page: 1,
      limit: 100,
      search: pointCriteriaSearch || undefined,
    });

  const { useGetAppTypes } = useAppTypes();
  const { data: appTypesData, isLoading: isLoadingAppTypes } = useGetAppTypes();

  const { useGetTiers } = useTiers();
  const { data: tiersData } = useGetTiers();

  const {
    useAddPointsIndividual,
    useAddPointsBulk,
    useDownloadSampleTemplate,
  } = useManualPoints();

  const addPointsIndividual = useAddPointsIndividual();
  const addPointsBulk = useAddPointsBulk();
  const downloadTemplate = useDownloadSampleTemplate();

  const customers = useMemo(
    () => customersData?.data?.customers || [],
    [customersData]
  );

  const pointsCriteria = useMemo(() => {
    const list = pointsCriteriaData?.data || [];
    return list.filter((criteria) => {
      const eventName =
        criteria?.eventType?.name?.en || criteria?.eventType?.name || "";
      return eventName.toString().toUpperCase() === "PROMOTION";
    });
  }, [pointsCriteriaData]);

  const appTypes = useMemo(() => appTypesData?.data || [], [appTypesData]);

  const customerOptions = useMemo(
    () =>
      customers.map((customer) => ({
        id: customer._id,
        label: customer.customer_id,
        subLabel: customer.name || "-",
        tier: customer.tier,
      })),
    [customers]
  );

  const criteriaOptions = useMemo(
    () =>
      pointsCriteria.map((criteria) => ({
        id: criteria._id,
        label: criteria.unique_code,
        subLabel: [
          criteria?.eventType?.name?.en,
          criteria?.serviceType?.title?.en,
        ]
          .filter(Boolean)
          .join(" • "),
      })),
    [pointsCriteria]
  );

  const appTypeOptions = useMemo(
    () =>
      appTypes.map((appType) => ({
        id: appType._id,
        value: appType.name,
        label: appType.name,
      })),
    [appTypes]
  );

  const tierOptions = useMemo(() => {
    const tiers = tiersData?.data || [];
    return tiers
      .slice()
      .sort((a, b) => b.hierarchy_level - a.hierarchy_level)
      .map((tier) => ({
        id: tier._id,
        label: tier.name?.en || tier.name,
        hierarchy_level: tier.hierarchy_level,
      }));
  }, [tiersData]);

  useEffect(() => {
    if (activeTab === "individual") {
      setBulkFile(null);
      setBulkPreview([]);
      setBulkError("");
    }
  }, [activeTab]);

  const handleIndividualChange = (field, value) => {
    setIndividualForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetIndividualForm = () => {
    setIndividualForm(initialIndividualState);
    setCustomerSearchInput("");
    setPointCriteriaSearchInput("");
    setTierFilter("");
  };

  const handleIndividualSubmit = (event) => {
    event.preventDefault();

    if (
      !individualForm.customerId ||
      !individualForm.pointCriteria ||
      !individualForm.requestedBy ||
      !individualForm.note
    ) {
      addToast({
        type: "error",
        message: "All fields are required for individual point addition.",
      });
      return;
    }

    const payload = {
      customer_id: individualForm.customerId,
      point_criteria: individualForm.pointCriteria,
      requested_by: individualForm.requestedBy,
      note: individualForm.note,
    };

    addPointsIndividual.mutate(payload, {
      onSuccess: (response) => {
        addToast({
          type: "success",
          message: response?.message || "Points added successfully.",
        });
        resetIndividualForm();
      },
      onError: (error) => {
        addToast({
          type: "error",
          message:
            error?.response?.data?.message ||
            "Failed to add points. Please try again.",
        });
      },
    });
  };

  const handleDownloadTemplate = () => {
    downloadTemplate.mutate(undefined, {
      onError: () => {
        addToast({
          type: "error",
          message: "Failed to download template. Please try again.",
        });
      },
    });
  };

  const parseBulkFile = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsed = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (!parsed.length) {
          setBulkError("No data found in the uploaded file.");
          setBulkPreview([]);
          return;
        }

        const missingColumns = requiredColumns.filter(
          (column) => !Object.keys(parsed[0]).includes(column)
        );

        if (missingColumns.length) {
          setBulkError(
            `Missing required columns: ${missingColumns.join(", ")}.`
          );
          setBulkPreview([]);
          return;
        }

        setBulkError("");
        setBulkPreview(parsed);
      } catch {
        setBulkError("Unable to parse file. Ensure it is a valid Excel sheet.");
        setBulkPreview([]);
      }
    };

    reader.onerror = () => {
      setBulkError("Error reading file. Please try again.");
      setBulkPreview([]);
    };

    reader.readAsBinaryString(file);
  };

  const handleBulkFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setBulkFile(file);
    parseBulkFile(file);
  };

  const handleBulkSubmit = (event) => {
    event.preventDefault();

    if (!bulkFile) {
      setBulkError("Please upload a CSV/Excel file before submitting.");
      return;
    }

    if (!bulkRequestedBy) {
      setBulkError("Requested by field is required for bulk upload.");
      return;
    }

    if (bulkError) {
      addToast({
        type: "error",
        message: "Please resolve the errors in the upload before submitting.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", bulkFile);
    formData.append("requested_by", bulkRequestedBy);

    addPointsBulk.mutate(formData, {
      onSuccess: (response) => {
        addToast({
          type: "success",
          message: response?.message || "Bulk points uploaded successfully.",
        });
        setSuccessData({
          message: response?.message || "Bulk points uploaded successfully.",
          recordsProcessed: bulkPreview.length,
        });
        setShowSuccessModal(true);
        setBulkFile(null);
        setBulkPreview([]);
        setBulkRequestedBy("");
        setBulkError("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      onError: (error) => {
        setBulkError(
          error?.response?.data?.message ||
            "Failed to process bulk upload. Please review the file."
        );
      },
    });
  };

  const renderIndividualForm = () => (
    <form onSubmit={handleIndividualSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Current Tier (optional)
          </label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            value={tierFilter}
            onChange={(event) => setTierFilter(event.target.value)}
          >
            <option value="">All Tiers</option>
            {tierOptions.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Filter customers by their current tier before searching
          </p>
        </div>
        <SearchableSelect
          label="Customer"
          placeholder="Search customer ID"
          items={customerOptions}
          selectedId={individualForm.customerId}
          onSelect={(id) => handleIndividualChange("customerId", id)}
          onSearch={setCustomerSearchInput}
          loading={isLoadingCustomers && !customers.length}
          helperText="Search by customer ID and select from the list."
          required
        />

        <SearchableSelect
          label="Points Criteria"
          placeholder="Search criteria"
          items={criteriaOptions}
          selectedId={individualForm.pointCriteria}
          onSelect={(id) => handleIndividualChange("pointCriteria", id)}
          onSearch={setPointCriteriaSearchInput}
          loading={isLoadingCriteria && !pointsCriteria.length}
          helperText="Search by criteria code or description."
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Requested By (App Type)
          </label>
          <select
            className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={individualForm.requestedBy}
            onChange={(event) =>
              handleIndividualChange("requestedBy", event.target.value)
            }
            required
          >
            <option value="">Select app type</option>
            {appTypeOptions.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Note</label>
        <textarea
          rows={4}
          className="mt-2 w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={individualForm.note}
          onChange={(event) =>
            handleIndividualChange("note", event.target.value)
          }
          placeholder="Provide context for manual adjustment"
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <StyledButton
          type="button"
          variant="secondary"
          onClick={resetIndividualForm}
          disabled={addPointsIndividual.isLoading}
          name="Reset"
        />
        <StyledButton
          type="submit"
          isLoading={addPointsIndividual.isLoading}
          name="Add Points"
        />
      </div>
    </form>
  );

  // Processing Modal Component
  const ProcessingModal = () => {
    if (!addPointsBulk.isLoading) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <ArrowPathIcon className="h-16 w-16 text-green-600 animate-spin" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Processing Bulk Upload
              </h3>
              <p className="text-sm text-gray-600">
                Please wait while we process your file...
              </p>
              <p className="text-xs text-gray-500 mt-2">
                This may take a few moments depending on the file size.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Success Modal Component
  const SuccessModal = () => {
    const handleClose = () => {
      setShowSuccessModal(false);
      setSuccessData(null);
    };

    const handleViewTransactions = () => {
      handleClose();
      navigate("/transactions");
    };

    // Auto-dismiss after 5 seconds
    useEffect(() => {
      if (!showSuccessModal || !successData) return;
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }, []);

    if (!showSuccessModal || !successData) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <div className="flex justify-end mb-2">
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <CheckCircleIcon className="h-16 w-16 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Successful!
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                {successData.message}
              </p>
              {successData.recordsProcessed && (
                <p className="text-xs text-gray-500">
                  {successData.recordsProcessed} record(s) processed
                </p>
              )}
            </div>
            <div className="flex gap-3 w-full mt-6">
              <StyledButton
                type="button"
                variant="secondary"
                onClick={handleClose}
                name="Close"
                className="flex-1"
              />
              <StyledButton
                type="button"
                onClick={handleViewTransactions}
                name="View Transactions"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBulkUpload = () => (
    <form onSubmit={handleBulkSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Requested By (App Type)
        </label>
        <select
          className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={bulkRequestedBy}
          onChange={(event) => setBulkRequestedBy(event.target.value)}
          required
        >
          <option value="">Select app type</option>
          {appTypeOptions.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <CloudArrowUpIcon className="h-12 w-12 text-green-500" />
          <div>
            <p className="text-sm font-medium text-gray-700">
              Upload CSV or Excel file
            </p>
            <p className="text-xs text-gray-500 mt-1">
              The file should include columns: customer_id, point_criteria, note
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100">
              Choose File
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={handleBulkFileChange}
              />
            </label>
            <StyledButton
              type="button"
              variant="download"
              onClick={handleDownloadTemplate}
              isLoading={downloadTemplate.isLoading}
              name={
                <>
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  Sample Template
                </>
              }
            />
          </div>
          {bulkFile && (
            <p className="text-xs text-gray-600">
              Selected file:{" "}
              <span className="font-medium">{bulkFile.name}</span>
            </p>
          )}
          {bulkError && <p className="text-sm text-red-600">{bulkError}</p>}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">
            Preview ({bulkPreview.length})
          </h3>
          {bulkPreview.length > 0 && (
            <p className="text-xs text-gray-500">
              Review the first {Math.min(bulkPreview.length, 20)} records before
              submitting.
            </p>
          )}
        </div>
        <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-lg">
          {bulkPreview.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No data preview available. Upload a file to review the contents.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-100">
                <tr>
                  {requiredColumns.map((column) => (
                    <th
                      key={column}
                      className="px-3 py-2 text-left font-medium uppercase tracking-wider text-gray-600"
                    >
                      {column.replaceAll("_", " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {bulkPreview.slice(0, 20).map((row, index) => (
                  <tr key={`${row.customer_id}-${index}`}>
                    {requiredColumns.map((column) => (
                      <td key={column} className="px-3 py-2 text-gray-700">
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <StyledButton
          type="button"
          variant="secondary"
          onClick={() => {
            setBulkFile(null);
            setBulkPreview([]);
            setBulkRequestedBy("");
            setBulkError("");
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          disabled={addPointsBulk.isLoading}
          name="Clear"
        />
        <StyledButton
          type="submit"
          isLoading={addPointsBulk.isLoading}
          name="Upload Points"
        />
      </div>
    </form>
  );

  // Only show full-page loader on initial load (when no data has been fetched yet)
  if (
    (isLoadingCustomers && !customersData) ||
    (isLoadingCriteria && !pointsCriteriaData) ||
    (isLoadingAppTypes && !appTypesData)
  ) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add Points</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manually credit loyalty points to customers individually or in bulk.
          </p>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500 hover:text-green-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        {activeTab === "individual"
          ? renderIndividualForm()
          : renderBulkUpload()}
      </div>

      {/* Processing Modal */}
      <ProcessingModal />

      {/* Success Modal */}
      <SuccessModal />
    </div>
  );
};

export default AddPoints;
