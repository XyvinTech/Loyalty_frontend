import { useMemo, useState } from "react";
import StyledButton from "../../ui/StyledButton";
import Loader from "../../ui/Loader";
import useUiStore from "../../store/ui";
import { useCustomers } from "../../hooks/useCustomers";
import { useManualPoints } from "../../hooks/useManualPoints";
import { useAppTypes } from "../../hooks/useAppTypes";
import SearchableSelect from "../../ui/SearchableSelect";
import useDebouncedValue from "../../hooks/useDebouncedValue";

const ReducePoints = () => {
  const [formState, setFormState] = useState({
    customerId: "",
    points: "",
    requestedBy: "",
    note: "",
  });
  const [customerSearchInput, setCustomerSearchInput] = useState("");

  const customerSearch = useDebouncedValue(customerSearchInput, 400);

  const { addToast } = useUiStore();
  const { useGetCustomers, useGetCustomerById } = useCustomers();
  const { useReducePoints } = useManualPoints();
  const { useGetAppTypes } = useAppTypes();

  const reducePoints = useReducePoints();

  const {
    data: customersData,
    isLoading: isLoadingCustomers,
  } = useGetCustomers({
    page: 1,
    limit: 50,
    name: customerSearch || undefined,
  });

  const { data: selectedCustomerData } = useGetCustomerById(
    formState.customerId
  );
  const { data: appTypesData, isLoading: isLoadingAppTypes } = useGetAppTypes();

  const customers = useMemo(
    () => customersData?.data?.customers || [],
    [customersData]
  );
  const appTypes = useMemo(() => appTypesData?.data || [], [appTypesData]);

  const customerOptions = useMemo(
    () =>
      customers.map((customer) => ({
        id: customer._id,
        label: customer.customer_id,
        subLabel: customer.name,
      })),
    [customers]
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

  const handleChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormState({
      customerId: "",
      points: "",
      requestedBy: "",
      note: "",
    });
    setCustomerSearchInput("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formState.customerId ||
      !formState.points ||
      !formState.requestedBy ||
      !formState.note
    ) {
      addToast({
        type: "error",
        message: "All fields are required to reduce points.",
      });
      return;
    }

    const confirmation = window.confirm(
      "Are you sure you want to reduce points for this customer? This action cannot be undone."
    );

    if (!confirmation) {
      return;
    }

    const payload = {
      customer_id: formState.customerId,
      points: Number(formState.points),
      requested_by: formState.requestedBy,
      note: formState.note,
    };

    reducePoints.mutate(payload, {
      onSuccess: (response) => {
        addToast({
          type: "success",
          message:
            response?.message || "Points reduced successfully for the customer.",
        });
        resetForm();
      },
      onError: (error) => {
        addToast({
          type: "error",
          message:
            error?.response?.data?.message ||
            "Failed to reduce points. Please review the details and try again.",
        });
      },
    });
  };

  if (
    (isLoadingCustomers && !customers.length) ||
    (isLoadingAppTypes && !appTypes.length)
  ) {
    return <Loader />;
  }

  const customerDetails = selectedCustomerData?.data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reduce Points</h1>
        <p className="text-xs text-gray-500 mt-1">
          Manually debit loyalty points for a specific customer. This action uses
          redemption logic and cannot be reversed.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SearchableSelect
              label="Customer"
              placeholder="Search customer ID"
              items={customerOptions}
              selectedId={formState.customerId}
              onSelect={(id) => handleChange("customerId", id)}
              onSearch={setCustomerSearchInput}
              loading={isLoadingCustomers && !customers.length}
              helperText="Search by customer ID and choose the customer."
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Points to Reduce
              </label>
              <input
                type="number"
                min="1"
                className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formState.points}
                onChange={(event) => handleChange("points", event.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Requested By (App Type)
              </label>
              <select
                className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formState.requestedBy}
                onChange={(event) =>
                  handleChange("requestedBy", event.target.value)
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Note
              </label>
              <textarea
                rows={4}
                className="mt-2 w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formState.note}
                onChange={(event) => handleChange("note", event.target.value)}
                placeholder="Provide context, e.g. dispute resolution or manual correction"
                required
              />
            </div>
          </div>

          {customerDetails && (
            <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
              <p className="font-semibold">
                Current Balance: {customerDetails.total_points ?? 0} points
              </p>
              <p className="mt-1">
                Tier: {customerDetails.tier?.name?.en || "Not assigned"}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <StyledButton
              type="button"
              variant="secondary"
              onClick={resetForm}
              disabled={reducePoints.isLoading}
              name="Reset"
            />
            <StyledButton
              type="submit"
              isLoading={reducePoints.isLoading}
              name="Reduce Points"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReducePoints;

