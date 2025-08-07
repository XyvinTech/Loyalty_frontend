import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import sdkApi from "../../api/sdk";
import OfferView from "../../components/User-Facing/OfferView";

const UserOffers = () => {
  const [activeCategory, setActiveCategory] = useState("");
  const [offerData, setOfferData] = useState([]);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const brandId = location?.state?.brand;
  const categoryId = location?.state?.category;
  const [rows] = useState(100);
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { customerID, apiKey } = useCustomerAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (categoryId) {
      setActiveCategory(categoryId);
    }
  }, [categoryId]);

  const fetchOfferData = async () => {
    try {
      setLoading(true);
      const offers = await sdkApi.getMerchantOffers(customerID, apiKey, {
        categoryId: activeCategory,
        page,
        limit: rows,
        ...(brandId && { brandId }), // include brandId if available
      });

      const newOffers = offers.data || [];

      setOfferData((prev) => [...prev, ...newOffers]);
      if (newOffers.length < rows) {
        // No more data
      } else {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await sdkApi.getCategories(customerID, apiKey, {
        limit: 100,
      });
      const allCategory = { _id: "", title: { en: "All" } };
      setCategories([allCategory, ...categoriesData.data]);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    if (customerID && apiKey) {
      fetchCategories();
    }
  }, [customerID, apiKey]);

  // Reset data when category changes
  useEffect(() => {
    setOfferData([]);
    setPage(1);
    setInitialLoading(true);
  }, [activeCategory]);

  // Fetch offers when dependencies change
  useEffect(() => {
    if (customerID && apiKey) {
      fetchOfferData();
    }
  }, [customerID, apiKey, activeCategory]);

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#404040]"></div>
    </div>
  );

  const NoOffersFound = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-6xl text-gray-300 mb-4">🔍</div>
      <h3 className="text-lg font-medium text-gray-600 mb-2">
        No offers found
      </h3>
      <p className="text-sm text-gray-500 text-center">
        Try selecting a different category or check back later for new offers.
      </p>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="flex justify-between items-center p-4 ">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="w-6 h-6 " />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[#404040] poppins-text">
              Offers
            </h1>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4 mt-3">
        <div
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories?.map((category) => (
            <button
              key={category?._id}
              onClick={() => setActiveCategory(category?._id)}
              className={`px-4 py-2 rounded-[10px] whitespace-nowrap text-sm font-medium transition-all duration-200 poppins-text ${
                activeCategory === category?._id
                  ? "bg-[#404040] text-white"
                  : "border border-[#404040] hover:bg-gray-200 text-[#404040]"
              }`}
            >
              {category?.title?.en}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2  w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE5C9] focus:border-transparent"
          />
        </div>
      </div>

      <div className="min-h-[400px]">
        {initialLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 gap-3 px-0 py-4">
            {offerData?.length === 0 ? (
              <NoOffersFound />
            ) : (
              offerData?.map((offer, index) => {
                const params = new URLSearchParams(searchParams);
                params.set("couponId", offer?._id);
                const couponUrl = `/user/coupon?${params.toString()}`;

                return (
                  <div key={index}>
                    <OfferView
                      onClick={() => navigate(couponUrl)}
                      product={offer}
                    />
                    {index !== offerData.length - 1 && (
                      <div
                        className="my-2"
                        style={{
                          borderBottom: "0.6px solid rgba(0, 0, 0, 0.15)",
                        }}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
        {loading && !initialLoading && (
          <div className="px-4 pb-4">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOffers;
