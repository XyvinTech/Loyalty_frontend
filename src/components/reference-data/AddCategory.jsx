import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  XMarkIcon,
  ArrowUpTrayIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import StyledButton from "../../ui/StyledButton";
import { useCategory } from "../../hooks/useCategory";
import useUiStore from "../../store/ui";
import uploadApi from "../../api/upload";
import {
  validateImageFileForUpload,
  getImageUploadRulesSummary,
} from "../../utils/validateImageFile";

const schema = z.object({
  title: z.object({
    en: z.string().min(1, "English title is required"),
    ar: z.string().optional(),
  }),
  image: z.any(),
  description: z.object({
    en: z.string().min(5, "English description must be at least 5 characters"),
    ar: z.string().optional(),
  }),
  priority: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Priority must be a number")
  ),
});

const AddCategory = ({ isOpen, onClose, editData }) => {
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: { en: "", ar: "" },
      image: "",
      description: { en: "", ar: "" },
      priority: 0,
    },
  });

  const { useCreateCategory, useUpdateCategory } = useCategory();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const { addToast } = useUiStore();

  useEffect(() => {
    if (editData) {
      setValue(
        "title.en",
        editData?.data?.title?.en || editData?.data?.title || ""
      );
      setValue("title.ar", editData?.data?.title?.ar || "");
      setValue("image", editData?.data?.image || "");
      setValue(
        "description.en",
        editData?.data?.description?.en || editData?.data?.description || ""
      );
      setValue("description.ar", editData?.data?.description?.ar || "");
      setValue("priority", editData?.data?.priority || 0);
      setImagePreview(editData?.data?.image);
    }
  }, [editData, setValue]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      let imageUrl = data.image;
      const file = watch("image");
      if (file instanceof File) {
        const uploadResponse = await uploadApi.uploadImage(file);
        imageUrl = uploadResponse.data?.url;
      }

      const formDataToSubmit = { ...data, image: imageUrl };

      const action = editData ? updateMutation : createMutation;
      const payload = editData
        ? { id: editData.data._id, formData: formDataToSubmit }
        : formDataToSubmit;

      action.mutate(payload, {
        onSuccess: (data) => {
          addToast({
            type: "success",
            message: data?.message ?? "Category saved successfully.",
          });
          reset({
            title: { en: "", ar: "" },
            image: "",
            description: { en: "", ar: "" },
            priority: 0,
          });
          setImagePreview(null);
          onClose();
        },
        onError: (error) => {
          addToast({
            type: "error",
            message: error?.response?.data?.message ?? "Could not save category.",
          });
        },
        onSettled: () => setIsSaving(false),
      });
    } catch (error) {
      setIsSaving(false);
      addToast({ type: "error", message: error.message });
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
    setValue("image", file);
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-green-500";

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 mt-10">
      <div className="bg-white rounded-lg w-full max-w-xl p-4 max-h-[80vh] min-h-[300px] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            {editData ? "Edit Category" : "Add New Category"}
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

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="flex border rounded overflow-hidden mb-2">
              <button
                type="button"
                onClick={() => setActiveLanguage("en")}
                className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-1 ${
                  activeLanguage === "en"
                    ? "bg-green-50 text-green-700"
                    : "bg-white text-gray-500"
                }`}
              >
                <GlobeAltIcon className="w-4 h-4" />
                English
              </button>
              <button
                type="button"
                onClick={() => setActiveLanguage("ar")}
                className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-1 ${
                  activeLanguage === "ar"
                    ? "bg-green-50 text-green-700"
                    : "bg-white text-gray-500"
                }`}
              >
                <GlobeAltIcon className="w-4 h-4" />
                Arabic
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">
                Title ({activeLanguage === "en" ? "English" : "Arabic"})
              </label>
              <input
                {...register(`title.${activeLanguage}`)}
                className={inputClass}
                value={watch(`title.${activeLanguage}`)}
                dir={activeLanguage === "ar" ? "rtl" : "ltr"}
              />
              {errors.title?.[activeLanguage] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title[activeLanguage].message}
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
              <div>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-gray-500">
                Description ({activeLanguage === "en" ? "English" : "Arabic"})
              </label>
              <textarea
                {...register(`description.${activeLanguage}`)}
                className={inputClass}
                rows="4"
                value={watch(`description.${activeLanguage}`)}
                dir={activeLanguage === "ar" ? "rtl" : "ltr"}
              />
              {errors.description?.[activeLanguage] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description[activeLanguage].message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                Priority
              </label>
              <input
                {...register("priority")}
                className={inputClass}
                type="number"
                value={watch("priority")}
              />
              {errors.priority && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.priority.message}
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
              name={editData ? "Update" : "Add Category"}
              type="submit"
              variant="primary"
              isLoading={
                isSaving ||
                createMutation.isPending ||
                updateMutation.isPending
              }
              loadingLabel={editData ? "Saving…" : "Adding…"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
