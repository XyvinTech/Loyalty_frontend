import {
  ArrowDownTrayIcon,
  PencilIcon,
  EyeIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import StyledButton from "../../ui/StyledButton";
import StyledSearchInput from "../../ui/StyledSearchInput";
import { useMemo, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import AddCustomer from "../../components/customer-management/AddCustomer.jsx";
import DeleteModal from "../../ui/DeleteModal";
import RefreshButton from "../../ui/RefreshButton.jsx";
import Loader from "../../ui/Loader.jsx";
import { useCustomers } from "../../hooks/useCustomers.js";
import { useTiers } from "../../hooks/useTiers";
import useUiStore from "../../store/ui.js";

// Filter Modal Component
const FilterModal = ({ filters, onClose, onApply, tierOptions = [] }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 mt-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            Filter Customers
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            {/* Filters Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Filters
              </h3>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={localFilters.status || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      status: e.target.value || undefined,
                    })
                  }
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tier
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={localFilters.tier_id || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      tier_id: e.target.value || undefined,
                    })
                  }
                >
                  <option value="">All Tiers</option>
                  {tierOptions.map((tier) => (
                    <option key={tier.id} value={tier.id}>
                      {tier.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Range Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Date Range
              </h3>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  From
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={localFilters.start_date || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      start_date: e.target.value || undefined,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  To
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={localFilters.end_date || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      end_date: e.target.value || undefined,
                    })
                  }
                />
              </div>
            </div>

            {/* Point Range Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Point Range
              </h3>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Minimum
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={localFilters.min_points || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      min_points: e.target.value || undefined,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Maximum
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={localFilters.max_points || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      max_points: e.target.value || undefined,
                    })
                  }
                />
              </div>
            </div>

            {/* Sorting Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Sorting
              </h3>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={localFilters.sort_by || "createdAt"}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      sort_by: e.target.value,
                    })
                  }
                >
                  <option value="createdAt">Registration Date</option>
                  <option value="total_points">Points</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Order
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={localFilters.sort_order || "desc"}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      sort_order: e.target.value,
                    })
                  }
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-t flex justify-end space-x-2 sticky bottom-0 bg-white z-10">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <StyledButton name={"Apply"} onClick={handleApply} />
        </div>
      </div>
    </div>
  );
};

// Customer Detail Modal Component
const CustomerDetailModal = ({ customer, onClose, isLoading }) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 
                  min-h-[60vh] max-h-[70vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Customer Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Basic Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Customer ID:</span>
                    <span className="text-sm font-mono">
                      {customer?.data?.customer_id}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        customer?.data?.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customer?.data?.status ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Loyalty Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Loyalty Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Points:</span>
                    <span className="text-sm font-semibold text-indigo-600">
                      {customer?.data?.total_points}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tier:</span>
                    <span className="text-sm">
                      {customer?.data?.tier?.name?.en}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Coins:</span>
                    <span className="text-sm">{customer?.data?.coins}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Referral Code:
                    </span>
                    <span className="text-sm font-mono">
                      {customer?.data?.referral_code}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Customer = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    name: "",
    status: undefined,
    tier_id: undefined,
    start_date: undefined,
    end_date: undefined,
    min_points: undefined,
    max_points: undefined,
    sort_by: "createdAt",
    sort_order: "desc",
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null); // Changed from selectedCustomer
  const [editCustomerId, setEditCustomerId] = useState(null); // Separate state for editing
  const [deleteCustomerId, setDeleteCustomerId] = useState(null); // Separate state for deleting

  const {
    useGetCustomers,
    useDeleteCustomer,
    useGetCustomerById,
    useExportCustomers,
  } = useCustomers();

  const { useGetTiers } = useTiers();
  const { data: tiersData } = useGetTiers();

  // Fetch customer data for editing
  const { data: editCustomerData } = useGetCustomerById(editCustomerId);

  // Fetch customer data for viewing details
  const { data: selectedCustomerData, isLoading: isLoadingSelectedCustomer } =
    useGetCustomerById(selectedCustomerId);

  const {
    data: customers,
    isLoading,
    refetch,
    dataUpdatedAt,
  } = useGetCustomers(filters);

  const deleteMutation = useDeleteCustomer();
  const exportMutation = useExportCustomers();
  const { addToast } = useUiStore();

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

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, name: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleEdit = (id) => {
    setEditCustomerId(id);
    setAddOpen(true);
  };

  const handleDeleteOpen = async (id) => {
    setDeleteCustomerId(id);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    deleteMutation.mutate(deleteCustomerId, {
      onSuccess: (response) => {
        addToast({
          type: "success",
          message: response?.message,
        });
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      },
    });
    setDeleteOpen(false);
    setDeleteCustomerId(null);
  };

  const handleSelectAll = () => {
    const allRowIds =
      customers?.data?.customers?.map((item) => item?._id) || [];
    if (selectedRows.length === allRowIds?.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allRowIds);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedRows.length) return;
    await Promise.all(
      selectedRows.map((id) =>
        deleteMutation.mutateAsync(id, {
          onSuccess: () => {
            addToast({
              type: "success",
              message: `Item deleted successfully!`,
            });
          },
          onError: (error) => {
            addToast({
              type: "error",
              message: error?.response?.data?.message,
            });
          },
        })
      )
    );
    setSelectedRows([]);
  };

  const handleViewCustomer = (customerId) => {
    setSelectedCustomerId(customerId);
  };

  const handleCloseCustomerDetail = () => {
    setSelectedCustomerId(null);
  };

  const handleCloseAddCustomer = () => {
    setAddOpen(false);
    setEditCustomerId(null);
  };

  const handleDownload = async () => {
    try {
      // Prepare filters for export (remove pagination)
      const exportFilters = { ...filters };
      delete exportFilters.page;
      delete exportFilters.limit;

      const blob = await exportMutation.mutateAsync(exportFilters);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `customers_export_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      addToast({
        type: "success",
        message: "Customers exported successfully!",
      });
    } catch (error) {
      addToast({
        type: "error",
        message: error?.response?.data?.message || "Failed to export customers",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Customers
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Last Updated: {new Date(dataUpdatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
          <RefreshButton onClick={() => refetch()} isLoading={isLoading} />
          <StyledSearchInput
            placeholder="Search customers..."
            value={filters.name}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:w-auto"
          />
          <StyledButton
            name={
              <>
                <FunnelIcon className="h-5 w-5" />
                Filter
              </>
            }
            onClick={() => setShowFilterModal(true)}
            variant="secondary"
          />
          <StyledButton
            name={
              <>
                <ArrowDownTrayIcon className="h-5 w-5" />
                Download
              </>
            }
            onClick={handleDownload}
            variant="secondary"
            disabled={exportMutation.isPending}
          />

          {/* <StyledButton
            name={
              <>
                <span className="text-lg leading-none">+</span> Add Customer
              </>
            }
            onClick={() => setAddOpen(true)}
          /> */}
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.status ||
        filters.tier_id ||
        filters.start_date ||
        filters.end_date ||
        filters.min_points ||
        filters.max_points) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.status && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Status: {filters.status === "true" ? "Active" : "Inactive"}
              <XMarkIcon
                className="ml-2 h-4 w-4 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, status: undefined }))
                }
              />
            </span>
          )}
          {filters.tier_id && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Tier:{" "}
              {tierOptions.find((t) => t.id === filters.tier_id)?.label ||
                "Selected"}
              <XMarkIcon
                className="ml-2 h-4 w-4 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, tier_id: undefined }))
                }
              />
            </span>
          )}
          {filters.start_date && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              From: {new Date(filters.start_date).toLocaleDateString()}
              <XMarkIcon
                className="ml-2 h-4 w-4 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, start_date: undefined }))
                }
              />
            </span>
          )}
          {filters.end_date && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              To: {new Date(filters.end_date).toLocaleDateString()}
              <XMarkIcon
                className="ml-2 h-4 w-4 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, end_date: undefined }))
                }
              />
            </span>
          )}
          {(filters.min_points || filters.max_points) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Points: {filters.min_points || 0} - {filters.max_points || "∞"}
              <XMarkIcon
                className="ml-2 h-4 w-4 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    min_points: undefined,
                    max_points: undefined,
                  }))
                }
              />
            </span>
          )}
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                status: undefined,
                tier_id: undefined,
                start_date: undefined,
                end_date: undefined,
                min_points: undefined,
                max_points: undefined,
                page: 1,
              }))
            }
            className="text-xs text-indigo-600 hover:text-indigo-900"
          >
            Clear all filters
          </button>
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <StyledTable
          paginationProps={{
            currentPage: filters.page,
            totalCount: customers?.data?.pagination?.total || 0,
            itemsPerPage: filters.limit,
            setCurrentPage: handlePageChange,
            setItemsPerPage: handleLimitChange,
            selectedRows,
            handleBulkDelete,
          }}
        >
          <thead className="bg-gray-50 w-full">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    customers?.data?.customers?.length > 0 &&
                    customers.data.customers.every((item) =>
                      selectedRows?.includes(item._id)
                    )
                  }
                  className="cursor-pointer w-4 h-4 align-middle"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered through
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tier
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers?.data?.customers?.length > 0 ? (
              customers.data.customers.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      onChange={() => handleRowSelect(item._id)}
                      checked={selectedRows.includes(item._id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.customer_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.app_type?.name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    {item.total_points?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.tier?.name?.en}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="text-slate-400 hover:text-indigo-700 p-1 rounded-lg hover:bg-indigo-50"
                        onClick={() => handleViewCustomer(item._id)}
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="text-slate-400 hover:text-green-700 p-1 rounded-lg hover:bg-green-50"
                        onClick={() => handleEdit(item._id)}
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      {/* <button
                        className="text-slate-400 hover:text-red-700 p-1 rounded-lg hover:bg-red-50"
                        onClick={() => handleDeleteOpen(item._id)}
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 text-center text-gray-500 text-sm"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </StyledTable>
      )}

      <AddCustomer
        isOpen={addOpen}
        onClose={handleCloseAddCustomer}
        editData={editCustomerData}
      />

      <DeleteModal
        data={"Customer"}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      {/* Customer Detail Modal */}
      {selectedCustomerId && (
        <CustomerDetailModal
          customer={selectedCustomerData}
          onClose={handleCloseCustomerDetail}
          isLoading={isLoadingSelectedCustomer}
        />
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal
          filters={filters}
          tierOptions={tierOptions}
          onClose={() => setShowFilterModal(false)}
          onApply={(newFilters) => {
            setFilters({ ...newFilters, page: 1 });
          }}
        />
      )}
    </>
  );
};

export default Customer;
