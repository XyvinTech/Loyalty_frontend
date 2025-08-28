import React, { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import Select from "react-select";
import { useAppTypes } from "../../hooks/useAppTypes";
import useUiStore from "../../store/ui";
import { useTiers } from "../../hooks/useTiers";
import { useTriggerServices } from "../../hooks/useTriggerServices";
import { useTriggerEvents } from "../../hooks/useTriggerEvents";
import { useKhedmahOffer } from "../../hooks/useKhedmahOffer";
import uploadApi from "../../api/upload";
import ImageCropper from "../ImageCropper";

const AddKhedmahOffer = ({ isOpen, onClose, editData }) => {
  const { useGetAppTypes } = useAppTypes();
  const [imagePreview, setImagePreview] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const { data: appTypes } = useGetAppTypes();
  const { addToast } = useUiStore();
  const { useGetTiers } = useTiers();
  const { data: tiers } = useGetTiers();
  const { useGetTriggerEvents } = useTriggerEvents();
  const { data: triggerEvents } = useGetTriggerEvents();
  const { useCreateKhedmahOffer, updateKhedmahOffer } = useKhedmahOffer();
  const createMutation = useCreateKhedmahOffer();
  const updateMutation = updateKhedmahOffer();
  const appTypeOptions =
    appTypes?.data?.map((appType) => ({
      value: appType._id,
      label: appType.name,
    })) || [];
  const offerTypes = useMemo(
    () => [
      {
        id: "DISCOUNT",
        title: "Discount",
        description: "Percentage or fixed amount discount",
      },
      {
        id: "FLAT_OFFER",
        title: "Flat Offer",
        description: "Fixed price offer",
      },
    ],
    []
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: { en: "", ar: "" },
      description: { en: "", ar: "" },
      posterImage: "",
      serviceCategory: "",
      eventType: "",
      offerType: "DISCOUNT",
      isActive: true,
      discountDetails: {
        type: "",
        value: "",
      },
      redeemablePointsCount: 0,
      validityPeriod: {
        startDate: "",
        endDate: "",
      },
      eligibilityCriteria: {
        userTypes: [],
        tiers: [],
        minTransactionHistory: 0,
        minPointsBalance: 0,
      },
      usagePolicy: {
        frequency: "",
        maxUsagePerPeriod: 0,
        maxTotalUsage: null,
        userLimit: null,
      },
      conditions: {
        appType: [],
        minTransactionValue: 0,
        maxTransactionValue: null,
        applicablePaymentMethods: [],
      },
      termsAndConditions: [],
      redemptionInstructions: "",
    },
  });
  const watchEventType = watch("eventType");

  const { useGetTriggerServiceByTriggerEventId } = useTriggerServices();
  const { data: services } =
    useGetTriggerServiceByTriggerEventId(watchEventType);
  const titleValue = watch(`title.${activeLanguage}`);
  const descriptionValue = watch(`description.${activeLanguage}`);
  useEffect(() => {
    if (editData) {
      const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      setValue("title.en", editData.title?.en || editData.title || "");
      setValue("title.ar", editData.title?.ar || "");
      setValue(
        "description.en",
        editData.description?.en || editData.description || ""
      );
      setValue("description.ar", editData.description?.ar || "");
      setValue("posterImage", editData.posterImage || "");
      setImagePreview(editData.posterImage);
      setValue("serviceCategory", editData.serviceCategory?._id || "");
      setValue("eventType", editData.eventType?._id || "");
      setValue("offerType", editData.offerType || "DISCOUNT");
      setValue(
        "isActive",
        editData.isActive !== undefined ? editData.isActive : true
      );
      setValue("redeemablePointsCount", editData.redeemablePointsCount || 0);

      if (editData.discountDetails) {
        setValue("discountDetails.type", editData.discountDetails.type || "");
        setValue("discountDetails.value", editData.discountDetails.value || "");
      }

      if (editData.validityPeriod) {
        setValue(
          "validityPeriod.startDate",
          formatDate(editData.validityPeriod.startDate)
        );
        setValue(
          "validityPeriod.endDate",
          formatDate(editData.validityPeriod.endDate)
        );
      }

      if (editData.eligibilityCriteria) {
        const userTypeOptions = (
          editData.eligibilityCriteria.userTypes || []
        ).map((type) => ({
          value: type,
          label:
            type === "NEW"
              ? "New Users"
              : type === "EXISTING"
              ? "Existing Users"
              : type === "PREMIUM"
              ? "Premium Users"
              : "All Users",
        }));
        setValue("eligibilityCriteria.userTypes", userTypeOptions);

        const tierOptions = (editData.eligibilityCriteria.tiers || []).map(
          (tierId) => ({
            value: tierId,
            label:
              tiers?.data?.find((t) => t._id === tierId)?.name?.en || tierId,
          })
        );
        setValue("eligibilityCriteria.tiers", tierOptions);

        setValue(
          "eligibilityCriteria.minTransactionHistory",
          editData.eligibilityCriteria.minTransactionHistory || 0
        );
        setValue(
          "eligibilityCriteria.minPointsBalance",
          editData.eligibilityCriteria.minPointsBalance || 0
        );
      }

      if (editData.usagePolicy) {
        setValue("usagePolicy.frequency", editData.usagePolicy.frequency || "");
        setValue(
          "usagePolicy.maxUsagePerPeriod",
          editData.usagePolicy.maxUsagePerPeriod || 0
        );
        setValue(
          "usagePolicy.maxTotalUsage",
          editData.usagePolicy.maxTotalUsage || null
        );
        setValue(
          "usagePolicy.userLimit",
          editData.usagePolicy.userLimit || null
        );
      }

      if (editData.conditions) {
        const paymentMethodOptions = (
          editData.conditions.applicablePaymentMethods || []
        ).map((method) => ({
          value: method,
          label:
            method === "Khedmah-site"
              ? "Khedmah Site"
              : method === "KhedmahPay-Wallet"
              ? "Khedmah Wallet"
              : "All Payment Methods",
        }));
        setValue("conditions.applicablePaymentMethods", paymentMethodOptions);

        setValue(
          "conditions.minTransactionValue",
          editData.conditions.minTransactionValue || 0
        );
        setValue(
          "conditions.maxTransactionValue",
          editData.conditions.maxTransactionValue || null
        );
        setValue("appType", editData.appType || "");
      }

      setValue("termsAndConditions", editData.termsAndConditions || []);
      setValue("redemptionInstructions", editData.redemptionInstructions || "");
    }
  }, [editData, setValue, tiers]);
  if (!isOpen) return null;

  const userTypeOptions = [
    { value: "NEW", label: "New Users" },
    { value: "EXISTING", label: "Existing Users" },
    { value: "PREMIUM", label: "Premium Users" },
    { value: "ALL", label: "All Users" },
  ];

  const tierOptions =
    tiers?.data?.map((tier) => ({
      value: tier._id,
      label: tier.name?.en,
    })) || [];

  const paymentMethodOptions = [
    { value: "Khedmah-site", label: "Khedmah Site" },
    { value: "KhedmahPay-Wallet", label: "Khedmah Wallet" },
    { value: "ALL", label: "All Payment Methods" },
  ];

  const watchTermsAndConditions = watch("termsAndConditions");
  const watchOfferType = watch("offerType");

  const onSubmit = async (data) => {
    let imageUrl = data.posterImage;
    const file = watch("posterImage");
    if (file instanceof File || file instanceof Blob) {
      const uploadResponse = await uploadApi.uploadImage(file);
      imageUrl = uploadResponse.data?.url;
    }

    const formData = {
      title: data.title,
      description: data.description,
      posterImage: imageUrl,
      serviceCategory: data.serviceCategory,
      eventType: data.eventType || null,
      offerType: data.offerType,
      isActive: data.isActive,
      discountDetails:
        data.offerType === "DISCOUNT"
          ? {
              type: data.discountDetails.type,
              value: data.discountDetails.value,
            }
          : undefined,
      redeemablePointsCount: data.redeemablePointsCount,
      validityPeriod: {
        startDate: data.validityPeriod.startDate,
        endDate: data.validityPeriod.endDate,
      },
      eligibilityCriteria: {
        userTypes: data.eligibilityCriteria.userTypes.map((item) => item.value),
        tiers: data.eligibilityCriteria.tiers.map((item) => item.value),
        minTransactionHistory: data.eligibilityCriteria.minTransactionHistory,
        minPointsBalance: data.eligibilityCriteria.minPointsBalance,
      },
      usagePolicy: {
        frequency: data.usagePolicy.frequency,
        maxUsagePerPeriod: data.usagePolicy.maxUsagePerPeriod,
        maxTotalUsage: data.usagePolicy.maxTotalUsage,
        userLimit: data.usagePolicy.userLimit,
      },
      conditions: {
        minTransactionValue: data.conditions.minTransactionValue,
        appType: data?.conditions.appType.map((item) => item.value),
        maxTransactionValue: data.conditions.maxTransactionValue,
        applicablePaymentMethods: data.conditions.applicablePaymentMethods.map(
          (item) => item.value
        ),
      },
      termsAndConditions: data.termsAndConditions,
      redemptionInstructions: data.redemptionInstructions,
    };
    if (editData) {
      updateMutation.mutate(
        { id: editData?._id, data: formData },
        {
          onSuccess: (data) => {
            addToast({ type: "success", message: data?.message });
            reset();
            onClose?.();
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
      createMutation.mutate(formData, {
        onSuccess: (data) => {
          addToast({
            type: "success",
            message: data?.message,
          });
          reset();
          onClose();
        },
        onError: (error) => {
          addToast({
            type: "error",
            message: error?.response?.data?.message,
          });
        },
      });
    }
  };

  const addTermsAndCondition = () => {
    const currentTerms = watchTermsAndConditions || [];
    setValue("termsAndConditions", [...currentTerms, ""]);
  };

  const removeTermsAndCondition = (index) => {
    const currentTerms = watchTermsAndConditions || [];
    const updatedTerms = currentTerms.filter((_, i) => i !== index);
    setValue("termsAndConditions", updatedTerms);
  };

  const handleBack = () => {
    reset();
    onClose();
    setImagePreview(null);
    setOriginalFile(null);
    setIsCropping(false);
  };
  const startCropping = () => {
    setIsCropping(true);
  };

  const handleCropComplete = (croppedBlob, croppedImageUrl) => {
    setImagePreview(croppedImageUrl);
    setValue("posterImage", croppedBlob);
    setIsCropping(false);
  };

  const cancelCrop = () => {
    setIsCropping(false);
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setValue("posterImage", file);
    }
  };
  const inputClass =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";
  const sectionHeadingClass = "text-sm font-medium text-gray-700 mb-3";
  const cardClass = "bg-white p-4 rounded-lg shadow-sm border border-gray-100";

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 mt-10">
      <div className="bg-white rounded-lg w-full max-w-4xl p-4 max-h-[80vh] overflow-y-auto mt-17">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium text-gray-800">
            {editData ? "Edit Offer" : "Add New CBS Offer"}
          </h2>
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        {isCropping ? (
          <ImageCropper
            imageUrl={imagePreview}
            onCropComplete={handleCropComplete}
            onCancel={cancelCrop}
            aspectRatio={16 / 9}
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">
            <div className="px-4 pt-4">
              <div className="flex border rounded overflow-hidden mb-4">
                <button
                  type="button"
                  onClick={() => setActiveLanguage("en")}
                  className={`flex-1 py-2 text-sm font-medium ${
                    activeLanguage === "en"
                      ? "bg-green-50 text-green-700"
                      : "bg-white text-gray-500"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLanguage("ar")}
                  className={`flex-1 py-2 text-sm font-medium ${
                    activeLanguage === "ar"
                      ? "bg-green-50 text-green-700"
                      : "bg-white text-gray-500"
                  }`}
                >
                  Arabic
                </button>
              </div>
            </div>
            <div className={cardClass}>
              <h3 className={sectionHeadingClass}>Basic Offer Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelClass}>
                    Title ({activeLanguage === "en" ? "English" : "Arabic"})
                  </label>
                  <input
                    {...register(`title.${activeLanguage}`)}
                    value={titleValue}
                    className={inputClass}
                    placeholder={`Offer title in ${
                      activeLanguage === "en" ? "English" : "Arabic"
                    }`}
                    dir={activeLanguage === "ar" ? "rtl" : "ltr"}
                  />
                  {errors.title?.[activeLanguage] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.title[activeLanguage].message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Offer Type</label>
                  <select
                    {...register("offerType", {
                      required: "Offer type is required",
                    })}
                    className={inputClass}
                  >
                    {offerTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.title}
                      </option>
                    ))}
                  </select>
                  {errors.offerType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.offerType.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Event Type (Optional)</label>
                  <select {...register("eventType")} className={inputClass}>
                    <option value="">Select Event Type</option>
                    {triggerEvents?.data?.map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.name?.en}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Service Category</label>
                  <select
                    {...register("serviceCategory", {
                      required: "Service category is required",
                    })}
                    className={inputClass}
                  >
                    <option value="">Select Service Category</option>
                    {services?.data?.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.title?.en}
                      </option>
                    ))}
                  </select>
                  {errors.serviceCategory && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.serviceCategory.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Status</label>
                  <select {...register("isActive")} className={inputClass}>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Poster Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer w-full border border-gray-200 rounded-lg px-3 py-3 flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">Choose Image</span>
                    <ArrowUpTrayIcon className="w-5 h-5 text-gray-500" />
                  </label>
                  {errors.image && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.image.message}
                    </p>
                  )}
                </div>

                {imagePreview && (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={startCropping}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200"
                      >
                        <span>Crop</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <label className={labelClass}>
                  Description ({activeLanguage === "en" ? "English" : "Arabic"})
                </label>
                <textarea
                  {...register(`description.${activeLanguage}`)}
                  className={inputClass}
                  placeholder={`Offer description in ${
                    activeLanguage === "en" ? "English" : "Arabic"
                  }`}
                  rows={3}
                  value={descriptionValue}
                  dir={activeLanguage === "ar" ? "rtl" : "ltr"}
                />
                {errors.description?.[activeLanguage] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description[activeLanguage].message}
                  </p>
                )}
              </div>
            </div>

            {watchOfferType === "DISCOUNT" && (
              <div className={cardClass}>
                <h3 className={sectionHeadingClass}>Discount Configuration</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Discount Type</label>
                    <select
                      {...register("discountDetails.type", {
                        required:
                          watchOfferType === "DISCOUNT"
                            ? "Discount type is required"
                            : false,
                      })}
                      className={inputClass}
                    >
                      <option value="">Select Type</option>
                      <option value="PERCENTAGE">Percentage</option>
                      <option value="FIXED">Fixed Amount</option>
                    </select>
                    {errors.discountDetails?.type && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.discountDetails.type.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Discount Value</label>
                    <input
                      type="number"
                      {...register("discountDetails.value", {
                        required:
                          watchOfferType === "DISCOUNT"
                            ? "Discount value is required"
                            : false,
                        min: {
                          value: 0,
                          message: "Discount value must be positive",
                        },
                      })}
                      className={inputClass}
                      placeholder="Discount amount"
                    />
                    {errors.discountDetails?.value && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.discountDetails.value.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Redeemable Points</label>
                    <input
                      type="number"
                      {...register("redeemablePointsCount", {
                        min: {
                          value: 0,
                          message: "Points must be non-negative",
                        },
                      })}
                      className={inputClass}
                      placeholder="Points required"
                    />
                    {errors.redeemablePointsCount && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.redeemablePointsCount.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className={cardClass}>
              <h3 className={sectionHeadingClass}>Offer Validity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Start Date</label>
                  <input
                    type="date"
                    {...register("validityPeriod.startDate", {
                      required: "Start date is required",
                    })}
                    className={inputClass}
                  />
                  {errors.validityPeriod?.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.validityPeriod.startDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>End Date</label>
                  <input
                    type="date"
                    {...register("validityPeriod.endDate", {
                      required: "End date is required",
                      validate: (value) => {
                        const startDate = watch("validityPeriod.startDate");
                        return (
                          !startDate ||
                          new Date(value) >= new Date(startDate) ||
                          "End date must be after start date"
                        );
                      },
                    })}
                    className={inputClass}
                  />
                  {errors.validityPeriod?.endDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.validityPeriod.endDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <h3 className={sectionHeadingClass}>Eligibility Criteria</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>User Types</label>
                  <Controller
                    name="eligibilityCriteria.userTypes"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={userTypeOptions}
                        className={`basic-multi-select`}
                        classNamePrefix="select"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            border: "1px solid #E5E7EB",
                            borderRadius: "0.375rem",
                            padding: "2px",
                            boxShadow: "none",
                            "&:hover": {
                              borderColor: "#10B981",
                            },
                          }),
                        }}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className={labelClass}>Tiers</label>
                  <Controller
                    name="eligibilityCriteria.tiers"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={tierOptions}
                        className={`basic-multi-select`}
                        classNamePrefix="select"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            border: "1px solid #E5E7EB",
                            borderRadius: "0.375rem",
                            padding: "2px",
                            boxShadow: "none",
                            "&:hover": {
                              borderColor: "#10B981",
                            },
                          }),
                        }}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className={labelClass}>Minimum Points Balance</label>
                  <input
                    type="number"
                    {...register("eligibilityCriteria.minPointsBalance", {
                      min: {
                        value: 0,
                        message: "Minimum points must be non-negative",
                      },
                    })}
                    className={inputClass}
                    placeholder="Minimum points required"
                  />
                  {errors.eligibilityCriteria?.minPointsBalance && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.eligibilityCriteria.minPointsBalance.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>
                    Minimum Transaction History
                  </label>
                  <input
                    type="number"
                    {...register("eligibilityCriteria.minTransactionHistory", {
                      min: {
                        value: 0,
                        message:
                          "Minimum transaction history must be non-negative",
                      },
                    })}
                    className={inputClass}
                    placeholder="Minimum past transactions"
                  />
                  {errors.eligibilityCriteria?.minTransactionHistory && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.eligibilityCriteria.minTransactionHistory.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <h3 className={sectionHeadingClass}>Usage Policy</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Usage Frequency</label>
                  <select
                    {...register("usagePolicy.frequency", {
                      required: "Usage frequency is required",
                    })}
                    className={inputClass}
                  >
                    <option value="">Select Frequency</option>
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="TOTAL">Total</option>
                  </select>
                  {errors.usagePolicy?.frequency && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.usagePolicy.frequency.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Max Usage Per Period</label>
                  <input
                    type="number"
                    {...register("usagePolicy.maxUsagePerPeriod", {
                      required: "Max usage is required",
                      min: {
                        value: 1,
                        message: "Max usage must be at least 1",
                      },
                    })}
                    className={inputClass}
                    placeholder="Max uses"
                  />
                  {errors.usagePolicy?.maxUsagePerPeriod && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.usagePolicy.maxUsagePerPeriod.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Max Total Usage</label>
                  <input
                    type="number"
                    {...register("usagePolicy.maxTotalUsage", {
                      min: {
                        value: 0,
                        message: "Max total usage must be non-negative",
                      },
                    })}
                    className={inputClass}
                    placeholder="Unlimited if left blank"
                  />
                  {errors.usagePolicy?.maxTotalUsage && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.usagePolicy.maxTotalUsage.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>User Limit</label>
                  <input
                    type="number"
                    {...register("usagePolicy.userLimit", {
                      min: {
                        value: 0,
                        message: "User limit must be non-negative",
                      },
                    })}
                    className={inputClass}
                    placeholder="Unlimited if left blank"
                  />
                  {errors.usagePolicy?.userLimit && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.usagePolicy.userLimit.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <h3 className={sectionHeadingClass}>Offer Conditions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Applicable App Types</label>

                  <Controller
                    name={`conditions.appType`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={appTypeOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    )}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Applicable Payment Methods
                  </label>
                  <Controller
                    name="conditions.applicablePaymentMethods"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={paymentMethodOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className={labelClass}>
                    Minimum Transaction Value
                  </label>
                  <input
                    type="number"
                    {...register("conditions.minTransactionValue", {
                      min: {
                        value: 0,
                        message:
                          "Minimum transaction value must be non-negative",
                      },
                    })}
                    className={inputClass}
                    placeholder="Minimum transaction value"
                  />
                  {errors.conditions?.minTransactionValue && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.conditions.minTransactionValue.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>
                    Maximum Transaction Value
                  </label>
                  <input
                    type="number"
                    {...register("conditions.maxTransactionValue", {
                      min: {
                        value: 0,
                        message:
                          "Maximum transaction value must be non-negative",
                      },
                    })}
                    className={inputClass}
                    placeholder="Maximum transaction value (optional)"
                  />
                  {errors.conditions?.maxTransactionValue && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.conditions.maxTransactionValue.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <div className="flex justify-between items-center mb-3">
                <h3 className={sectionHeadingClass}>Terms and Conditions</h3>
                <button
                  type="button"
                  onClick={addTermsAndCondition}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  Add Term
                </button>
              </div>
              {watchTermsAndConditions?.map((term, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    {...register(`termsAndConditions.${index}`)}
                    className={inputClass}
                    placeholder={`Term ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeTermsAndCondition(index)}
                    className="ml-2 text-red-500 hover:bg-red-50 p-1 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className={cardClass}>
              <h3 className={sectionHeadingClass}>Redemption Instructions</h3>
              <textarea
                {...register("redemptionInstructions")}
                className={inputClass}
                placeholder="Instructions for redeeming this offer"
                rows={3}
              />
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
                Save Offer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddKhedmahOffer;
