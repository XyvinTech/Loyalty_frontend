import React, { use, useEffect, useState } from "react";
import StyledButton from "../../ui/StyledButton";
import useUiStore from "../../store/ui";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppTypes } from "../../hooks/useAppTypes";
import { useCustomers } from "../../hooks/useCustomers";
import { useTiers } from "../../hooks/useTiers";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  app_type: z.array(z.string()).optional(),
  tier: z.string().optional(),
});

const AddCustomer = ({ isOpen, onClose, editData }) => {
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
      email: "",
      phone: "",
      app_type: [],
      tier: "",
    },
  });

  const { useCreateCustomer, useUpdateCustomer } = useCustomers();
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const { addToast } = useUiStore();
  const { useGetAppTypes } = useAppTypes();
  const { data: appTypes } = useGetAppTypes();
  const { useGetTiers } = useTiers();
  const { data: tiers } = useGetTiers();

  const tierOptions =
    tiers?.data?.map((tier) => ({
      value: tier._id,
      label: tier?.name?.en,
    })) || [];

  useEffect(() => {
    if (editData) {
      reset({
        name: editData?.data?.name,
        email: editData?.data?.email,
        phone: editData?.data?.phone,
        app_type: editData?.data?.app_type?.map((item) => item._id) || [],
        tier: editData?.data?.tier?._id || "",
      });
    }
  }, [editData, reset]);

  const onSubmit = async (data) => {
    if (editData) {
      updateMutation.mutate(
        {
          id: editData?.data?._id,
          customerData: data,
        },
        {
          onSuccess: (data) => {
            addToast({
              type: "success",
              message: data?.message,
            });
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
      createMutation.mutate(data, {
        onSuccess: (data) => {
          addToast({
            type: "success",
            message: data?.message,
          });
          resetAndClose();
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

  const resetAndClose = () => {
    reset({
      name: "",
      email: "",
      phone: "",
      app_type: [],
      tier: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1";

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 mt-10">
      <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {editData ? "Edit" : "Add Customer"}
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
            <label className={labelClass}>Name</label>
            <input {...register("name")} className={inputClass} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input {...register("email")} className={inputClass} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Phone</label>
            <input {...register("phone")} className={inputClass} />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>App Type</label>
            <Select
              isMulti
              options={appTypes?.data?.map((e) => ({
                value: e._id,
                label: e.name,
              }))}
              value={appTypes?.data
                ?.filter((e) => watch("app_type").includes(e?._id))
                .map((e) => ({ value: e._id, label: e.name }))}
              onChange={(selectedOptions) =>
                setValue(
                  "app_type",
                  selectedOptions.map((option) => option.value)
                )
              }
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
            {errors.app_type && (
              <p className="text-red-500 text-sm">{errors.app_type.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Tier (Optional)</label>
            <Select
              isClearable
              options={tierOptions}
              value={tierOptions.find(option => option.value === watch("tier")) || null}
              onChange={(selectedOption) =>
                setValue("tier", selectedOption ? selectedOption.value : "")
              }
              placeholder="Select a tier..."
              className="basic-single-select"
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
            {errors.tier && (
              <p className="text-red-500 text-sm">{errors.tier.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <StyledButton
              name="Cancel"
              onClick={resetAndClose}
              variant="tertiary"
            />
            <StyledButton
              name={editData ? "Update" : "Add Customer"}
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

export default AddCustomer;