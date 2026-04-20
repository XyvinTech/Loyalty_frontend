import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import StyledButton from "../../ui/StyledButton";
import { useRoleSettings } from "../../hooks/useRoleSettings";
import useUiStore from "../../store/ui";
import { MagnifyingGlassCircleIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const permissionCategories = {
  "Customer Management": [
    "VIEW_CUSTOMERS",
    "EDIT_CUSTOMERS", 
    "DELETE_CUSTOMERS",
    "EXPORT_CUSTOMERS"
  ],
  "Points & Rewards": [
    "MANAGE_POINTS",
    "VIEW_POINTS_HISTORY",
    "ADJUST_POINTS",
    "MANAGE_CRITERIA"
  ],
  "Offers": [
    "CREATE_OFFERS",
    "EDIT_OFFERS",
    "DELETE_OFFERS"
  ],
  "Tiers & Redemptions": [
    "MANAGE_REDEMPTIONS",
    "MANAGE_TIERS",
    "VIEW_TIERS",
    "ASSIGN_TIERS"
  ],
  "Analytics & Reporting": [
    "VIEW_REPORTS",
    "EXPORT_REPORTS",
    "MANAGE_ANALYTICS",
    "VIEW_DASHBOARD"
  ],
  "Administration": [
    "MANAGE_ROLES",
    "MANAGE_ADMINS",
    "VIEW_AUDIT_LOGS",
    "MANAGE_SETTINGS",
    "MANAGE_APP_TYPES"
  ]
};


const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
  permissions: z.array(z.string()).nonempty("At least one permission is required"),
});

const AddRole = ({ isOpen, onClose, editData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  const { useCreateRoleSetting, useUpdateRoleSetting } = useRoleSettings();
  const createMutation = useCreateRoleSetting();
  const updateMutation = useUpdateRoleSetting();
  const { addToast } = useUiStore();
  const [searchTerm, setSearchTerm] = React.useState("");

  useEffect(() => {
    if (editData) {
      reset({
        name: editData?.data?.name || "",
        description: editData?.data?.description || "",
        permissions: editData?.data?.permissions || [],
      });
    }
  }, [editData, reset]);

  const onSubmit = async (formData) => {
    if (editData?.data) {
      updateMutation.mutate(
        { id: editData?.data?._id, roleSettingData: formData },
        {
          onSuccess: (data) => {
            addToast({ type: "success", message: data?.message });
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
        onSuccess: (data) => {
          addToast({ type: "success", message: data?.message });
          resetAndClose();
        },
        onError: (error) => {
          addToast({ type: "error", message: error?.response?.data?.message });
        },
      });
    }
  };

  const handleRoleChange = (role) => {
    const permissions = watch("permissions");
    setValue(
      "permissions",
      permissions.includes(role)
        ? permissions.filter((r) => r !== role)
        : [...permissions, role]
    );
  };

  const resetAndClose = () => {
    reset({
      name: "",
      description: "",
      permissions: [],
    });
    setSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  const selectedCount = watch("permissions").length;
  
  const filterPermissions = (permissions) => {
    if (!searchTerm) return permissions;
    return permissions.filter(permission => 
      permission.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  const inputClass =
  "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors";
const labelClass = "block text-xs font-medium text-gray-500 mb-1";
  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 mt-10 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-medium text-gray-800">
            {editData ? "Edit Role" : "Create New Role"}
          </h2>
          <button
            onClick={resetAndClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Role Name</label>
              <input 
                type="text" 
                {...register("name")} 
                className={inputClass}
                placeholder="e.g. Store Manager"
              />
              {errors.name && (
                <p className="mt-1 text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea 
                {...register("description")} 
                className={inputClass} 
                placeholder="Describe the purpose and responsibilities of this role"
              />
              {errors.description && (
                <p className="mt-1 text-red-500 text-xs">{errors.description.message}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-700">Permissions</label>
                <span className="text-xs text-gray-500">{selectedCount} selected</span>
              </div>
              
              <div className="relative mb-4">
                <MagnifyingGlassIcon  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search permissions..."
                  className={inputClass + " pl-10"}
                />
              </div>
              
              <div className="border border-gray-100 rounded-md overflow-hidden">
                {Object.entries(permissionCategories).map(([category, permissions]) => {
                  const filteredPermissions = filterPermissions(permissions);
                  if (filteredPermissions.length === 0) return null;
                  
                  return (
                    <div key={category} className="border-b border-gray-100 last:border-b-0">
                      <div className="bg-gray-50 px-4 py-2">
                        <h3 className="text-xs font-medium text-gray-700">{category}</h3>
                      </div>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredPermissions.map((permission) => (
                          <label 
                            key={permission} 
                            className="flex items-center space-x-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              className="rounded text-green-500 focus:ring-green-500"
                              checked={watch("permissions").includes(permission)}
                              onChange={() => handleRoleChange(permission)}
                            />
                            <span className="text-sm">{permission.replace(/_/g, ' ').toLowerCase()
                              .split(' ')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {errors.permissions && (
                <p className="mt-2 text-red-500 text-xs">{errors.permissions.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <StyledButton
              name="Cancel"
              onClick={resetAndClose}
              variant="tertiary"
              disabled={
                createMutation.isPending || updateMutation.isPending
              }
            />
            <StyledButton
              name={editData ? "Save Changes" : "Create Role"}
              type="submit"
              variant="primary"
              isLoading={
                createMutation.isPending || updateMutation.isPending
              }
              loadingLabel={editData ? "Saving…" : "Adding…"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRole;