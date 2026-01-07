import {
  ArrowUpTrayIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import StyledButton from "../../ui/StyledButton";
import useUiStore from "../../store/ui";
import { useRoleSettings } from "../../hooks/useRoleSettings";
import { useSubAdmin } from "../../hooks/useSubAdmin";

// Base schema without password validation (handled in onSubmit)
const baseAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(1, "Phone is required"),
  roleId: z.string().min(1, "Role is required"),
  password: z.string().optional(), // No validation - handled in onSubmit
});

const AddSubAdmin = ({ isOpen, onClose, onSuccess, editData }) => {
  const { useCreateSubAdmin, useUpdateSubAdmin, useAdminResetPassword } =
    useSubAdmin();
  const createMutation = useCreateSubAdmin();
  const updateMutation = useUpdateSubAdmin();
  const resetPasswordMutation = useAdminResetPassword();
  const { addToast } = useUiStore();
  const { useGetRoleSettings } = useRoleSettings();
  const { data: roleData } = useGetRoleSettings();
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [confirmResetPasswordValue, setConfirmResetPasswordValue] =
    useState("");
  const [resetError, setResetError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(baseAdminSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      roleId: "",
      password: "",
    },
  });
  useEffect(() => {
    if (editData) {
      const { name, email, phoneNumber, role } = editData || {};
      console.log("Setting form data for edit:", { name, email, phoneNumber, role });
      reset({
        name: name || "",
        email: email || "",
        phoneNumber: phoneNumber || "",
        roleId: role?._id || role || "",
        password: "",
      });
      setShowPasswordReset(false);
      setResetPasswordValue("");
      setConfirmResetPasswordValue("");
      setResetError("");
    } else {
      // Reset form when adding new user
      reset({
        name: "",
        email: "",
        phoneNumber: "",
        roleId: "",
        password: "",
      });
    }
  }, [editData, reset]);

  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data);
    const { password, ...rest } = data;

    if (!editData && !password) {
      addToast({
        type: "error",
        message: "Password is required",
      });
      return;
    }

    if (editData) {
      console.log("Updating user with:", { id: editData?._id, formData: rest });
      // For updates, send all form fields (password is excluded)
      updateMutation.mutate(
        { id: editData?._id, formData: rest },
        {
          onSuccess: (response) => {
            console.log("Update success:", response);
            addToast({ 
              type: "success", 
              message: response?.message || "User updated successfully" 
            });
            onSuccess?.();
            resetAndClose();
          },
          onError: (error) => {
            console.error("Update error:", error);
            const errorMessage = error?.response?.data?.message || 
                                error?.message || 
                                "Failed to update user";
            addToast({
              type: "error",
              message: errorMessage,
            });
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          ...rest,
          password,
        },
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
    }
  };

  const resetAndClose = () => {
    reset({
      name: "",
      email: "",
      phoneNumber: "",
      roleId: "",
      password: "",
    });
    setShowPasswordReset(false);
    setResetPasswordValue("");
    setConfirmResetPasswordValue("");
    setResetError("");
    onClose();
  };

  const handlePasswordReset = () => {
    if (!editData?._id) {
      return;
    }

    if (resetPasswordValue.length < 6) {
      setResetError("Password must be at least 6 characters.");
      return;
    }

    if (resetPasswordValue !== confirmResetPasswordValue) {
      setResetError("Passwords do not match.");
      return;
    }

    setResetError("");
    resetPasswordMutation.mutate(
      { id: editData._id, password: resetPasswordValue },
      {
        onSuccess: (response) => {
          addToast({
            type: "success",
            message: response?.message ?? "Password reset successfully",
          });
          setResetPasswordValue("");
          setConfirmResetPasswordValue("");
          setShowPasswordReset(false);
        },
        onError: (error) => {
          addToast({
            type: "error",
            message:
              error?.response?.data?.message ?? "Failed to reset password",
          });
        },
      }
    );
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
          {!editData && (
            <div>
              <label className={labelClass}>Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter Password"
                className={inputClass}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
          )}
          {editData && (
            <div className="space-y-4 rounded-md border border-gray-100 p-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">
                  Reset Password
                </h3>
                <p className="text-xs text-gray-500">
                  Set a temporary password for this user. They will be asked to
                  change it on their next login.
                </p>
              </div>
              <div>
                <label className={labelClass}>New Password</label>
                <input
                  type="password"
                  value={resetPasswordValue}
                  onChange={(event) => {
                    setResetPasswordValue(event.target.value);
                    setResetError("");
                  }}
                  placeholder="Enter new password"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Confirm Password</label>
                <input
                  type="password"
                  value={confirmResetPasswordValue}
                  onChange={(event) => {
                    setConfirmResetPasswordValue(event.target.value);
                    setResetError("");
                  }}
                  placeholder="Confirm new password"
                  className={inputClass}
                />
              </div>
              {resetError && (
                <p className="text-sm text-red-500">{resetError}</p>
              )}
              <div className="flex justify-end">
                <StyledButton
                  name={
                    resetPasswordMutation.isPending
                      ? "Updating..."
                      : "Reset Password"
                  }
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={resetPasswordMutation.isPending}
                  variant="secondary"
                />
              </div>
            </div>
          )}
          {/* Show validation errors summary */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm font-medium text-red-800 mb-2">
                Please fix the following errors:
              </p>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>
                    {field}: {error?.message || "Invalid value"}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <StyledButton
              name="Cancel"
              onClick={resetAndClose}
              variant="tertiary"
              disabled={createMutation.isPending || updateMutation.isPending}
            />
            <StyledButton
              name={
                editData
                  ? updateMutation.isPending
                    ? "Updating..."
                    : "Update User"
                  : createMutation.isPending
                  ? "Creating..."
                  : "Add User"
              }
              type="submit"
              variant="primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubAdmin;
