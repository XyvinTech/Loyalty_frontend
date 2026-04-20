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
import AddOffer from "../../components/ofters-and-promotions/AddOffer";
import { useOffers } from "../../hooks/useOffers";
import moment from "moment/moment";

const MerchantOffers = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeView, setActiveView] = useState("grid");
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { getMerchantOffers, offerById, deleteMerchantOffer } = useOffers();
  const { data: singleData } = offerById(data?.id);
  const [activeTab, setActiveTab] = useState("ALL");
  const {
    data: offerData,
    isLoading,
    isFetching,
    refetch,
    dataUpdatedAt,
  } = getMerchantOffers(
    activeTab === "ALL"
      ? { limit: itemsPerPage, page: currentPage, search: searchQuery }
      : {
          type: activeTab,
          limit: itemsPerPage,
          page: currentPage,
          search: searchQuery,
        }
  );
  const deleteMutation = deleteMerchantOffer();
  const offers = offerData?.data || [];

  const tabs = [
    { id: "ALL", label: "All" },
    { id: "DYNAMIC", label: "Dynamic" },
    { id: "ONE_TIME_LINK", label: "One Time Link" },
    { id: "PRE_GENERATED", label: "Pre Generated" },
  ];

  useEffect(() => {
    if (offerData?.total_count) {
      setTotalCount(offerData.total_count);
    }
  }, [offerData]);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Merchant Offers
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Last Updated: {new Date(dataUpdatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
          <RefreshButton onClick={() => refetch()} isLoading={isFetching} />
          <StyledSearchInput
            placeholder="Search"
            className="w-full sm:w-auto"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <StyledButton
            name={
              <>
                <span className="text-lg leading-none">+</span> Add Merchant
                Offer
              </>
            }
            onClick={() => {
              setData(null);
              setAddOpen(true);
            }}
          />
        </div>
      </div>

      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-medium focus:outline-none transition-all whitespace-nowrap
        ${
          activeTab === tab?.id
            ? "border-b-2 border-green-600 text-green-600"
            : "text-gray-500"
        }`}
            onClick={() => setActiveTab(tab?.id)}
          >
            {tab?.label}
          </button>
        ))}
      </div>

      <div className="flex justify-end items-center gap-4 pb-3 mt-2">
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
        <div className="mt-6 flex flex-col">
          <div
            className={`${
              activeView === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                : "space-y-3"
            }`}
          >
            {offers?.length > 0 ? (
              offers?.map((offer) =>
                activeView === "grid" ? (
                  <div
                    key={offer._id}
                    className="
    bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col min-h-[330px] transition
    hover:shadow-lg hover:border-green-200
  "
                  >
                    <div className="relative h-40 w-full bg-gray-50 flex items-center justify-center">
                      <img
                        src={offer.posterImage || offer.serviceCategory?.icon}
                        alt={offer.title?.en + " Image"}
                        className="h-28 w-28 object-cover rounded-xl border bg-white"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm border-green-200 border">
                          Priority: {offer.priority ?? "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 px-4 py-3">
                      <h3 className="font-bold text-base text-gray-900 mb-1 line-clamp-2">
                        {offer.title?.en}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {offer?.merchantId?.title?.en ||
                          offer.serviceCategory?.title ||
                          "Khedmah Service"}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="bg-blue-50 text-blue-700 font-semibold text-xs px-2 py-1 rounded shadow">
                          {offer.discountDetails?.type === "PERCENTAGE" &&
                            `${offer.discountDetails?.value}% OFF`}
                          {offer.discountDetails?.type === "FIXED" &&
                            `${offer.discountDetails?.value} OMR OFF`}
                          {offer.discountDetails?.type === "BUY-1-GET-1" &&
                            "Buy 1 Get 1 Free"}
                        </span>
                        <span className="bg-gray-50 text-gray-700 font-medium text-xs px-2 py-1 rounded shadow">
                          Points: {offer.redeemablePointsCount}
                        </span>
                        <span className="bg-gray-50 text-gray-700 font-medium text-xs px-2 py-1 rounded shadow">
                          Valid:{" "}
                          {moment(offer.validityPeriod?.endDate)
                            .locale("en")
                            .format("DD MMM YYYY")}
                        </span>
                      </div>
                      <div className="flex-grow" />
                      <div className="flex justify-end gap-1 mt-4">
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-700 transition"
                          onClick={() => handleEdit(offer?._id)}
                          title="Edit Offer"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 text-red-600 hover:text-red-700 transition"
                          onClick={() => handleDeleteOpen(offer?._id)}
                          title="Delete Offer"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={offer._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-wrap md:flex-nowrap items-center justify-between p-4 border border-gray-100"
                  >
                    <div className="flex items-center gap-4 min-w-0 w-full md:w-auto mb-3 md:mb-0">
                      <img
                        src={offer.posterImage || offer.serviceCategory?.icon}
                        alt={`${offer.title.en} Image`}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-50 p-1"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 text-sm truncate mb-1">
                          {offer.title?.en}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {offer.serviceCategory?.title || "Khedmah Service"}
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
                            {moment(offer.validityPeriod?.endDate)
                              .locale("en")
                              .format("DD MMM YYYY")}
                          </p>
                        </div>
                        <div className="text-center text-xs">
                          <span className="text-gray-500">Discount</span>
                          <p className="font-medium text-gray-900">
                            {offer.discountDetails?.type === "PERCENTAGE" && (
                              <>{offer.discountDetails?.value}%</>
                            )}
                            {offer.discountDetails?.type === "FIXED" && (
                              <>{offer.discountDetails?.value} OMR</>
                            )}
                            {offer.discountDetails?.type === "BUY-1-GET-1" && (
                              <>BOGO</>
                            )}
                          </p>
                        </div>
                        {/* Priority Display */}
                        <div className="text-center text-xs">
                          <span className="text-gray-500">Priority</span>
                          <p className="font-medium text-gray-900">
                            {offer.priority ?? "N/A"}
                          </p>
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
              )
            ) : (
              <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No offers found</p>
              </div>
            )}
          </div>

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
        </div>
      )}

      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        data="offer"
        confirmLoading={deleteMutation.isPending}
      />
      <AddOffer
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          setData(null);
        }}
        editData={singleData?.data}
        offerType={singleData?.data?.type}
      />
    </>
  );
};

export default MerchantOffers;
