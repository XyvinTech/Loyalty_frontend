import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import StyledButton from "../../ui/StyledButton";
import { useTierEligibility } from "../../hooks/useTierEligibility";
import { useTiers } from "../../hooks/useTiers";
import useUiStore from "../../store/ui";

const AddTierEligibility = ({ open, setOpen, data = null }) => {
  const [formData, setFormData] = useState({
    tier_id: "",
    net_earning_required: "",
    evaluation_period_days: "",
    consecutive_periods_required: "",
    is_active: true,
    settings: {
      require_consecutive: true,
      grace_periods_allowed: 0,
    },
  });

  const { addToast } = useUiStore();
  const { useGetTiers } = useTiers();
  const { data: tiers } = useGetTiers();

  const {
    useCreateTierEligibilityCriteria,
    useUpdateTierEligibilityCriteria,
    useGetTierEligibilityCriteriaById,
  } = useTierEligibility();

  const createMutation = useCreateTierEligibilityCriteria();
  const updateMutation = useUpdateTierEligibilityCriteria();
  const { data: editData } = useGetTierEligibilityCriteriaById(data?.id);

  const isEditing = !!data?.id;

  useEffect(() => {
    if (isEditing && editData?.data) {
      setFormData({
        tier_id: editData.data.tier_id._id || editData.data.tier_id,
        net_earning_required: editData.data.net_earning_required.toString(),
        evaluation_period_days: editData.data.evaluation_period_days.toString(),
        consecutive_periods_required:
          editData.data.consecutive_periods_required.toString(),
        is_active: editData.data.is_active,
        settings: {
          require_consecutive:
            editData.data.settings?.require_consecutive ?? true,
          grace_periods_allowed:
            editData.data.settings?.grace_periods_allowed || 0,
        },
      });
    } else if (!isEditing) {
      setFormData({
        tier_id: "",
        net_earning_required: "",
        evaluation_period_days: "",
        consecutive_periods_required: "",
        is_active: true,
        settings: {
          require_consecutive: true,
          grace_periods_allowed: 0,
        },
      });
    }
  }, [isEditing, editData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("settings.")) {
      const settingName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingName]:
            type === "checkbox"
              ? checked
              : type === "number"
              ? Number(value)
              : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.tier_id ||
      !formData.net_earning_required ||
      !formData.evaluation_period_days ||
      !formData.consecutive_periods_required
    ) {
      addToast({
        type: "error",
        message: "Please fill in all required fields",
      });
      return;
    }

    const submitData = {
      ...formData,
      net_earning_required: Number(formData.net_earning_required),
      evaluation_period_days: Number(formData.evaluation_period_days),
      consecutive_periods_required: Number(
        formData.consecutive_periods_required
      ),
    };

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: data.id,
          data: submitData,
        });
        addToast({
          type: "success",
          message: "Tier eligibility criteria updated successfully",
        });
      } else {
        await createMutation.mutateAsync(submitData);
        addToast({
          type: "success",
          message: "Tier eligibility criteria created successfully",
        });
      }
      setOpen(false);
    } catch (error) {
      addToast({
        type: "error",
        message: error.message || "Something went wrong",
      });
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 mt-10">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            {isEditing ? "Edit Tier Eligibility" : "Add Tier Eligibility"}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-4 space-y-4">
            <div>
              <label className={labelClass}>Tier *</label>
              <select
                name="tier_id"
                value={formData.tier_id}
                onChange={handleInputChange}
                className={inputClass}
                required
                disabled={isEditing}
              >
                <option value="">Select a tier</option>
                {tiers?.data?.map((tier) => (
                  <option key={tier._id} value={tier._id}>
                    {tier.name.en || tier.name} ({tier.points_required} points)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Net Earning Required (Points) *
              </label>
              <input
                type="number"
                name="net_earning_required"
                value={formData.net_earning_required}
                onChange={handleInputChange}
                className={inputClass}
                required
                min="0"
                placeholder="e.g., 100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum net points required per evaluation period
              </p>
            </div>

            <div>
              <label className={labelClass}>Evaluation Period (Days) *</label>
              <input
                type="number"
                name="evaluation_period_days"
                value={formData.evaluation_period_days}
                onChange={handleInputChange}
                className={inputClass}
                required
                min="1"
                placeholder="e.g., 30"
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of days in each evaluation period
              </p>
            </div>

            <div>
              <label className={labelClass}>
                Consecutive Periods Required *
              </label>
              <input
                type="number"
                name="consecutive_periods_required"
                value={formData.consecutive_periods_required}
                onChange={handleInputChange}
                className={inputClass}
                required
                min="1"
                placeholder="e.g., 3"
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of consecutive periods customer must meet criteria
              </p>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Advanced Settings
              </h4>

              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  name="settings.require_consecutive"
                  checked={formData.settings.require_consecutive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Require consecutive periods
                </label>
              </div>

              <div className="mb-3">
                <label className={labelClass}>Grace Periods Allowed</label>
                <input
                  type="number"
                  name="settings.grace_periods_allowed"
                  value={formData.settings.grace_periods_allowed}
                  onChange={handleInputChange}
                  className={inputClass}
                  min="0"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of periods that can be missed
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 p-4 border-t bg-gray-50">
            <StyledButton
              name="Cancel"
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={
                createMutation.isPending || updateMutation.isPending
              }
            />
            <StyledButton
              name={isEditing ? "Update" : "Create"}
              type="submit"
              isLoading={
                createMutation.isPending || updateMutation.isPending
              }
              loadingLabel={isEditing ? "Saving…" : "Adding…"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTierEligibility;
