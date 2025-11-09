import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import StyledButton from "../../ui/StyledButton";
import useUiStore from "../../store/ui";
import { useAuth } from "../../hooks/useAuth";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ChangePassword = () => {
  const { addToast } = useUiStore();
  const { useChangePassword } = useAuth();
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (formValues) => {
    changePasswordMutation.mutate(
      {
        oldPassword: formValues.currentPassword,
        newPassword: formValues.newPassword,
      },
      {
        onSuccess: (response) => {
          addToast({
            type: "success",
            message: response?.message ?? "Password updated successfully",
          });
          reset();
        },
        onError: (error) => {
          addToast({
            type: "error",
            message:
              error?.response?.data?.message ?? "Failed to update password",
          });
        },
      }
    );
  };

  const inputClass =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Change Password
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your password to keep your account secure.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm"
      >
        <div>
          <label className={labelClass}>Current Password</label>
          <input
            type="password"
            {...register("currentPassword")}
            className={inputClass}
            placeholder="Enter current password"
          />
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>New Password</label>
          <input
            type="password"
            {...register("newPassword")}
            className={inputClass}
            placeholder="Enter new password"
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Confirm New Password</label>
          <input
            type="password"
            {...register("confirmPassword")}
            className={inputClass}
            placeholder="Re-enter new password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <StyledButton
          type="submit"
          name={
            changePasswordMutation.isPending ? "Updating..." : "Change Password"
          }
          disabled={changePasswordMutation.isPending}
        />
      </form>
    </div>
  );
};

export default ChangePassword;

