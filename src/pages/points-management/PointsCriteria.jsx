import StyledSearchInput from "../../ui/StyledSearchInput";
import StyledButton from "../../ui/StyledButton";
import PointsCard from "../../ui/point-managememt/PointsCard";
import { useEffect, useState } from "react";
import RefreshButton from "../../ui/RefreshButton";
import Loader from "../../ui/Loader";
import { usePointsCriteria } from "../../hooks/usePointsCriteria";
import AddPointCriteria from "../../components/points-management/AddPointCriteria";
import PointsCriteriaView from "../../components/points-management/PointsCriteriaView";
import DeleteModal from "../../ui/DeleteModal";
import useUiStore from "../../store/ui";
import { useAppTypes } from "../../hooks/useAppTypes";

const PointsCriteria = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // ✅ define items per page
  const [searchQuery, setSearchQuery] = useState("");
  const [Id, setId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const {
    useGetPointsCriteria,
    useGetPointsCriteriaById,
    useDeletePointsCriteria,
  } = usePointsCriteria();
  const { useGetAppTypes } = useAppTypes();
  const { data: appTypeData } = useGetAppTypes();
  const appTypes = appTypeData?.data || [];

  const deleteMutation = useDeletePointsCriteria();

  const {
    data: pointsCriteriaData,
    isLoading,
    isFetching,
    refetch,
    dataUpdatedAt,
  } = useGetPointsCriteria({
    appType: activeTab === "all" ? undefined : activeTab,
    limit: itemsPerPage,
    page: currentPage,
    search: searchQuery,
  });

  useEffect(() => {
    if (pointsCriteriaData?.total_count) {
      setTotalCount(pointsCriteriaData.total_count);
    }
  }, [pointsCriteriaData]);

  // 🔹 Refetch when tab, search, or page changes
  // useEffect(() => {
  //   refetch();
  // }, [activeTab, searchQuery, currentPage]);

  const pointsCriteria = pointsCriteriaData?.data || [];
  const { data: pointsCriteriaById } = useGetPointsCriteriaById(Id);

  const { addToast } = useUiStore();

  const handleDelete = () => {
    deleteMutation.mutate(selected, {
      onSuccess: (response) => {
        addToast({
          type: "success",
          message: response?.message ?? "Deleted successfully.",
        });
        refetch();
        setDeleteOpen(false);
        setSelected(null);
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error?.response?.data?.message || "Delete failed",
        });
      },
    });
  };

  const handleDeleteOpen = (id) => {
    setSelected(id);
    setDeleteOpen(true);
  };

  const handleEdit = (id) => {
    setId(id);
    setOpen(true);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Points Criteria
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Last Updated: {new Date(dataUpdatedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <RefreshButton onClick={() => refetch()} isLoading={isFetching} />
            <StyledSearchInput
              placeholder="Search"
              className="w-full sm:w-auto"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // reset to page 1 on new search
              }}
            />
            <StyledButton
              onClick={() => setOpen(true)}
              name={
                <>
                  <span className="text-lg leading-none">+</span>
                  Add Points Criteria
                </>
              }
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: "all", label: "All" },
            ...appTypes.map((t) => ({ id: t._id, label: t.name })),
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-6 py-2 text-sm font-medium focus:outline-none transition-all whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500"
                }`}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {pointsCriteria.map((criteria) => (
                <PointsCard
                  onClick={() => {
                    setId(criteria?._id);
                    setIsModalOpen(true);
                  }}
                  key={criteria._id}
                  criteria={criteria}
                  onEdit={() => handleEdit(criteria._id)}
                  onDelete={() => handleDeleteOpen(criteria?._id)}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <nav className="flex flex-wrap items-center gap-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage <= 1}
                  className={`px-3 py-1 rounded-lg transition-all text-xs ${
                    currentPage <= 1
                      ? "text-gray-500 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  Previous
                </button>

                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages || 1}
                </p>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage >= totalPages}
                  className={`px-3 py-1 rounded-lg transition-all text-xs ${
                    currentPage >= totalPages
                      ? "text-gray-500 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          </>
        )}

        {/* Modals */}
        <PointsCriteriaView
          id={Id}
          onClose={() => {
            setIsModalOpen(false);
            setId(null);
          }}
          open={isModalOpen}
        />
        <AddPointCriteria
          isOpen={open}
          onClose={() => {
            setOpen(false);
            setId(null);
          }}
          editData={pointsCriteriaById?.data}
        />
        <DeleteModal
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          data={"Points Criteria"}
          confirmLoading={deleteMutation.isPending}
        />
      </div>
    </>
  );
};

export default PointsCriteria;
