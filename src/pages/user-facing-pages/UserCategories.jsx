import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import ProductCard from "../../components/User-Facing/ProductCard";
import { useNavigate } from "react-router-dom";
import { useNavigationWithParams } from "../../utils/navigationUtils";
import { useGetCategories } from "../../app-store/categories";

const UserCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const { navigateWithParams } = useNavigationWithParams();

  const {
    data: categories = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetCategories({
    page,
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
    <div className="flex flex-col items-center justify-center py-12 px-4 col-span-2 poppins-text">
      <div className="text-6xl text-gray-300 mb-4">📂</div>
      <h3 className="text-lg font-medium text-gray-600 mb-2">
        No categories found
      </h3>
      <p className="text-sm text-gray-500 text-center">
        Check back later for new categories and products.
      </p>
    </div>
  );

  return (
    <div className="max-w-md min-h-screen bg-white flex flex-col justify-between poppins-text">
      <div>
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}>
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-semibold text-[#404040] poppins-text">
              Categories
            </h1>
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE5C9] focus:border-transparent"
            />
          </div>
        </div>
        <div className="min-h-[400px]">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 gap-3 px-4 py-4">
              {categories.length === 0 ? (
                <NoCategoriesFound />
              ) : (
                categories.map((category, index) => (
                  <ProductCard
                    key={index}
                    product={category}
                    onClick={() =>
                      navigateWithParams("/user/offers", {
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

export default UserCategories;
