import { useEffect, useState } from "react";
import {
  ArrowDownTrayIcon,
  Squares2X2Icon,
  ListBulletIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import RefreshButton from "../../ui/RefreshButton";
import StyledButton from "../../ui/StyledButton";
import StyledSearchInput from "../../ui/StyledSearchInput";
import DeleteModal from "../../ui/DeleteModal";
import Loader from "../../ui/Loader";
import AddKhedmahOfter from "../../components/ofters-and-promotions/AddKhedmahOfter";
import { useKhedmahOffer } from "../../hooks/useKhedmahOffer";
import useUiStore from "../../store/ui";
import moment from "moment";

const KhedmahOffer = () => {
  const [activeView, setActiveView] = useState("grid");
  const [addOpen, setAddOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [data, setData] = useState(null);
  const { getKhedmahOffers, khedmahofferById, deleteKhedmahOffer } =
    useKhedmahOffer();
  const deleteMutation = deleteKhedmahOffer();
  const { data: khedmahoffer } = khedmahofferById(data?.id);
  const {
    data: offerData,
    isLoading,
    isFetching,
    refetch,
    dataUpdatedAt,
  } = getKhedmahOffers();
  const offers = offerData?.data || [];
  const { addToast } = useUiStore();

  useEffect(() => {
    if (offers?.data?.total) {
      setTotalCount(offers.data.total);
    }
  }, [offers]);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Khedmah Offers
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Last Updated: {new Date(dataUpdatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
          <RefreshButton isLoading={isFetching} onClick={() => refetch()} />
          {/* <StyledSearchInput
            placeholder="Search offers"
            className="w-full sm:w-auto"
          />
          <StyledButton
            name={
              <>
                <ArrowDownTrayIcon className="w-4 h-4" /> Export
              </>
            }
            variant="download"
          /> */}
          <StyledButton
            name={
              <>
                <span className="text-lg leading-none">+</span> Add Offer
              </>
            }
            onClick={() => {
              setAddOpen(true);
            }}
          />
        </div>
      </div>

      <div className="flex justify-end items-center gap-4 pb-3">
        <button
          className={`p-2 rounded-md transition ${
            activeView === "grid"
              ? "bg-green-50 text-green-600"
              : "bg-gray-100 text-gray-600"
          }`}
          onClick={() => setActiveView("grid")}
        >
          <Squares2X2Icon className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-md transition ${
            activeView === "list"
              ? "bg-green-50 text-green-600"
              : "bg-gray-100 text-gray-600"
          }`}
          onClick={() => setActiveView("list")}
        >
          <ListBulletIcon className="w-5 h-5" />
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-6">
          {offers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No offers available. Add your first offer!
              </p>
            </div>
          ) : (
            <div
              className={`${
                activeView === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "space-y-3"
              }`}
            >
              {offers.map((offer) =>
                activeView === "grid" ? (
                  <div
                    key={offer._id}
                    className="bg-white rounded-lg shadow hover:shadow-md transition p-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={offer.posterImage || offer.serviceCategory?.icon}
                        alt={`${offer.title?.en} Image`}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-50 p-1"
                      />
                      <div className="min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm truncate">
                          {offer.title?.en}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {offer.serviceCategory?.title?.en }
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm my-3">
                      <div className="text-xs">
                        <span className="text-gray-500">Points Required</span>
                        <p className="font-medium text-gray-900">
                          {offer.redeemablePointsCount}
                        </p>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-500">Valid Until</span>
                        <p className="font-medium text-gray-900">
                          {moment(offer.validityPeriod?.endDate).locale("en").format(
                            "DD MMM YYYY"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs my-2">
                      <div>
                        <span className="text-gray-500">Discount</span>
                        <p className="font-medium text-gray-900">
                          {offer.discountDetails?.value}%{" "}
                          {offer.discountDetails?.type.toLowerCase()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Usage</span>
                        <p className="font-medium text-gray-900">
                          Max {offer.usagePolicy?.maxUsagePerPeriod} per{" "}
                          {offer.usagePolicy?.frequency.toLowerCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          offer?.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {offer?.isActive ? "Active" : "Inactive"}
                      </span>
                      <div className="flex gap-3">
                        <button
                          className="text-gray-600 hover:text-gray-900 transition"
                          onClick={() => handleEdit(offer?._id)}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700 transition"
                          onClick={() => handleDeleteOpen(offer?._id)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={offer._id}
                    className="bg-white rounded-lg shadow hover:shadow-md transition flex flex-wrap md:flex-nowrap items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-4 min-w-0 w-full md:w-auto mb-3 md:mb-0">
                      <img
                        src={offer.posterImage || offer.serviceCategory?.icon}
                        alt={`${offer.title?.en} Image`}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-50 p-1"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 text-sm truncate">
                          {offer.title?.en}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {offer.serviceCategory?.title?.en}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                      <div className="flex flex-wrap md:flex-nowrap items-center gap-4 sm:text-sm">
                        <div className="text-center text-xs">
                          <span className="text-gray-500">Points</span>
                          <p className="font-medium text-gray-900">
                            {offer.redeemablePointsCount}
                          </p>
                        </div>
                        <div className="text-center text-xs">
                          <span className="text-gray-500">Valid Until</span>
                          <p className="font-medium text-gray-900">
                            {moment(offer.validityPeriod?.endDate).locale("en").format(
                              "DD MMM YYYY"
                            )}
                          </p>
                        </div>
                        <div className="text-center text-xs">
                          <span className="text-gray-500">Discount</span>
                          <p className="font-medium text-gray-900">
                            {offer.discountDetails?.value}%
                          </p>
                        </div>
                        <div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              offer?.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {offer?.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3 ml-auto md:ml-4">
                        <button
                          className="text-gray-600 hover:text-gray-900 transition"
                          onClick={() => handleEdit(offer?._id)}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700 transition"
                          onClick={() => handleDeleteOpen(offer?._id)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <nav className="flex flex-wrap items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                Page {currentPage} of {Math.ceil(totalCount / itemsPerPage)}
              </p>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(totalCount / itemsPerPage))
                  )
                }
                disabled={currentPage >= Math.ceil(totalCount / itemsPerPage)}
                className={`px-3 py-1 rounded-lg transition-all text-xs ${
                  currentPage >= Math.ceil(totalCount / itemsPerPage)
                    ? "text-gray-500 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                Next
              </button>
            </nav>
          </div>
          <DeleteModal
            isOpen={deleteOpen}
            onClose={() => {
              setDeleteOpen(false);
              // setSelectedOffer(null);
            }}
            onConfirm={handleDelete}
            data={"offer"}
            confirmLoading={deleteMutation.isPending}
          />

          <AddKhedmahOfter
            isOpen={addOpen}
            onClose={() => {
              setAddOpen(false);
              setData(null);
            }}
            editData={khedmahoffer?.data}
          />
        </div>
      )}
    </>
  );
};

export default KhedmahOffer;
