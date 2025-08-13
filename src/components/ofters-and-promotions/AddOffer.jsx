import React, { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { useBrands } from "../../hooks/useBrand";
import { useCategory } from "../../hooks/useCategory";
import Select from "react-select";
import { useAppTypes } from "../../hooks/useAppTypes";
import useUiStore from "../../store/ui";
import { useOffers } from "../../hooks/useOffers";
import { useTiers } from "../../hooks/useTiers";
import ImageCropper from "../ImageCropper";
import uploadApi from "../../api/upload";
import BulkCouponUpload from "./BulkCouponUpload";

const AddOffer = ({ isOpen, onClose, editData, offerType }) => {
  const [selectedOfferType, setSelectedOfferType] = useState(offerType || null);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const { useGetBrands } = useBrands();
  const [imagePreview, setImagePreview] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const { data: merchants } = useGetBrands({
    limit: 100,
  });
  const { useGetCategory } = useCategory();
  const { data: couponCategories } = useGetCategory({
    limit: 100,
  });
  const { useGetAppTypes } = useAppTypes();
  const { data: appTypes } = useGetAppTypes();
  const {
    useCreateMerchantOffer,
    updateMerchantOffer,
    useCreateBulkMerchantOffer,
  } = useOffers();
  const createMutation = useCreateMerchantOffer();
  const createBulkMutation = useCreateBulkMerchantOffer();
  const updateMutation = updateMerchantOffer();
  const { addToast } = useUiStore();
  const { useGetTiers } = useTiers();
  const { data: tiers } = useGetTiers();
  const [bulkCodes, setBulkCodes] = useState([]);
  const handleBulkCodesChange = (codes) => {
    setBulkCodes(codes);
  };
  useEffect(() => {
    if (offerType) {
      setSelectedOfferType(offerType);
    }
  }, [offerType]);
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
      code: "",
      title: { en: "", ar: "" },
      description: { en: "", ar: "" },
      merchantId: "",
      couponCategoryId: "",
      redemptionUrl: "",
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
        minPointsBalance: 0,
      },
      usagePolicy: {
        frequency: "",
        maxUsagePerPeriod: 0,
        maxTotalUsage: null,
      },
      conditions: [
        {
          appType: [],
          minTransactionValue: 0,
          maxTransactionValue: null,
          applicablePaymentMethods: [],
        },
      ],
      termsAndConditions: [],
    },
  });
  const titleValue = watch(`title.${activeLanguage}`);
  const descriptionValue = watch(`description.${activeLanguage}`);
  useEffect(() => {
    if (editData) {
      setSelectedOfferType(editData.type);

      setValue("title.en", editData.title?.en || editData.title || "");
      setValue("title.ar", editData.title?.ar || "");
      setValue(
        "description.en",
        editData.description?.en || editData.description || ""
      );
      setValue("posterImage", editData.posterImage || "");
      setValue("numberOfCodes", editData.code?.length || "");
      setImagePreview(editData.posterImage);
      setValue("description.ar", editData.description?.ar || "");
      setValue("merchantId", editData.merchantId);
      setValue("couponCategoryId", editData.couponCategoryId);
      setValue("redeemablePointsCount", editData.redeemablePointsCount);

      if (editData.type === "PRE_GENERATED" && editData.code) {
        setValue("code", editData.code[0].pin);
      }

      if (editData.type === "ONE_TIME_LINK" && editData.redemptionUrl) {
        setValue("redemptionUrl", editData.redemptionUrl);
      }

      if (editData.discountDetails) {
        setValue("discountDetails.type", editData.discountDetails.type);
        setValue("discountDetails.value", editData.discountDetails.value);
      }

      if (editData.validityPeriod) {
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
        };

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
        const userTypeOptions = [
          { value: "NEW", label: "New Users" },
          { value: "EXISTING", label: "Existing Users" },
          { value: "PREMIUM", label: "Premium Users" },
          { value: "ALL", label: "All Users" },
        ];

        const selectedUserTypes = editData.eligibilityCriteria.userTypes
          .map((type) => {
            return userTypeOptions.find((option) => option.value === type);
          })
          .filter(Boolean);

        setValue("eligibilityCriteria.userTypes", selectedUserTypes);

        if (tiers?.data) {
          const tierOptions = tiers.data.map((tier) => ({
            value: tier._id,
            label: tier.name?.en,
          }));

          const selectedTiers = editData.eligibilityCriteria.tiers
            .map((tierId) => {
              return tierOptions.find((option) => option.value === tierId);
            })
            .filter(Boolean);

          setValue("eligibilityCriteria.tiers", selectedTiers);
        }

        if (editData.eligibilityCriteria.minTransactionHistory !== undefined) {
          setValue(
            "eligibilityCriteria.minPointsBalance",
            editData.eligibilityCriteria.minTransactionHistory
          );
        } else if (
          editData.eligibilityCriteria.minPointsBalance !== undefined
        ) {
          setValue(
            "eligibilityCriteria.minPointsBalance",
            editData.eligibilityCriteria.minPointsBalance
          );
        }
      }

      if (editData.usagePolicy) {
        setValue("usagePolicy.frequency", editData.usagePolicy.frequency);
        setValue(
          "usagePolicy.maxUsagePerPeriod",
          editData.usagePolicy.maxUsagePerPeriod
        );
        setValue(
          "usagePolicy.maxTotalUsage",
          editData.usagePolicy.maxTotalUsage
        );
      }

      if (editData.conditions && editData.conditions.length > 0) {
        const appTypeOptions =
          appTypes?.data?.map((appType) => ({
            value: appType._id,
            label: appType.name,
          })) || [];

        const paymentMethodOptions = [
          { value: "Khedmah-Pay", label: "Khedmah-Pay" },
          { value: "Khedmah-Wallet", label: "Khedmah-Wallet" },
        ];

        const formattedConditions = editData.conditions.map((condition) => {
          const selectedAppTypes = condition.appType
            .map((typeId) => {
              return appTypeOptions.find((option) => option.value === typeId);
            })
            .filter(Boolean);

          const selectedPaymentMethods = condition.applicablePaymentMethods
            .map((method) => {
              return paymentMethodOptions.find(
                (option) => option.value === method
              );
            })
            .filter(Boolean);

          return {
            appType: selectedAppTypes,
            minTransactionValue: condition.minTransactionValue,
            maxTransactionValue: condition.maxTransactionValue,
            applicablePaymentMethods: selectedPaymentMethods,
          };
        });

        setValue("conditions", formattedConditions);
      }

      if (
        editData.termsAndConditions &&
        editData.termsAndConditions.length > 0
      ) {
        setValue("termsAndConditions", editData.termsAndConditions);
      }
    }
  }, [editData, setValue, appTypes, tiers]);
  const offerTypes = useMemo(
    () => [
      {
        id: "DYNAMIC",
        title: "Dynamic Offer",
        description: "Dynamic offer ",
      },
      {
        id: "ONE_TIME_LINK",
        title: "One Time Link",
        description: "One time link offer",
      },
      {
        id: "PRE_GENERATED",
        title: "Pre Generated",
        description: "Pre generated offer",
      },
      {
        id: "BULK",
        title: "Bulk Coupons",
        description: "Upload multiple pre-generated coupon codes",
      },
    ],
    []
  );

  if (!isOpen) return null;
  const userTypeOptions = [
    { value: "NEW", label: "New Users" },
    { value: "EXISTING", label: "Existing Users" },
    { value: "PREMIUM", label: "Premium Users" },
    { value: "ALL", label: "All Users" },
  ];

  const appTypeOptions =
    appTypes?.data?.map((appType) => ({
      value: appType._id,
      label: appType.name,
    })) || [];

  const tierOptions =
    tiers?.data?.map((appType) => ({
      value: appType._id,
      label: appType?.name?.en,
    })) || [];

  const paymentMethodOptions = [
    { value: "Khedmah-Pay", label: "Khedmah-Pay" },
    { value: "Khedmah-Wallet", label: "Khedmah-Wallet" },
  ];

  const watchTermsAndConditions = watch("termsAndConditions");
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
  const onSubmit = async (data) => {
    let imageUrl = data.posterImage;
    const file = watch("posterImage");
    if (file instanceof File || file instanceof Blob) {
      const uploadResponse = await uploadApi.uploadImage(file);
      imageUrl = uploadResponse.data?.url;
    }
    const formData = {
      merchantId: data.merchantId,
      title: data.title,
      numberOfCodes: data.numberOfCodes,
      description: data.description,
      posterImage: imageUrl,
      couponCategoryId: data.couponCategoryId,
      discountDetails: {
        type: data.discountDetails.type,
        value: data.discountDetails.value,
      },
      redeemablePointsCount: data.redeemablePointsCount,
      validityPeriod: {
        startDate: data.validityPeriod.startDate,
        endDate: data.validityPeriod.endDate,
      },
      eligibilityCriteria: {
        userTypes: data.eligibilityCriteria.userTypes.map((item) => item.value),
        tiers: data.eligibilityCriteria.tiers.map((item) => item.value),
        minPointsBalance: data.eligibilityCriteria.minPointsBalance,
      },
      type: selectedOfferType,
      usagePolicy: {
        frequency: data.usagePolicy.frequency,
        maxUsagePerPeriod: data.usagePolicy.maxUsagePerPeriod,
        maxTotalUsage: data.usagePolicy.maxTotalUsage,
      },
      conditions: data.conditions.map((condition) => ({
        appType: condition.appType.map((item) => item.value),
        minTransactionValue: condition.minTransactionValue,
        maxTransactionValue: condition.maxTransactionValue,
        applicablePaymentMethods: condition.applicablePaymentMethods.map(
          (item) => item.value
        ),
      })),
      termsAndConditions: data.termsAndConditions,
    };

    if (selectedOfferType === "PRE_GENERATED" && data.code) {
      formData.code = data.code;
    }

    if (selectedOfferType === "ONE_TIME_LINK" && data.redemptionUrl) {
      formData.redemptionUrl = data.redemptionUrl;
    }
    if (selectedOfferType === "BULK" && bulkCodes.length > 0) {
      formData.codes = bulkCodes;
    }

    if (editData) {
      updateMutation.mutate(
        {
          id: editData?._id,
          offerData: formData,
        },
        {
          onSuccess: (data) => {
            addToast({ type: "success", message: data?.data });
            setSelectedOfferType(null);
            setImagePreview(null);
            setOriginalFile(null);
            setIsCropping(false);
            setBulkCodes([]);
            reset();
            onClose();
          },
          onError: (error) => {
            addToast({
              type: "error",
              message: error?.response?.data?.data,
            });
          },
        }
      );
    } else if (selectedOfferType === "BULK") {
      createBulkMutation.mutate(formData, {
        onSuccess: (data) => {
          addToast({
            type: "success",
            message: data?.data,
          });
          handleBack();
        },
        onError: (error) => {
          addToast({
            type: "error",
            message: error?.response?.data?.data,
          });
        },
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: (data) => {
          addToast({
            type: "success",
            message: data?.data,
          });
          setSelectedOfferType(null);
          setImagePreview(null);
          setOriginalFile(null);
          setIsCropping(false);
          setBulkCodes([]);
          reset();
          onClose();
        },
        onError: (error) => {
          addToast({
            type: "error",
            message: error?.response?.data?.data,
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
    setSelectedOfferType(null);
    setImagePreview(null);
    setOriginalFile(null);
    setIsCropping(false);
    setBulkCodes([]);
    setActiveLanguage("en");
    reset();
    onClose();
  };
  const addCondition = () => {
    const currentConditions = watch("conditions") || [];
    setValue("conditions", [
      ...currentConditions,
      {
        appType: [],
        minTransactionValue: 0,
        maxTransactionValue: null,
        applicablePaymentMethods: [],
      },
    ]);
  };

  const removeCondition = (index) => {
    const currentConditions = watch("conditions") || [];
    const updatedConditions = currentConditions.filter((_, i) => i !== index);
    setValue("conditions", updatedConditions);
  };

  const inputClass =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";
  const sectionHeadingClass = "text-sm font-medium text-gray-700 mb-3";
  const cardClass = "bg-white p-4 rounded-lg shadow-sm border border-gray-100";

  if (!selectedOfferType) {
    return (
      <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl p-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-lg font-medium text-gray-800">
              Select Offer Type
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {offerTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => setSelectedOfferType(type.id)}
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors group"
              >
                <h3 className="text-sm font-semibold text-gray-700 mb-2 group-hover:text-green-600">
                  {type.title}
                </h3>
                <p className="text-xs text-gray-500 group-hover:text-green-500">
                  {type.description}
                </p>
                <div className="mt-3 flex justify-end">
                  <PlusIcon className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 mt-10">
      <div className="bg-white rounded-lg w-full max-w-4xl p-4 max-h-[80vh] overflow-y-auto mt-17">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium text-gray-800">
            {editData ? "Edit Offer" : "Add New Offer"}
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
                {selectedOfferType === "PRE_GENERATED" && (
                  <div>
                    <label className={labelClass}>Offer Code</label>
                    <input
                      {...register("code", {
                        required: "Offer code is required",
                      })}
                      className={inputClass}
                      placeholder="Enter unique offer code"
                    />
                    {errors.code && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.code.message}
                      </p>
                    )}
                  </div>
                )}
                {selectedOfferType === "DYNAMIC" && (
                  <div>
                    <label className={labelClass}>Number of Codes</label>
                    <input
                      {...register("numberOfCodes", {
                        required: "Number of code is required",
                      })}
                      className={inputClass}
                      placeholder="Enter number of codes"
                    />
                    {errors.numberOfCodes && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.numberOfCodes.message}
                      </p>
                    )}
                  </div>
                )}

                {selectedOfferType === "ONE_TIME_LINK" && (
                  <div>
                    <label className={labelClass}>Redemption URL</label>
                    <input
                      {...register("redemptionUrl", {
                        required: "Redemption URL is required",
                      })}
                      className={inputClass}
                      placeholder="Enter redemption URL"
                    />
                    {errors.redemptionUrl && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.redemptionUrl.message}
                      </p>
                    )}
                  </div>
                )}

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
                  <label className={labelClass}>Merchant</label>
                  <select
                    {...register("merchantId", {
                      required: "Merchant is required",
                    })}
                    className={inputClass}
                  >
                    <option value="">Select Merchant</option>
                    {merchants?.data?.map((merchant) => (
                      <option key={merchant._id} value={merchant._id}>
                        {merchant.title?.en}
                      </option>
                    ))}
                  </select>
                  {errors.merchantId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.merchantId.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Coupon Category</label>
                  <select
                    {...register("couponCategoryId", {
                      required: "Coupon Category is required",
                    })}
                    className={inputClass}
                  >
                    <option value="">Select Coupon Category</option>
                    {couponCategories?.data?.map((category) => (
                      <option key={category?._id} value={category?._id}>
                        {category.title?.en}
                      </option>
                    ))}
                  </select>
                  {errors.couponCategoryId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.couponCategoryId.message}
                    </p>
                  )}
                </div>
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
              {selectedOfferType === "BULK" && (
                <div className={cardClass}>
                  <h3 className={sectionHeadingClass}>Bulk Coupon Codes</h3>
                  <BulkCouponUpload
                    onChange={handleBulkCodesChange}
                    existingCodes={bulkCodes}
                  />
                  {bulkCodes.length === 0 && (
                    <p className="text-red-500 text-xs mt-1">
                      At least one coupon code is required
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className={cardClass}>
              <h3 className={sectionHeadingClass}>Discount Configuration</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Discount Type</label>
                  <select
                    {...register("discountDetails.type", {
                      required: "Discount type is required",
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
                      required: "Discount value is required",
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
                      min: { value: 0, message: "Points must be non-negative" },
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
              </div>
            </div>

            <div className={cardClass}>
              <h3 className={sectionHeadingClass}>Usage Policy</h3>
              <div className="grid grid-cols-3 gap-4">
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
              </div>
            </div>

            <div className={cardClass}>
              <div className="flex justify-between items-center mb-3">
                <h3 className={sectionHeadingClass}>Offer Conditions</h3>
                <button
                  type="button"
                  onClick={addCondition}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  Add Condition
                </button>
              </div>

              {watch("conditions").map((condition, conditionIndex) => (
                <div
                  key={conditionIndex}
                  className="border-b pb-4 mb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-medium text-gray-600">
                      Condition {conditionIndex + 1}
                    </h4>
                    {watch("conditions").length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCondition(conditionIndex)}
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Applicable App Types</label>
                      <Controller
                        name={`conditions.${conditionIndex}.appType`}
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
                        name={`conditions.${conditionIndex}.applicablePaymentMethods`}
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
                        {...register(
                          `conditions.${conditionIndex}.minTransactionValue`,
                          {
                            min: {
                              value: 0,
                              message:
                                "Minimum transaction value must be non-negative",
                            },
                          }
                        )}
                        className={inputClass}
                        placeholder="Minimum transaction value"
                      />
                      {errors.conditions?.[conditionIndex]
                        ?.minTransactionValue && (
                        <p className="text-red-500 text-xs mt-1">
                          {
                            errors.conditions[conditionIndex]
                              .minTransactionValue.message
                          }
                        </p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>
                        Maximum Transaction Value
                      </label>
                      <input
                        type="number"
                        {...register(
                          `conditions.${conditionIndex}.maxTransactionValue`,
                          {
                            min: {
                              value: 0,
                              message:
                                "Maximum transaction value must be non-negative",
                            },
                          }
                        )}
                        className={inputClass}
                        placeholder="Maximum transaction value (optional)"
                      />
                      {errors.conditions?.[conditionIndex]
                        ?.maxTransactionValue && (
                        <p className="text-red-500 text-xs mt-1">
                          {
                            errors.conditions[conditionIndex]
                              .maxTransactionValue.message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
                    {...register(`termsAndConditions.${index}`, {
                      required: "Term cannot be empty",
                    })}
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
                  {errors.termsAndConditions?.[index] && (
                    <p className="text-red-500 text-xs ml-2">
                      {errors.termsAndConditions[index].message}
                    </p>
                  )}
                </div>
              ))}
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

export default AddOffer;
