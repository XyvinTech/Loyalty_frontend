import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import StyledButton from "../../ui/StyledButton";
import useUiStore from "../../store/ui";
import { useTriggerServices } from "../../hooks/useTriggerServices";
import { useTriggerEvents } from "../../hooks/useTriggerEvents";
import Select from "react-select";
import uploadApi from "../../api/upload";
import {
  validateImageFileForUpload,
  getImageUploadRulesSummary,
} from "../../utils/validateImageFile";

const serviceSchema = z.object({
  title: z.object({
    en: z.string().min(3, "English title is required (min 3 characters)"),
    ar: z.string().optional(),
  }),
  description: z.object({
    en: z.string().min(5, "English description is required (min 5 characters)"),
    ar: z.string().optional(),
  }),
  icon: z.any().optional(),
  triggerEvent: z
    .array(z.string())
    .nonempty("At least one event must be selected"),
});

const AddService = ({ isOpen, onClose, editData }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeLanguage, setActiveLanguage] = useState("en");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: { en: "", ar: "" },
      description: { en: "", ar: "" },
      icon: "",
      triggerEvent: [],
    },
  });

  const { useCreateTriggerService, useUpdateTriggerService } =
    useTriggerServices();
  const createMutation = useCreateTriggerService();
  const updateMutation = useUpdateTriggerService();
  const { addToast } = useUiStore();
  const { useGetTriggerEvents } = useTriggerEvents();
  const { data: triggerEvents } = useGetTriggerEvents();

  useEffect(() => {
    if (editData?.data) {
      setValue(
        "title.en",
        editData.data.title?.en || editData.data.title || ""
      );
      setValue("title.ar", editData.data.title?.ar || "");
      setValue(
        "description.en",
        editData.data.description?.en || editData.data.description || ""
      );
      setValue("description.ar", editData.data.description?.ar || "");
      setValue("icon", editData.data.icon || "");
      setValue(
        "triggerEvent",
        editData.data.triggerEvent?.map((event) => event._id) || []
      );
      setImagePreview(editData?.data?.icon);
    }
  }, [editData, setValue]);

  const onSubmit = async (formData) => {
    setIsSaving(true);
    try {
      let imageUrl = formData.icon;
      const file = watch("icon");
      if (file instanceof File) {
        const uploadResponse = await uploadApi.uploadImage(file);
        const fullPath = uploadResponse.data?.url;

        imageUrl = fullPath;
      }

      const formDataToSubmit = { ...formData, icon: imageUrl };
      const action = editData?.data ? updateMutation : createMutation;
      const payload = editData?.data
        ? { id: editData.data._id, triggerServiceData: formDataToSubmit }
        : formDataToSubmit;

      action.mutate(payload, {
        onSuccess: (data) => {
          addToast({
            type: "success",
            message: data?.message ?? "Service saved successfully.",
          });
          reset({
            title: { en: "", ar: "" },
            description: { en: "", ar: "" },
            icon: "",
            triggerEvent: [],
          });
          setImagePreview(null);
          onClose();
        },
        onError: (error) => {
          addToast({
            type: "error",
            message: error?.response?.data?.message ?? "Could not save service.",
          });
        },
        onSettled: () => setIsSaving(false),
      });
    } catch (e) {
      setIsSaving(false);
      addToast({ type: "error", message: e.message });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = validateImageFileForUpload(file);
    if (!result.ok) {
      addToast({ type: "error", message: result.message });
      e.target.value = "";
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    setValue("icon", file);
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-green-500";

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 mt-10">
      <div className="bg-white rounded-lg w-full max-w-xl p-4 max-h-[80vh] min-h-[300px] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            {editData?.data ? "Edit Service" : "Add New Service"}
          </h2>
          <button
            onClick={() => {
              reset();
              setImagePreview(null);
              onClose();
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="p-4 space-y-4">
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

            <div>
              <label className="text-xs font-medium text-gray-500">
                Title ({activeLanguage === "en" ? "English" : "Arabic"})
              </label>
              <input
                {...register(`title.${activeLanguage}`)}
                placeholder={`Enter ${
                  activeLanguage === "en" ? "English" : "Arabic"
                } title`}
                className={inputClass}
                dir={activeLanguage === "ar" ? "rtl" : "ltr"}
                value={watch(`title.${activeLanguage}`)}
              />
              {errors.title?.[activeLanguage] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title[activeLanguage].message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">
                Description ({activeLanguage === "en" ? "English" : "Arabic"})
              </label>
              <textarea
                {...register(`description.${activeLanguage}`)}
                placeholder={`Enter ${
                  activeLanguage === "en" ? "English" : "Arabic"
                } description`}
                className={`${inputClass} resize-none h-24`}
                dir={activeLanguage === "ar" ? "rtl" : "ltr"}
                value={watch(`description.${activeLanguage}`)}
              />
              {errors.description?.[activeLanguage] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description[activeLanguage].message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">Icon</label>
              <p className="text-xs text-gray-500 mt-0.5 mb-1">
                {getImageUploadRulesSummary()}
              </p>
              <input
                type="file"
                accept="image/webp,image/jpeg,image/png,image/gif,.webp,.jpg,.jpeg,.png,.gif"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer w-full border border-gray-200 rounded-md px-3 py-2 flex items-center justify-between"
              >
                <span className="text-sm text-gray-700">
                  {imagePreview ? "Change Image" : "Choose Image"}
                </span>
                <ArrowUpTrayIcon className="w-5 h-5 text-gray-500" />
              </label>
            </div>

            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border border-gray-200"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-gray-500">
                Trigger Events
              </label>
              <Select
                isMulti
                options={triggerEvents?.data?.map((event) => ({
                  value: event._id,
                  label: event.name?.en,
                }))}
                value={triggerEvents?.data
                  ?.filter((event) => watch("triggerEvent").includes(event._id))
                  .map((event) => ({
                    value: event._id,
                    label: event.name?.en,
                  }))}
                onChange={(selectedOptions) =>
                  setValue(
                    "triggerEvent",
                    selectedOptions.map((option) => option.value)
                  )
                }
                className="basic-multi-select"
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
              {errors.triggerEvent && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.triggerEvent.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
            <StyledButton
              name="Cancel"
              onClick={() => {
                reset();
                setImagePreview(null);
                onClose();
              }}
              variant="tertiary"
              disabled={
                isSaving ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            />
            <StyledButton
              name={editData?.data ? "Update" : "Add Service"}
              type="submit"
              variant="primary"
              isLoading={
                isSaving ||
                createMutation.isPending ||
                updateMutation.isPending
              }
              loadingLabel={editData?.data ? "Saving…" : "Adding…"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddService;
