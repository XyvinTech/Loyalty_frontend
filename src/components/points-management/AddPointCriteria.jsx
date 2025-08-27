import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTriggerServices } from "../../hooks/useTriggerServices";
import { useAppTypes } from "../../hooks/useAppTypes";
import { usePointsCriteria } from "../../hooks/usePointsCriteria";
import { useTriggerEvents } from "../../hooks/useTriggerEvents";
import useUiStore from "../../store/ui";
import { usePaymentMethod } from "../../hooks/usePaymentMethod";

const AddPointCriteria = ({ isOpen, onClose, editData }) => {
  if (!isOpen) return null;

  const { useCreatePointsCriteria, useUpdatePointsCriteria } =
    usePointsCriteria();
  const createMutation = useCreatePointsCriteria();
  const updateMutation = useUpdatePointsCriteria();
  const { addToast } = useUiStore();

  const { useGetTriggerEvents } = useTriggerEvents();
  const { data: triggerEvents } = useGetTriggerEvents();

  const { useGetTriggerServiceByTriggerEventId } = useTriggerServices();
  const { useGetAppTypes } = useAppTypes();
  const { data: appTypes } = useGetAppTypes();
  const { useGetPaymentMethods } = usePaymentMethod();
  const { data: paymentMethods } = useGetPaymentMethods();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      eventType: "",
      serviceType: "",
      appType: "",
      startDate: null,
      endDate: null,
      description: "",
      pointSystem: [{ paymentMethod: "", pointType: "", pointRate: "" }],
      conditions: {
        maxTransactions: {
          weekly: "",
          monthly: "",
        },
        transactionValueLimits: {
          minValue: "",
          maxValue: "",
        },
      },
    },
  });

  const watchPointSystem = watch("pointSystem");
  const watchEventType = watch("eventType");

  const { data: triggerServices } =
    useGetTriggerServiceByTriggerEventId(watchEventType);

  useEffect(() => {
    if (editData) {
      setValue(
        "eventType",
        editData.eventType?._id || editData.eventType || ""
      );
      setValue(
        "serviceType",
        editData.serviceType?._id || editData.serviceType || ""
      );
      const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0];
      };
      setValue("appType", editData.appType?._id || editData.appType || "");
      setValue("description", editData?.description || "");
      setValue("startDate", formatDate(editData?.startDate) || null);
      setValue("endDate", formatDate(editData?.endDate) || null);
      if (editData.pointSystem?.length > 0) {
        setValue(
          "pointSystem",
          editData.pointSystem.map((item) => ({
            paymentMethod: item.paymentMethod || "",
            pointType: item.pointType || "",
            pointRate: item.pointRate || "",
          }))
        );
      }

      if (editData.conditions) {
        const { maxTransactions, transactionValueLimits } = editData.conditions;

        if (maxTransactions) {
          setValue(
            "conditions.maxTransactions.weekly",
            maxTransactions.weekly || "0"
          );
          setValue(
            "conditions.maxTransactions.monthly",
            maxTransactions.monthly || "0"
          );
        } else {
          // Set default values when maxTransactions doesn't exist
          setValue("conditions.maxTransactions.weekly", "0");
          setValue("conditions.maxTransactions.monthly", "0");
        }

        if (transactionValueLimits) {
          setValue(
            "conditions.transactionValueLimits.minValue",
            transactionValueLimits.minValue || "0"
          );
          setValue(
            "conditions.transactionValueLimits.maxValue",
            transactionValueLimits.maxValue || "0"
          );
        } else {
          // Set default values when transactionValueLimits doesn't exist
          setValue("conditions.transactionValueLimits.minValue", "0");
          setValue("conditions.transactionValueLimits.maxValue", "0");
        }
      } else {
        // Set default values when conditions object doesn't exist
        setValue("conditions.maxTransactions.weekly", "0");
        setValue("conditions.maxTransactions.monthly", "0");
        setValue("conditions.transactionValueLimits.minValue", "0");
        setValue("conditions.transactionValueLimits.maxValue", "0");
      }
      
      if (triggerServices?.data && editData.serviceType) {
        const serviceTypeId = editData.serviceType?._id || editData.serviceType;
        const isValidServiceType = triggerServices.data.some(
          (item) => item._id === serviceTypeId
        );
        if (isValidServiceType) {
          setValue("serviceType", serviceTypeId);
        }
      }
    }
  }, [editData, setValue, triggerServices]);

  const paymentMethodOptions = [
    { value: "Khedmah-Pay", label: "Card" },
    { value: "Khedmah-Wallet", label: "Wallet" },
  ];

  const pointTypeOptions = [
    { value: "percentage", label: "Percentage" },
    { value: "fixed", label: "Fixed" },
  ];

  const onSubmit = (data) => {
    const formData = {
      eventType: data.eventType,
      serviceType: data.serviceType,
      startDate: data?.startDate,
      endDate: data.endDate,
      appType: data.appType,
      description: data.description,
    };

    const validPointSystems = data.pointSystem.filter(
      (item) => item.paymentMethod && item.pointType && item.pointRate
    );

    if (validPointSystems.length > 0) {
      formData.pointSystem = validPointSystems;
    }

    const conditionFields = {
      maxTransactions: {
        weekly: data.conditions.maxTransactions.weekly,
        monthly: data.conditions.maxTransactions.monthly,
      },
      transactionValueLimits: {
        minValue: data.conditions.transactionValueLimits.minValue,
        maxValue: data.conditions.transactionValueLimits.maxValue,
      },
    };

    const hasMaxTransactions =
      conditionFields.maxTransactions.weekly ||
      conditionFields.maxTransactions.monthly;
    const hasValueLimits =
      conditionFields.transactionValueLimits.minValue ||
      conditionFields.transactionValueLimits.maxValue;

    if (hasMaxTransactions || hasValueLimits) {
      formData.conditions = {};

      if (hasMaxTransactions) {
        formData.conditions.maxTransactions = {};
        if (conditionFields.maxTransactions.weekly) {
          formData.conditions.maxTransactions.weekly =
            conditionFields.maxTransactions.weekly;
        }
        if (conditionFields.maxTransactions.monthly) {
          formData.conditions.maxTransactions.monthly =
            conditionFields.maxTransactions.monthly;
        }
      }

      if (hasValueLimits) {
        formData.conditions.transactionValueLimits = {};
        if (conditionFields.transactionValueLimits.minValue) {
          formData.conditions.transactionValueLimits.minValue =
            conditionFields.transactionValueLimits.minValue;
        }
        if (conditionFields.transactionValueLimits.maxValue) {
          formData.conditions.transactionValueLimits.maxValue =
            conditionFields.transactionValueLimits.maxValue;
        }
      }
    }

    const handleResponse = (response, successAction) => {
      addToast({
        type: "success",
        message: response?.message || "Operation successful",
      });
      successAction();
    };

    const handleError = (error) => {
      addToast({
        type: "error",
        message: error?.response?.data?.message || "An error occurred",
      });
    };

    if (editData) {
      updateMutation.mutate(
        { id: editData?._id, criteriaData: formData },
        {
          onSuccess: (data) => handleResponse(data, onClose),
          onError: handleError,
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: (data) => handleResponse(data, onClose),
        onError: handleError,
      });
    }
  };

  const addPointSystem = () => {
    setValue("pointSystem", [
      ...watchPointSystem,
      { paymentMethod: "", pointType: "", pointRate: "" },
    ]);
  };

  const removePointSystem = (index) => {
    if (watchPointSystem.length <= 1) return;
    setValue(
      "pointSystem",
      watchPointSystem.filter((_, i) => i !== index)
    );
  };

  const inputClass =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";
  const sectionHeadingClass = "text-sm font-medium text-gray-700 mb-3";
  const cardClass = "bg-white p-4 rounded-lg shadow-sm border border-gray-100";

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 mt-10">
      <div className="bg-white rounded-lg w-full max-w-2xl p-4 max-h-[80vh] min-h-[300px] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium text-gray-800">
            {editData ? "Edit" : "Add"} Point Criteria
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">
          <div className={cardClass}>
            <h3 className={sectionHeadingClass}>Basic Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Trigger Event</label>
                <select
                  {...register("eventType", {
                    required: "Trigger Event is required",
                  })}
                  className={inputClass}
                >
                  <option value="">Select Event</option>
                  {triggerEvents?.data?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name?.en}
                    </option>
                  ))}
                </select>
                {errors.eventType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.eventType.message}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Service Provider</label>
                <select
                  {...register("serviceType", {
                    required: "Trigger Service is required",
                  })}
                  className={inputClass}
                >
                  <option value="">Select Service</option>
                  {triggerServices?.data?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.title?.en}
                    </option>
                  ))}
                </select>
                {errors.serviceType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.serviceType.message}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>App Type</label>
                <select
                  {...register("appType", { required: "App Type is required" })}
                  className={inputClass}
                >
                  <option value="">Select App</option>
                  {appTypes?.data?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.appType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.appType.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Description</label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className={`${inputClass} h-24 resize-none`}
                placeholder="Enter description..."
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start Date</label>
                <input
                  type="date"
                  {...register("startDate", {
                    required: "Start Date is required",
                  })}
                  className={inputClass}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>End Date</label>
                <input
                  type="date"
                  {...register("endDate", { required: "End Date is required" })}
                  className={inputClass}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className="flex justify-between items-center mb-3">
              <h3 className={sectionHeadingClass}>Reward Configuration</h3>
              <button
                type="button"
                onClick={addPointSystem}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                Add Point System
              </button>
            </div>

            <div className="space-y-3">
              {watchPointSystem.map((pointItem, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-medium mr-2">
                        {index + 1}
                      </span>
                      <h4 className="text-xs font-medium text-gray-700">
                        Reward Method
                      </h4>
                    </div>
                    {watchPointSystem.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePointSystem(index)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={labelClass}>Payment Method</label>
                      <select
                        {...register(`pointSystem.${index}.paymentMethod`)}
                        className={inputClass}
                      >
                        <option value="">Select Payment Method</option>
                        {paymentMethods?.data?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Point Type</label>
                      <select
                        {...register(`pointSystem.${index}.pointType`)}
                        className={inputClass}
                      >
                        <option value="">Select Point Type</option>
                        {pointTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Point Rate</label>
                      <input
                        type="text"
                        {...register(`pointSystem.${index}.pointRate`)}
                        placeholder="Enter rate"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={cardClass}>
            <h3 className={sectionHeadingClass}>Limitations & Thresholds</h3>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <h4 className="text-xs font-medium text-gray-600 mb-2">
                  Maximum Transactions
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>Weekly Limit</label>
                    <input
                      type="number"
                      {...register("conditions.maxTransactions.weekly")}
                      placeholder="Weekly max"
                      disabled
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter 0 for Unlimited
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>Monthly Limit</label>
                    <input
                      type="number"
                      {...register("conditions.maxTransactions.monthly")}
                      placeholder="Monthly max"
                      className={inputClass}
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter 0 for Unlimited
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-gray-600 mb-2">
                  Transaction Value Limits
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>Minimum Value</label>
                    <input
                      type="number"
                      {...register(
                        "conditions.transactionValueLimits.minValue"
                      )}
                      placeholder="Minimum value"
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter 0 for Unlimited
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>Maximum Value</label>
                    <input
                      type="number"
                      {...register(
                        "conditions.transactionValueLimits.maxValue"
                      )}
                      placeholder="Maximum value"
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter 0 for Unlimited
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save Criteria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPointCriteria;
