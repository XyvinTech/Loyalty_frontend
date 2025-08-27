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
  const {
    useGetPointsCriteria,
    useGetPointsCriteriaById,
    useDeletePointsCriteria,
  } = usePointsCriteria();
  const [Id, setId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { useGetAppTypes } = useAppTypes();
  const { data: appTypeData } = useGetAppTypes();
  const appTypes = appTypeData?.data;
  const [activeTab, setActiveTab] = useState("all");
  const deleteMutation = useDeletePointsCriteria();
  const {
    data: pointsCriteriaData,
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
  } = useGetPointsCriteria(activeTab === "all" ? {} : { appType: activeTab });

  const dynamicTabs = [
    { id: "all", label: "All" },
    ...(appTypes?.map((type) => ({
      id: type._id,
      label: type.name,
    })) || []),
  ];
  useEffect(() => {
    refetch();
  }, [activeTab]);

  const pointsCriteria = pointsCriteriaData?.data;
  const { data: pointsCriteriaById } = useGetPointsCriteriaById(Id);
  const { addToast } = useUiStore();
  const handleDelete = () => {
    deleteMutation.mutate(selected, {
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
    setSelected(null);
  };
  const handleDeleteOpen = (id) => {
    setSelected(id);
    setDeleteOpen(true);
  };
  const handleEdit = (id) => {
    setId(id);
    setOpen(true);
  };
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            {" "}
            <h1 className="text-2xl font-semibold text-gray-900">
              Points Criteria
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {" "}
              Last Updated: {new Date(dataUpdatedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <RefreshButton onClick={() => refetch()} isLoading={isLoading} />
            {/* <StyledSearchInput placeholder={"Search by name"} /> */}
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
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {dynamicTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 px-6 py-2 text-sm font-medium focus:outline-none transition-all whitespace-nowrap
        ${
          activeTab === tab.id
            ? "border-b-2 border-green-600 text-green-600"
            : "text-gray-500"
        }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

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
          </>
        )}
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
        />
      </div>
    </>
  );
};

export default PointsCriteria;
