import { useEffect, useMemo, useState } from "react";
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import StyledTable from "../../ui/StyledTable";
import StyledButton from "../../ui/StyledButton";
import StyledSearchInput from "../../ui/StyledSearchInput";
import DeleteModal from "../../ui/DeleteModal";
import Loader from "../../ui/Loader";
import RefreshButton from "../../ui/RefreshButton";
import SearchableSelect from "../../ui/SearchableSelect";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import { usePriorityCustomers } from "../../hooks/usePriorityCustomers";
import { useCustomers } from "../../hooks/useCustomers";
import { useTiers } from "../../hooks/useTiers";
import useUiStore from "../../store/ui";

const StatusBadge = ({ isActive }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isActive
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

const PriorityCustomerForm = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
  tierOptions,
}) => {
  const isEditMode = Boolean(initialData?._id);
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    initialData?.customer?._id || ""
  );
  const [selectedTierId, setSelectedTierId] = useState(
    initialData?.tier?._id || ""
  );
  const [reason, setReason] = useState(initialData?.reason || "");
  const [customerSearchInput, setCustomerSearchInput] = useState("");
  const customerSearch = useDebouncedValue(customerSearchInput, 400);
  const [isActive, setIsActive] = useState(
    initialData?.is_active ?? true
  );

  const { useGetCustomers, useGetCustomerById } = useCustomers();
  const { data: customersData, isLoading: isLoadingCustomers } =
    useGetCustomers({
      page: 1,
      limit: 50,
      name: customerSearch || undefined,
    });

  const { data: selectedCustomerData } = useGetCustomerById(
    selectedCustomerId
  );

  const customerOptions = useMemo(() => {
    const apiCustomers = customersData?.data?.customers || [];
    const options = apiCustomers.map((customer) => ({
      id: customer._id,
      label: customer.customer_id,
      subLabel: customer.name || "-",
      tier: customer.tier,
    }));

    if (
      isEditMode &&
      initialData?.customer?._id &&
      !options.find((option) => option.id === initialData.customer._id)
    ) {
      options.unshift({
        id: initialData.customer._id,
        label: initialData.customer.customer_id,
        subLabel: initialData.customer.name || "-",
        tier: initialData.customer.tier,
      });
    }

    return options;
  }, [customersData, initialData, isEditMode]);

  const selectedCustomer =
    customerOptions.find((item) => item.id === selectedCustomerId) ||
    (isEditMode
      ? {
          tier: initialData?.customer?.tier,
        }
      : null);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedCustomerId(initialData?.customer?._id || "");
    setSelectedTierId(initialData?.tier?._id || "");
    setReason(initialData?.reason || "");
    setIsActive(initialData?.is_active ?? true);
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const tiers = tierOptions || [];
  const selectedTier = tiers.find((tier) => tier.id === selectedTierId);
  const currentTier = selectedCustomer?.tier || selectedCustomerData?.data?.tier;

  const isMinimumTierValid =
    !selectedTier ||
    !currentTier ||
    selectedTier.hierarchy_level <= (currentTier?.hierarchy_level ?? 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedCustomerId || !selectedTierId || !isMinimumTierValid) return;

    const payload = {
      customer_id: selectedCustomerId,
      tier_id: selectedTierId,
      reason: reason.trim(),
      is_active: isActive,
    };

    onSubmit(payload, isEditMode, initialData?._id);
  };

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditMode ? "Edit Priority Customer" : "Add Priority Customer"}
            </h2>
            <p className="text-sm text-gray-500">
              Protect key customers from downgrading below a minimum tier.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              {isEditMode ? (
                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Customer
                  </span>
                  <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
                    <div className="font-semibold">
                      {initialData?.customer?.name || "-"}
                    </div>
                    <div className="text-gray-500">
                      {initialData?.customer?.customer_id}
                    </div>
                  </div>
                </div>
              ) : (
                <SearchableSelect
                  label="Customer"
                  required
                  placeholder="Search by customer ID or name"
                  items={customerOptions}
                  selectedId={selectedCustomerId}
                  onSelect={(id) => setSelectedCustomerId(id)}
                  onSearch={setCustomerSearchInput}
                  loading={isLoadingCustomers}
                  helperText="Start typing to search for a customer"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Tier
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <select
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                value={selectedTierId}
                onChange={(event) => setSelectedTierId(event.target.value)}
              >
                <option value="">Select tier</option>
                {tiers.map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.label}
                  </option>
                ))}
              </select>
              {!isMinimumTierValid && (
                <p className="mt-1 text-xs text-red-500">
                  Minimum tier cannot be higher than the customer&apos;s current
                  tier.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reason (optional)
              </label>
              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={3}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Add context about why this customer should remain at the minimum tier"
              />
            </div>

            {isEditMode && (
              <div className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Priority Status
                  </p>
                  <p className="text-xs text-gray-500">
                    Toggle to disable priority protection without deleting the
                    record.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                      isActive ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            )}
          </div>

          <div className="rounded-md border border-gray-100 bg-gray-50 px-4 py-3">
            <h4 className="text-sm font-medium text-gray-700">
              Current Tier Snapshot
            </h4>
            <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div>
                <p className="text-gray-500">Current Tier</p>
                <p className="font-medium text-gray-800">
                  {currentTier?.name?.en || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Tier Hierarchy</p>
                <p className="font-medium text-gray-800">
                  {currentTier?.hierarchy_level ?? "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 border-t border-gray-100 pt-4">
            <StyledButton
              onClick={onClose}
              name="Cancel"
              variant="secondary"
              type="button"
            />
            <StyledButton
              type="submit"
              name={isEditMode ? "Save Changes" : "Add Priority"}
              disabled={
                isSubmitting ||
                !selectedCustomerId ||
                !selectedTierId ||
                !isMinimumTierValid
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
};

const PriorityCustomers = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    tierId: "",
    status: "all",
  });
  const [searchInput, setSearchInput] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPriority, setEditingPriority] = useState(null);
  const [deletingPriority, setDeletingPriority] = useState(null);

  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const queryParams = useMemo(
    () => ({
      page: filters.page,
      limit: filters.limit,
      search: debouncedSearch || undefined,
      tier_id: filters.tierId || undefined,
      is_active:
        filters.status === "all"
          ? undefined
          : filters.status === "active"
          ? true
          : false,
    }),
    [filters, debouncedSearch]
  );

  const {
    useGetPriorityCustomers,
    useCreatePriorityCustomer,
    useUpdatePriorityCustomer,
    useDeletePriorityCustomer,
  } = usePriorityCustomers();
  const { useGetTiers } = useTiers();
  const { addToast } = useUiStore();

  const {
    data: priorityData,
    isLoading,
    refetch,
    isFetching,
  } = useGetPriorityCustomers(queryParams);

  const { data: tiersData } = useGetTiers();

  const createMutation = useCreatePriorityCustomer();
  const updateMutation = useUpdatePriorityCustomer();
  const deleteMutation = useDeletePriorityCustomer();

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

  const priorityCustomers =
    priorityData?.data?.customers?.map((item) => ({
      ...item,
      customer: item.customer || {},
      tier: item.tier || {},
      added_by: item.added_by || {},
    })) || [];

  const pagination = priorityData?.data?.pagination || {
    page: filters.page,
    limit: filters.limit,
    total: 0,
    totalPages: 0,
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleTierFilterChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      tierId: event.target.value,
      page: 1,
    }));
  };

  const handleStatusFilterChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      status: event.target.value,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleOpenCreate = () => {
    setEditingPriority(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (priority) => {
    setEditingPriority(priority);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPriority(null);
  };

  const handleSubmit = (payload, isEditMode, id) => {
    if (isEditMode && id) {
      updateMutation.mutate(
        { id, payload },
        {
          onSuccess: (response) => {
            addToast({
              type: "success",
              message: response?.message || "Priority customer updated",
            });
            handleCloseForm();
          },
          onError: (error) => {
            addToast({
              type: "error",
              message: error?.response?.data?.message,
            });
          },
        }
      );
    } else {
      const { customer_id, tier_id, reason } = payload;
      createMutation.mutate(
        {
          customer_id,
          tier_id,
          reason,
        },
        {
          onSuccess: (response) => {
            addToast({
              type: "success",
              message: response?.message || "Priority customer added",
            });
            handleCloseForm();
          },
          onError: (error) => {
            addToast({
              type: "error",
              message: error?.response?.data?.message,
            });
          },
        }
      );
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingPriority) return;
    deleteMutation.mutate(deletingPriority._id, {
      onSuccess: (response) => {
        addToast({
          type: "success",
          message: response?.message || "Priority customer removed",
        });
        setDeletingPriority(null);
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      },
    });
  };

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Priority Customers
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customers who should never be downgraded below their minimum
            tier.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RefreshButton onClick={refetch} isLoading={isFetching} />
          <StyledButton
            name={
              <>
                <PlusIcon className="h-4 w-4" />
                Add Priority Customer
              </>
            }
            onClick={handleOpenCreate}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <StyledSearchInput
            placeholder="Search customers..."
            onChange={handleSearchChange}
          />
          <select
            className="w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
            value={filters.tierId}
            onChange={handleTierFilterChange}
          >
            <option value="">All Minimum Tiers</option>
            {tierOptions.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.label}
              </option>
            ))}
          </select>
          <select
            className="w-40 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
            value={filters.status}
            onChange={handleStatusFilterChange}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
        <div className="text-sm text-gray-500">
          {pagination.total
            ? `${pagination.total} priority customers`
            : "No records"}
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <StyledTable
          paginationProps={{
            currentPage: pagination.page,
            totalCount: pagination.total,
            itemsPerPage: pagination.limit,
            setCurrentPage: handlePageChange,
            setItemsPerPage: handleLimitChange,
          }}
        >
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Current Tier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Minimum Tier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Added By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Added On
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {priorityCustomers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-sm text-gray-500"
                >
                  No priority customers found. Use the button above to add one.
                </td>
              </tr>
            ) : (
              priorityCustomers.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/80">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {item.customer?.name || "-"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.customer?.customer_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.customer?.tier?.name?.en || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.tier?.name?.en || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge isActive={item.is_active} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.added_by?.name || "-"}
                    <div className="text-xs text-gray-400">
                      {item.added_by?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm hover:border-gray-300 hover:text-gray-800"
                      >
                        <PencilIcon className="mr-1 h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingPriority(item)}
                        className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:border-red-300 hover:text-red-700"
                      >
                        <TrashIcon className="mr-1 h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </StyledTable>
      )}

      <PriorityCustomerForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        initialData={editingPriority}
        tierOptions={tierOptions}
      />

      <DeleteModal
        isOpen={Boolean(deletingPriority)}
        onClose={() => setDeletingPriority(null)}
        onConfirm={handleConfirmDelete}
        data="priority customer"
      />
    </div>
  );
};

export default PriorityCustomers;

