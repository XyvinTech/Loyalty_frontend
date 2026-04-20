import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { XMarkIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import StyledButton from "../../ui/StyledButton";
import { useTiers } from "../../hooks/useTiers";
import useUiStore from "../../store/ui";
import { useAppTypes } from "../../hooks/useAppTypes";

const tierSchema = z.object({
  name: z.object({
    en: z.string().min(1, "English name is required"),
    ar: z.string().optional(),
  }),
  points_required: z
    .number()
    .nonnegative("Points required must be 0 or greater"),
  hierarchy_level: z
    .number()
    .nonnegative("Hierarchy level must be 0 or greater"),
  isActive: z.boolean(),
  description: z.object({
    en: z.array(z.string()).optional(),
    ar: z.array(z.string()).optional(),
  }),
  tier_point_multiplier: z
    .array(
      z.object({
        appType: z.string().min(1, "App Type is required"),
        multiplier: z
          .number()
          .positive("Multiplier value must be greater than 0"),
      })
    )
    .min(1, "At least one multiplier is required"),
});

const AddTier = ({ isOpen, onClose, editData }) => {
  const [activeLanguage, setActiveLanguage] = useState("en");
  const { useGetAppTypes } = useAppTypes();
  const { data: appTypes } = useGetAppTypes();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tierSchema),
    defaultValues: {
      name: { en: "", ar: "" },
      points_required: "",
      hierarchy_level: 0,
      isActive: true,
      description: { en: [], ar: [] },
      tier_point_multiplier: [{ appType: "", multiplier: "" }],
    },
  });

  const { useCreateTier, useUpdateTier } = useTiers();
  const createMutation = useCreateTier();
  const updateMutation = useUpdateTier();
  const { addToast } = useUiStore();

  useEffect(() => {
    if (editData) {
      setValue("name.en", editData?.data?.name?.en || "");
      setValue("name.ar", editData?.data?.name?.ar || "");
      setValue(
        "points_required",
        editData?.data?.points_required !== undefined
          ? editData.data.points_required
          : ""
      );
      setValue(
        "hierarchy_level",
        editData?.data?.hierarchy_level !== undefined
          ? editData.data.hierarchy_level
          : 0
      );
      setValue("isActive", editData?.data?.isActive ?? true);
      setValue("description.en", editData?.data?.description?.en || []);
      setValue("description.ar", editData?.data?.description?.ar || []);
      setValue(
        "tier_point_multiplier",
        editData?.data?.tier_point_multiplier?.length > 0
          ? editData.data.tier_point_multiplier.map((item) => ({
              appType: item.appType?._id || item.appType || "",
              multiplier: item.multiplier || "",
            }))
          : [{ appType: "", multiplier: "" }]
      );
    }
  }, [editData, setValue]);

  const watchMultipliers = watch("tier_point_multiplier");

  const addMultiplier = () => {
    setValue("tier_point_multiplier", [
      ...watchMultipliers,
      { appType: "", multiplier: "" },
    ]);
  };

  const removeMultiplier = (index) => {
    if (watchMultipliers.length <= 1) return;
    setValue(
      "tier_point_multiplier",
      watchMultipliers.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (formData) => {
    const action = editData?.data ? updateMutation : createMutation;
    const payload = editData?.data
      ? { id: editData.data._id, tierData: formData }
      : formData;

    action.mutate(payload, {
      onSuccess: (data) => {
        addToast({ type: "success", message: data?.message });
        reset({
          name: { en: "", ar: "" },
          points_required: "",
          hierarchy_level: "",
          isActive: true,
          description: { en: [], ar: [] },
          tier_point_multiplier: [{ appType: "", multiplier: "" }],
        });
        onClose();
      },
      onError: (error) => {
        addToast({ type: "error", message: error?.response?.data?.message });
      },
    });
  };

  const inputClass =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";
  const sectionHeadingClass = "text-sm font-medium text-gray-700 mb-3";
  const cardClass = "bg-white p-4 rounded-lg shadow-sm border border-gray-100";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 mt-10">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            {editData?.data ? "Edit Tier" : "Add New Tier"}
          </h2>
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <label className={labelClass}>Points Required</label>
                <input
                  type="number"
                  {...register("points_required", { valueAsNumber: true })}
                  className={inputClass}
                />
                {errors.points_required && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.points_required.message}
                  </p>
                )}
              </div>

              <div className="flex items-center pt-5">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register("isActive")}
                  className="h-4 w-4 text-green-600 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 text-sm text-gray-700"
                >
                  Active
                </label>
              </div>
            </div>

            <div className="flex border rounded overflow-hidden mb-2">
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

            <div>
              <label className={labelClass}>
                Tier Name ({activeLanguage === "en" ? "English" : "Arabic"})
              </label>
              <input
                {...register(`name.${activeLanguage}`)}
                className={inputClass}
                value={watch(`name.${activeLanguage}`)}
                dir={activeLanguage === "ar" ? "rtl" : "ltr"}
              />
              {errors.name?.[activeLanguage] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name[activeLanguage].message}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={labelClass}>
                  Description ({activeLanguage === "en" ? "English" : "Arabic"})
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setValue(`description.${activeLanguage}`, [
                      ...(watch(`description.${activeLanguage}`) || []),
                      "",
                    ])
                  }
                  className="text-xs text-green-600 hover:text-green-800"
                >
                  + Add Item
                </button>
              </div>

              {watch(`description.${activeLanguage}`)?.map((desc, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    value={desc}
                    onChange={(e) => {
                      const newDesc = [
                        ...getValues(`description.${activeLanguage}`),
                      ];
                      newDesc[index] = e.target.value;
                      setValue(`description.${activeLanguage}`, newDesc);
                    }}
                    className={inputClass}
                    dir={activeLanguage === "ar" ? "rtl" : "ltr"}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setValue(
                        `description.${activeLanguage}`,
                        watch(`description.${activeLanguage}`).filter(
                          (_, i) => i !== index
                        )
                      )
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Hierarchy Level field - only shown when editing */}
            {editData?.data && (
              <div className="flex-1">
                <label className={labelClass}>Hierarchy Level</label>
                <input
                  type="number"
                  {...register("hierarchy_level", { valueAsNumber: true })}
                  className={inputClass}
                />
                {errors.hierarchy_level && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.hierarchy_level.message}
                  </p>
                )}
              </div>
            )}

            <div className={cardClass}>
              <div className="flex justify-between items-center mb-3">
                <h3 className={sectionHeadingClass}>
                  Multiplier Configuration
                </h3>
                <button
                  type="button"
                  onClick={addMultiplier}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  Add Multiplier
                </button>
              </div>

              <div className="space-y-3">
                {watchMultipliers.map((multiplier, index) => (
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
                          Multiplier
                        </h4>
                      </div>
                      {watchMultipliers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMultiplier(index)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>App Type</label>
                        <select
                          {...register(
                            `tier_point_multiplier.${index}.appType`,
                            {
                              required: "App Type is required",
                            }
                          )}
                          className={inputClass}
                        >
                          <option value="">Select App Type</option>
                          {appTypes?.data?.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        {errors.tier_point_multiplier?.[index]?.appType && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              errors.tier_point_multiplier[index].appType
                                .message
                            }
                          </p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass}>Multiplier Value</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register(
                            `tier_point_multiplier.${index}.multiplier`,
                            {
                              valueAsNumber: true,
                              required: "Multiplier value is required",
                              min: {
                                value: 0.01,
                                message:
                                  "Multiplier value must be greater than 0",
                              },
                            }
                          )}
                          placeholder="Enter multiplier (e.g., 1.5)"
                          className={inputClass}
                        />
                        {errors.tier_point_multiplier?.[index]?.multiplier && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              errors.tier_point_multiplier[index].multiplier
                                .message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {errors.tier_point_multiplier &&
                  !errors.tier_point_multiplier[0] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.tier_point_multiplier.message}
                    </p>
                  )}
                </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
            <StyledButton
              name="Cancel"
              onClick={() => {
                reset();
                onClose();
              }}
              variant="tertiary"
              disabled={
                createMutation.isPending || updateMutation.isPending
              }
            />
            <StyledButton
              name={editData?.data ? "Update" : "Add Tier"}
              type="submit"
              variant="primary"
              isLoading={
                createMutation.isPending || updateMutation.isPending
              }
              loadingLabel={editData?.data ? "Saving…" : "Adding…"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTier;