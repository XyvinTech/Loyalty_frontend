import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import StyledButton from "../../ui/StyledButton";
import useUiStore from "../../store/ui";
import { useAppTypes } from "../../hooks/useAppTypes";
import uploadApi from "../../api/upload";
import {
  validateImageFileForUpload,
  getImageUploadRulesSummary,
} from "../../utils/validateImageFile";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  // icon: z.string().url("Invalid image URL"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  isActive: z.boolean(),
});

const AddApp = ({ isOpen, onClose, onSuccess, editData }) => {
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
      name: "",
      icon: "",
      description: "",
      isActive: true,
    },
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { useCreateAppType, useUpdateAppType } = useAppTypes();
  const createMutation = useCreateAppType();
  const updateMutation = useUpdateAppType();
  const { addToast } = useUiStore();

  useEffect(() => {
    if (editData) {
      reset({
        name: editData?.data?.name || "",
        icon: editData?.data?.icon || "",
        description: editData?.data?.description || "",
        isActive: editData?.data?.status ?? true,
      });
      setImagePreview(editData?.data?.icon || null);
    }
  }, [editData, reset]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      let imageUrl = data.icon;
      const file = watch("icon");
      if (file instanceof File) {
        const uploadResponse = await uploadApi.uploadImage(file);
        imageUrl = uploadResponse.data?.url;
      }
      const submitData = {
        ...data,
        isActive: data.isActive ?? true,
        icon: imageUrl,
      };

      if (editData) {
        if (!editData?.data?._id) {
          setIsSaving(false);
          addToast({
            type: "error",
            message: "Cannot update: Missing App ID",
          });
          return;
        }

        updateMutation.mutate(
          {
            id: editData.data._id,
            appTypeData: submitData,
          },
          {
            onSuccess: (res) => {
              addToast({
                type: "success",
                message: res?.message || "App updated successfully",
              });
              onSuccess?.();
              resetAndClose();
            },
            onError: (error) => {
              console.error("Update Error:", error);
              addToast({
                type: "error",
                message:
                  error?.response?.data?.message || "Failed to update app",
              });
            },
            onSettled: () => setIsSaving(false),
          }
        );
      } else {
        createMutation.mutate(submitData, {
          onSuccess: (res) => {
            addToast({
              type: "success",
              message: res?.message || "App created successfully",
            });
            onSuccess?.();
            resetAndClose();
          },
          onError: (error) => {
            console.error("Create Error:", error);
            addToast({
              type: "error",
              message: error?.response?.data?.message || "Failed to create app",
            });
          },
          onSettled: () => setIsSaving(false),
        });
      }
    } catch (error) {
      setIsSaving(false);
      console.error("Submission Error:", error);
      addToast({
        type: "error",
        message: "An unexpected error occurred",
      });
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

  const resetAndClose = () => {
    setImagePreview(null);
    reset({
      name: "",
      icon: "",
      description: "",
      isActive: true,
    });
    onClose();
  };

  if (!isOpen) return null;
  const inputClass =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";
  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 mt-10">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {editData ? "Edit App" : "Add App"}
          </h2>
          <button
            onClick={resetAndClose}
            className="text-gray-400 hover:text-gray-500 cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input {...register("name")} className={inputClass} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Icon</label>
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
            {errors.icon && (
              <p className="text-red-500 text-sm">{errors.icon.message}</p>
            )}
          </div>

          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}
          <div>
            <label className={labelClass}>Description</label>
            <textarea {...register("description")} className={inputClass} />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <StyledButton
              name="Cancel"
              onClick={resetAndClose}
              variant="tertiary"
              disabled={
                isSaving ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            />
            <StyledButton
              name={editData ? "Update" : "Add App"}
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

export default AddApp;
