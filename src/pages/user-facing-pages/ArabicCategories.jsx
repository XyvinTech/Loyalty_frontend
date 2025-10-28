import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArabicProductCard from "../../components/User-Facing/ArabicProductCard";
import { useNavigationWithParams } from "../../utils/navigationUtils";
import { useGetCategories } from "../../app-store/categories";

const ArabicCategories = () => {
  const { navigateWithParams } = useNavigationWithParams();
  const [page, setPage] = useState(1);
  const [rows] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const {
    data: categories = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetCategories({
    page,
    limit: rows,
    ...(searchTerm && { search: searchTerm }),
  });


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    refetch();
  };


  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#404040]"></div>
    </div>
  );

  const NoCategoriesFound = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 col-span-2 alexandria-text">
      <div className="text-6xl text-gray-300 mb-4">📂</div>
      <h3 className="text-lg font-medium text-gray-600 mb-2">
        لم يتم العثور على فئات
      </h3>
      <p className="text-sm text-gray-500 text-center">
        تحقق لاحقاً لوجود فئات جديدة ومنتجات مميزة.
      </p>
    </div>
  );

  return (
    <div
      className="max-w-md min-h-screen bg-white flex flex-col justify-between alexandria-text"
      dir="rtl"
    >
      <div>
        <div className="flex justify-between items-center p-4">
          <div className="flex justify-between gap-2 w-full">
           <button onClick={() => navigate(-1)}>
              <ArrowRightIcon className="w-6 h-6" />
            </button>  <h1 className="text-2xl font-semibold text-[#404040] poppins-text">
              الفئات
            </h1>
           
          </div>
        </div>

        <div className="px-4 py-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
            <input
              type="text"
              placeholder="بحث"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE5C9] focus:border-transparent"
            />
          </div>
        </div>

        <div className="min-h-[400px]">
          {isLoading  ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 gap-3 px-4 py-4">
              {categories?.length === 0 ? (
                <NoCategoriesFound />
              ) : (
                categories?.map((category, index) => (
                  <ArabicProductCard
                    key={index}
                    product={category}
                    onClick={() =>
                      navigateWithParams("/user/offers/ar", {
                        state: { category: category?._id },
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
    </div>
  );
};

export default ArabicCategories;
