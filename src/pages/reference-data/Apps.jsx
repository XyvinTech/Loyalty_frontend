import React, { useMemo, useState } from "react";
import StyledSearchInput from "../../ui/StyledSearchInput";
import RefreshButton from "../../ui/RefreshButton";
import StyledTable from "../../ui/StyledTable";
import Loader from "../../ui/Loader";
import { useAppTypes } from "../../hooks/useAppTypes";
import StyledButton from "../../ui/StyledButton";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import DeleteModal from "../../ui/DeleteModal";
import useUiStore from "../../store/ui";
import AddApp from "../../components/reference-data/AddApp";

const Apps = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [data, setData] = useState(null);
  const { useGetAppTypes, useDeleteAppType, useGetAppTypeById } = useAppTypes();
  const { data: triggerAppData } = useGetAppTypeById(data?.id);

  const {
    data: appTypes,
    isLoading,
    isFetching,
    error,
    refetch,
    dataUpdatedAt,
  } = useGetAppTypes();
  const [addOpen, setAddOpen] = useState(false);
  const deleteMutation = useDeleteAppType();
  const { addToast } = useUiStore();
  const tableRows = useMemo(() => {
    const appList = appTypes?.data;
    if (!appList || appList?.length === 0) {
      return (
        <tr>
          <td
            colSpan="5"
            className="px-6 py-4 text-center text-gray-500 text-sm"
          >
            No data available
          </td>
        </tr>
      );
    }
    return appTypes?.data?.map((item) => (
      <tr key={item.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {item?.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <img src={item?.icon} alt="icon" className="w-6 h-6 object-contain" />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {item?.description}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <div className="flex items-center gap-2">
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
    ));
  }, [appTypes]);
  const handleEdit = (id) => {
    setData({ id });
    setAddOpen(true);
  };
  const handleDeleteOpen = async (id) => {
    setData(id);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    deleteMutation.mutate(data, {
      onSuccess: (response) => {
        addToast({
          type: "success",
          message: response?.message ?? "Deleted successfully.",
        });
        setDeleteOpen(false);
        setData(null);
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error?.response?.data?.message ?? "Delete failed.",
        });
      },
    });
  };
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          {" "}
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Apps
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Last Updated: {new Date(dataUpdatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
          <RefreshButton onClick={() => refetch()} isLoading={isFetching} />
{/* 
          <StyledSearchInput
            placeholder="Search"
            className="w-full sm:w-auto"
          /> */}
          <StyledButton
            name={
              <>
                <span className="text-lg leading-none">+</span> Add APP
              </>
            }
            onClick={() => {
              setData(null);
              setAddOpen(true);
            }}
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
          }}
        >
          <thead className="bg-gray-50 w-full">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Icon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableRows}
          </tbody>
        </StyledTable>
      )}
      <AddApp
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          setData(null);
        }}
        onSuccess={() => {
          setData(null);
        }}
        editData={triggerAppData}
      />
      <DeleteModal
        data={"App"}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        confirmLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default Apps;
