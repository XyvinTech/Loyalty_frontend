import React, { useState } from "react";
import { useRoleSettings } from "../../hooks/useRoleSettings";
import useUiStore from "../../store/ui";
import StyledButton from "../../ui/StyledButton";
import AddRole from "../../components/system-and-settings/AddRole";
import DeleteModal from "../../ui/DeleteModal";
import RefreshButton from "../../ui/RefreshButton";
import Loader from "../../ui/Loader";
import { PencilIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const Role = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const { useGetRoleSettings, useDeleteRoleSetting, useGetRoleSettingById } = useRoleSettings();

  const { data: roleData } = useGetRoleSettingById(selectedRole?.id);
  const {
    data: roleSettings,
    isLoading,
    isFetching,
    refetch,
    dataUpdatedAt,
  } = useGetRoleSettings();

  const deleteMutation = useDeleteRoleSetting();
  const { addToast } = useUiStore();

  const handleDeleteOpen = (id) => {
    setSelectedRole(id);
    setDeleteOpen(true);
  };

  const handleEdit = (id) => {
    setSelectedRole({ id });
    setAddOpen(true);
  };

  const handleDelete = () => {
    deleteMutation.mutate(selectedRole, {
      onSuccess: (response) => {
        addToast({
          type: "success",
          message: response?.message ?? "Role deleted successfully.",
        });
        setDeleteOpen(false);
        setSelectedRole(null);
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error?.response?.data?.message ?? "Could not delete role.",
        });
      },
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getPermissionStyle = (permission) => {
    const permissionLower = permission.toLowerCase();
    
    if (permissionLower.includes('view')) {
      return "bg-blue-50 text-blue-600";
    } else if (permissionLower.includes('edit')) {
      return "bg-green-50 text-green-600";
    } else if (permissionLower.includes('delete')) {
      return "bg-red-50 text-red-600";
    } else if (permissionLower.includes('create') || permissionLower.includes('add')) {
      return "bg-purple-50 text-purple-600";
    } else if (permissionLower.includes('manage')) {
      return "bg-amber-50 text-amber-600";
    } else if (permissionLower.includes('export')) {
      return "bg-indigo-50 text-indigo-600";
    } else if (permissionLower.includes('adjust')) {
      return "bg-teal-50 text-teal-600";
    } else if (permissionLower.includes('assign')) {
      return "bg-pink-50 text-pink-600";
    } else {
      return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h1 className="text-2xl font-medium text-gray-800">Roles & Permissions</h1>
          <p className="text-xs text-gray-500 mt-1">
            Last Updated: {formatDate(dataUpdatedAt)}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <RefreshButton onClick={refetch} isLoading={isFetching} />
          <StyledButton
            name={
             <> <span className="flex items-center gap-2">
                +
              </span> New Role</>
            }
            onClick={() => setAddOpen(true)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {roleSettings?.data?.map((role) => (
            <div
              key={role?._id}
              className="bg-white rounded-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-sm hover:border-green-100"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">{role?.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{role?.description}</p>
                </div>
                <div className="flex space-x-1">
                  <button
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-colors"
                    onClick={() => handleEdit(role?._id)}
                    aria-label="Edit role"
                  >
                   <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-50 transition-colors"
                    onClick={() => handleDeleteOpen(role?._id)}
                    aria-label="Delete role"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {role?.permissions?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Permissions</p>
                  <div className="flex flex-wrap gap-2">
                    {role?.permissions?.map((permission, index) => (
                     <span
                     key={index}
                     className={`inline-flex items-center px-3 py-1 text-xs rounded-lg ${getPermissionStyle(permission)}`}
                   >
                     {permission.toLowerCase()}
                   </span>
                   
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {roleSettings?.data?.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p>No roles found. Create your first role to get started.</p>
            </div>
          )}
        </div>
      )}

      <AddRole
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          setSelectedRole(null);
        }}
        editData={roleData}
      />
      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        data={"Role"}
        confirmLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Role;