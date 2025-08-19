import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import sdkApi from "../../api/sdk";
import ArabicProductCard from "../../components/User-Facing/ArabicProductCard";

const ArabicBrands = () => {
  const [brands, setBrands] = useState([]);
  const [page, setPage] = useState(1);
  const [rows] = useState(100);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { customerID, apiKey } = useCustomerAuth();
  const navigate = useNavigate();

  const fetchData = async (reset = false) => {
    try {
      setLoading(true);
      const brandData = await sdkApi.getBrands(customerID, apiKey, {
        page: reset ? 1 : page,
        limit: rows,
        search: searchQuery,
      });

      const newBrands = brandData.data || [];
      if (reset) {
        setBrands(newBrands);
        setPage(2);
      } else {
        setBrands((prev) => [...prev, ...newBrands]);
        if (newBrands.length >= rows) {
          setPage((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("فشل في جلب بيانات العلامات التجارية:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (customerID && apiKey) {
      fetchData(true); // تحميل أولي
    }
  }, [customerID, apiKey, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(search);
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

  return (
    <div
      className="max-w-md mx-auto bg-white min-h-screen alexandria-text"
      dir="rtl"
    >
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="w-6 h-6" />
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
        {initialLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 gap-3 px-4 py-4">
            {brands?.length === 0 ? (
              <NoBrandsFound />
            ) : (
              brands?.map((brand, index) => (
                <ArabicProductCard
                  key={index}
                  product={brand}
                  onClick={() =>
                    navigate("/user/offers/ar", {
                      state: { brand: brand?._id },
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
  );
};

export default ArabicBrands;
