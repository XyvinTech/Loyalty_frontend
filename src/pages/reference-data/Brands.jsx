import {
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import StyledButton from "../../ui/StyledButton";
import StyledSearchInput from "../../ui/StyledSearchInput";
import { useEffect, useMemo, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import DeleteModal from "../../ui/DeleteModal";
import RefreshButton from "../../ui/RefreshButton.jsx";
import Loader from "../../ui/Loader.jsx";
import AddBrand from "../../components/reference-data/AddBrand.jsx";
import { useBrands } from "../../hooks/useBrand.js";
import useUiStore from "../../store/ui.js";

const Brands = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const { useGetBrandById, useDeleteBrand, useGetBrands } = useBrands();
  const { data: triggerBrandData } = useGetBrandById(data?.id);

  const {
    data: brands,
    isLoading,
    isFetching,
    error,
    refetch,
    dataUpdatedAt,
  } = useGetBrands({
    limit: itemsPerPage,
    page: currentPage,
    search: searchQuery,
  });
  const deleteMutation = useDeleteBrand();
  const { addToast } = useUiStore();

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  useEffect(() => {
    if (brands?.total_count !== undefined) {
      setTotalCount(brands.total_count);
    }
  }, [brands?.total_count]);
  const paginatedData = useMemo(() => brands?.data || [], [brands?.data]);
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
          message: response?.message ?? "Brand deleted successfully.",
        });
        setDeleteOpen(false);
        setData(null);
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error?.response?.data?.message ?? "Could not delete brand.",
        });
      },
    });
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
            Brands
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {" "}
            Last Updated: {new Date(dataUpdatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
          <RefreshButton
            onClick={() => {
              refetch();
            }}
            isLoading={isFetching}
          />
           <StyledSearchInput
            placeholder="Search"
            className="w-full sm:w-auto"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          {/* <StyledButton
            name={
              <>
                <ArrowDownTrayIcon className="w-4 h-4" /> Export{" "}
              </>
            }
            variant="download"
          /> */}
          <StyledButton
            name={
              <>
                <span className="text-lg leading-none">+</span> Add Brand
              </>
            }
            onClick={() => {
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
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData?.length > 0 ? (
              paginatedData?.map((item) => (
                <tr key={item?._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      onChange={() => handleRowSelect(item._id)}
                      checked={selectedRows?.includes(item?._id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item?.title?.en}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                    {item?.description?.en}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={item?.image}
                      alt="icon"
                      className="w-6 h-6 object-contain"
                    />
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
      <AddBrand
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          setData(null);
        }}
        editData={triggerBrandData}
      />
      <DeleteModal
        data={"Brand"}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        confirmLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default Brands;
