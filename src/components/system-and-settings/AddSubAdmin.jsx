import {
  ArrowUpTrayIcon,
  XMarkIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import StyledButton from "../../ui/StyledButton";
import useUiStore from "../../store/ui";
import { useRoleSettings } from "../../hooks/useRoleSettings";
import { useSubAdmin } from "../../hooks/useSubAdmin";

const createAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(1, "Phone is required"),
  roleId: z.string().min(1, "Role is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const editAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(1, "Phone is required"),
  roleId: z.string().min(1, "Role is required"),
  password: z.string().optional().refine((val) => !val || val.length >= 8, {
    message: "Password must be at least 8 characters",
  }),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.password || data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const AddSubAdmin = ({ isOpen, onClose, onSuccess, editData }) => {
  const { useCreateSubAdmin, useUpdateSubAdmin } = useSubAdmin();
  const createMutation = useCreateSubAdmin();
  const updateMutation = useUpdateSubAdmin();
  const { addToast } = useUiStore();
  const { useGetRoleSettings } = useRoleSettings();
  const { data: roleData } = useGetRoleSettings();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editData ? editAdminSchema : createAdminSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      roleId: "",
      password: "",
      confirmPassword: "",
    },
  });
  useEffect(() => {
    if (editData) {
      const { name, email, phoneNumber, role } = editData || {};
      reset({
        name: name || "",
        email: email || "",
        phoneNumber: phoneNumber || "",
        roleId: role?._id || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [editData, reset]);

  const onSubmit = async (data) => {
    // Remove confirmPassword from the data sent to backend
    const { confirmPassword, ...formData } = data;
    
    // For edit mode, only include password if it's provided
    if (editData && !formData.password) {
      delete formData.password;
    }
    
    if (editData) {
      updateMutation.mutate(
        { id: editData?._id, formData: formData },
        {
          onSuccess: (response) => {
            addToast({ type: "success", message: response?.message });
            onSuccess?.();
            resetAndClose();
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
        onSuccess: (response) => {
          addToast({ type: "success", message: response?.message });
          onSuccess?.();
          resetAndClose();
        },
        onError: (error) => {
          addToast({ type: "error", message: error?.response?.data?.message });
        },
      });
    }
  };

  const resetAndClose = () => {
    reset({
      name: "",
      email: "",
      phoneNumber: "",
      roleId: "",
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  if (!isOpen) return null;
  const inputClass =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";
  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 mt-10">
      <div className="bg-white rounded-lg w-full max-w-md p-4 max-h-[80vh] min-h-[300px] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {editData ? "Edit User" : "Add User"}
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
            <input
              {...register("name")}
              type="text"
              placeholder="Enter Name"
              className={inputClass}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter Email"
              className={inputClass}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              {...register("phoneNumber")}
              type="text"
              placeholder="Enter Phone"
              className={inputClass}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>Role</label>
            <select
              {...register("roleId", { required: "Role is required" })}
              className={inputClass}
            >
              <option value="">Select Role</option>
              {roleData?.data?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.roleId && (
              <p className="text-red-500 text-xs mt-1">{errors.roleId.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className={labelClass}>
              {editData ? "New Password (leave empty to keep current)" : "Password"}
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder={editData ? "Enter new password (optional)" : "Enter password"}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
            {!editData && (
              <p className="text-xs text-gray-500 mt-1">
                This password will be shared with the user outside this app. User will be forced to change it on first login.
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className={labelClass}>
              {editData ? "Confirm New Password" : "Confirm Password"}
            </label>
            <div className="relative">
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder={editData ? "Confirm new password" : "Confirm password"}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <StyledButton
              name="Cancel"
              onClick={resetAndClose}
              variant="tertiary"
            />
            <StyledButton
              name={editData ? "Edit" : "Add User"}
              type="submit"
              variant="primary"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubAdmin;
