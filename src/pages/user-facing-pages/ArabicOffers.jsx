import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ArabicOfferView from "../../components/User-Facing/ArabicOfferView";
import { useGetCategories } from "../../app-store/categories";
import { useGetOffers } from "../../app-store/offers";

const ArabicOffers = () => {
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const brandId = location?.state?.brand;
  const categoryId = location?.state?.category;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategories({});
  const allCategories = [{ _id: "", title: { en: "All" } }, ...categories];

  useEffect(() => {
    if (categoryId) setActiveCategory(categoryId);
  }, [categoryId]);
  const {
    data: offers = [],
    isLoading,
    isFetching,
  } = useGetOffers({
    ...(activeCategory && {
      categoryId: activeCategory,
    }),
    page,
    ...(searchQuery && { search: searchQuery }),
    ...(brandId && { brandId }),
  });
  const handleSearchChange = useCallback(
    (value) => {
      if (searchTimeout) clearTimeout(searchTimeout);
      const timeout = setTimeout(() => setSearchQuery(value), 500);
      setSearchTimeout(timeout);
    },
    [searchTimeout]
  );

  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchTimeout]);
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#404040]"></div>
    </div>
  );

  const NoOffersFound = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 alexandria-text">
      <div className="text-6xl text-gray-300 mb-4">🔍</div>
      <h3 className="text-lg font-medium text-gray-600 mb-2">
        لا توجد عروض متاحة
      </h3>
      <p className="text-sm text-gray-500 text-center">
        {searchQuery
          ? `لا توجد عروض لكلمة "${searchQuery}". جرب البحث بكلمة أخرى.`
          : "حاول اختيار فئة مختلفة أو تحقق لاحقًا لعرض عروض جديدة."}
      </p>
    </div>
  );

  return (
    <div
      className="max-w-md mx-auto bg-white min-h-screen alexandria-text"
      dir="rtl"
    >
      <div className="flex justify-between items-center p-4">
        <div className="flex justify-between w-full gap-2">
          <button onClick={() => navigate(-1)}>
            <ArrowRightIcon className="w-6 h-6" />
          </button>{" "}
          <h1 className="text-2xl font-semibold text-[#404040] alexandria-text">
            العروض
          </h1>
        </div>
      </div>
      <div className="px-4 mb-4 mt-3">
        {categoriesLoading ? (
          <LoadingSpinner />
        ) : (
          <div
            className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {allCategories?.map((category) => (
              <button
                key={category?._id}
                onClick={() => setActiveCategory(category?._id)}
                className={`px-4 py-2 rounded-[10px] whitespace-nowrap text-sm font-medium transition-all duration-200 alexandria-text ${
                  activeCategory === category?._id
                    ? "bg-[#404040] text-white"
                    : "border border-[#404040] hover:bg-gray-200 text-[#404040]"
                }`}
              >
                {category?.title?.ar}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن العروض أو المتاجر..."
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE5C9] focus:border-transparent"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 gap-3 px-0 py-4">
            {offers?.length === 0 ? (
              <NoOffersFound />
            ) : (
              offers?.map((offer, index) => {
                const params = new URLSearchParams(searchParams);
                params.set("couponId", offer?._doc?._id);
                const couponUrl = `/user/coupon/ar?${params.toString()}`;

                return (
                  <div key={index}>
                    <ArabicOfferView
                      onClick={() => navigate(couponUrl)}
                      product={offer}
                    />
                    {index !== offers.length - 1 && (
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
        {isFetching && !isLoading && (
          <div className="px-4 pb-4">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArabicOffers;
