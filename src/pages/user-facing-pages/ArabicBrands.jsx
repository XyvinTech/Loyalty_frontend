import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArabicProductCard from "../../components/User-Facing/ArabicProductCard";
import { useNavigationWithParams } from "../../utils/navigationUtils";
import { useGetBrands } from "../../app-store/brands";
import { safeConsole } from "../../utils/errorHandler";

const ArabicBrands = () => {
  const { navigateWithParams } = useNavigationWithParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const {
    data: brands = [],
    isLoading,
    isFetching,
    refetch,
    error,
  } = useGetBrands({
    page,
    ...(searchQuery && { search: searchQuery }),
  });

  // Log any errors for debugging
  useEffect(() => {
    if (error) {
      safeConsole.error("Error loading brands:", error);
    }
  }, [error]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(search);
    refetch();
  };
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#404040]"></div>
    </div>
  );

  const NoBrandsFound = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 col-span-2 alexandria-text">
      <div className="text-6xl text-gray-300 mb-4">🏢</div>
      <h3 className="text-lg font-medium text-gray-600 mb-2">
        لم يتم العثور على علامات تجارية
      </h3>
      <p className="text-sm text-gray-500 text-center">
        تحقق لاحقًا لعرض علامات تجارية جديدة وعروض مميزة.
      </p>
    </div>
  );

  // Show error state if query fails
  if (error && !isLoading && !brands.length) {
    return (
      <div
        className="max-w-md mx-auto bg-white min-h-screen alexandria-text"
        dir="rtl"
      >
        <div className="flex justify-between items-center p-4">
          <div className="flex justify-between gap-2 w-full">
            <button onClick={() => navigate(-1)}>
              <ArrowRightIcon className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-[#404040] alexandria-text">
                العلامات التجارية
              </h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="text-6xl text-gray-300 mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            تعذر تحميل العلامات التجارية
          </h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            يرجى التحقق من الاتصال والمحاولة مرة أخرى
          </p>
          <button
            onClick={() => refetch()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-md mx-auto bg-white min-h-screen alexandria-text"
      dir="rtl"
    >
      <div className="flex justify-between items-center p-4">
        <div className="flex justify-between gap-2 w-full">
          <button onClick={() => navigate(-1)}>
            <ArrowRightIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[#404040] alexandria-text">
              العلامات التجارية
            </h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث"
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE5C9] focus:border-transparent"
            />
          </div>
        </form>
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 gap-3 px-4 py-4">
            {brands?.length === 0 ? (
              <NoBrandsFound />
            ) : (
              brands?.map((brand, index) => (
                <ArabicProductCard
                  key={brand?._id || index}
                  product={brand}
                  onClick={() =>
                    navigateWithParams("/user/offers/ar", {
                      state: { brand: brand?._id },
                    })
                  }
                />
              ))
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

export default ArabicBrands;
