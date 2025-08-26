import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import ProductCard from "../../components/User-Facing/ProductCard";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import sdkApi from "../../api/sdk";
import { useNavigationWithParams } from "../../utils/navigationUtils";

const UserCategories = () => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [rows] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { customerID, apiKey } = useCustomerAuth();
  const navigate = useNavigate();
   const { navigateWithParams } = useNavigationWithParams();

  const fetchData = async (reset = false) => {
    try {
      setLoading(true);
      const categoryData = await sdkApi.getCategories(customerID, apiKey, {
        page: reset ? 1 : page,
        limit: rows,
        search: searchTerm,
      });

      const newCategories = categoryData.data || [];
      if (reset) {
        setCategories(newCategories);
      } else {
        setCategories((prev) => [...prev, ...newCategories]);
      }

      if (newCategories.length >= rows && !reset) {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (customerID && apiKey) {
      fetchData(true); // initial load or reset with search
    }
  }, [customerID, apiKey, searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
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
          {initialLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 gap-3 px-4 py-4">
              {categories?.length === 0 ? (
                <NoCategoriesFound />
              ) : (
                categories?.map((category, index) => (
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

          {loading && !initialLoading && (
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
