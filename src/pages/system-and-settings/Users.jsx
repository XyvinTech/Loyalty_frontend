import {
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useMemo, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import DeleteModal from "../../ui/DeleteModal";
import ViewAdmin from "../../components/system-and-settings/ViewAdmin";
import StyledSearchInput from "../../ui/StyledSearchInput";
import StyledButton from "../../ui/StyledButton";
import RefreshButton from "../../ui/RefreshButton";
import Loader from "../../ui/Loader";
import { useSubAdmin } from "../../hooks/useSubAdmin";
import useUiStore from "../../store/ui";
import AddSubAdmin from "../../components/system-and-settings/AddSubAdmin";

const Users = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(10);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState(null);
  const { useGetSubAdminById, useDeleteSubAdmin, useGetSubAdmin } =
    useSubAdmin();
  const { data: triggerSubAdminData } = useGetSubAdminById(data?.id);
  const {
    data: subAdmins,
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
  } = useGetSubAdmin({
    limit: itemsPerPage,
    page: currentPage,
    search,
  });
  const deleteMutation = useDeleteSubAdmin();
  const { addToast } = useUiStore();
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return subAdmins?.data?.slice(startIndex, startIndex + itemsPerPage);
  }, [subAdmins?.data, currentPage, itemsPerPage]);
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };
  const handleEdit = (id) => {
    setData({ id });
    setAddOpen(true);
  };
  const handleDeleteOpen = async (id) => {
    setData(id);
    setDeleteOpen(true);
  };

  const handleSelectAll = () => {
    const allRowIds = paginatedData?.map((item) => item?._id) || [];
    if (selectedRows.length === allRowIds?.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allRowIds);
    }
  };
  const handleDelete = () => {
    deleteMutation.mutate(data, {
      onSuccess: (response) => {
        addToast({
          type: "success",
          message: response?.message,
        });
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      },
    });
    setDeleteOpen(false);
    setData(null);
  };
  const handleBulkDelete = async () => {
    if (!selectedRows.length) return;
    await Promise.all(
      selectedRows.map((id) =>
        deleteMutation.mutateAsync(id, {
          onSuccess: () => {
            addToast({
              type: "success",
              message: `Item deleted successfully!`,
            });
          },
          onError: (error) => {
            addToast({
              type: "error",
              message: error?.response?.data?.message,
            });
          },
        })
      )
    );

    setSelectedRows([]);
  };
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          {" "}
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            User Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage system users and their access
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-xs text-gray-500 mt-1">
            Last Updated: {new Date(dataUpdatedAt).toLocaleString()}
          </p>
          <RefreshButton
            onClick={() => {
              refetch();
            }}
            isLoading={isLoading}
          />
        </div>
      </div>{" "}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <StyledSearchInput placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-auto" />

        <div className="flex gap-3 ml-auto">
          <StyledButton
            name={
              <>
                <span className="text-lg leading-none">+</span> Add User
              </>
            }
            onClick={() => setAddOpen(true)}
          />
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <StyledTable
          paginationProps={{
            currentPage,
            totalCount,
            itemsPerPage,
            setCurrentPage,
            setItemsPerPage,
            selectedRows,
            handleBulkDelete,
          }}
        >
          <thead className="bg-gray-50 w-full">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    paginatedData?.length > 0 &&
                    paginatedData.every((item) =>
                      selectedRows?.includes(item._id)
                    )
                  }
                  className="cursor-pointer w-4 h-4 align-middle"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData?.length > 0 ? (
              paginatedData?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      onChange={() => handleRowSelect(item?._id)}
                      checked={selectedRows.includes(item?._id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item?.role?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-slate-400 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50"
                        onClick={() => {
                          setViewOpen(true);
                          setData({ id: item?._id });
                        }}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="text-slate-400 hover:text-green-700 p-1 rounded-lg hover:bg-green-50"
                        onClick={() => handleEdit(item?._id)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="text-slate-400 hover:text-red-700 p-1 rounded-lg hover:bg-red-50"
                        onClick={() => handleDeleteOpen(item?._id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-gray-500 text-sm"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </StyledTable>
      )}
      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        data={"User"}
        onConfirm={handleDelete}
      />
      <ViewAdmin
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        data={triggerSubAdminData?.data}
      />
      <AddSubAdmin
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          setData(null);
        }}
        editData={triggerSubAdminData?.data}
      />
    </>
  );
};

export default Users;
