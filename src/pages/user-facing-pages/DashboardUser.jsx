import { useEffect, useState } from "react";
import UserCard from "../../components/User-Facing/UserCard";
import OfferCard from "../../components/User-Facing/OfferCard";
import bronze from "../../assets/background.png";
import { useNavigate } from "react-router-dom";
import sdkApi from "../../api/sdk";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import silver from "../../assets/silver.png";
import gold from "../../assets/gold.png";
import AppButton from "../../ui/AppButton";

// 👉 Simple Skeleton
const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>
);

const DashboardUser = () => {
  const navigate = useNavigate();
  const [variant, setVariant] = useState("primary");
  const [offerData, setOfferData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tierColor, setTierColor] = useState("#FFE5C9");
  const { customerID, apiKey, customerData } = useCustomerAuth();
  const [backgroundImage, setBackgroundImage] = useState(bronze);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDashboard(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showDashboard) return;

    const fetchCustomerData = async () => {
      try {
        const tier = customerData?.customer_tier?.en;
        switch (tier) {
          case "Bronze":
            setTierColor("#FFE5C9");
            setBackgroundImage(bronze);
            setVariant("bronze");
            break;
          case "Silver":
            setTierColor("#A4AAB4");
            setBackgroundImage(silver);
            setVariant("silver");
            break;
          case "Gold":
            setTierColor("#FFD700");
            setBackgroundImage(gold);
            setVariant("gold");
            break;
          default:
            setTierColor("#DF9872");
            setBackgroundImage(bronze);
        }

        const [offers, brandData, categoriesData] = await Promise.all([
          sdkApi.getMerchantOffers(customerID, apiKey, { limit: 20 }),
          sdkApi.getBrands(customerID, apiKey, { limit: 20 }),
          sdkApi.getCategories(customerID, apiKey, { limit: 20 }),
        ]);

        setOfferData(offers.data || []);
        setBrands(brandData.data || []);
        setCategories(categoriesData.data || []);
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
      }
    };

    fetchCustomerData();
  }, [customerID, apiKey, customerData, showDashboard]);

  if (!showDashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative">
        <div
          className="rounded-b-2xl h-50"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
          }}
        ></div>
        <div className="absolute left-1/2 top-10 -translate-x-1/2 w-full px-4">
          <UserCard streak />
        </div>
      </div>

      <div className="bg-white rounded-t-3xl p-4 mt-10">
        {/* Brands */}
        <div className="flex items-center justify-between mt-6 poppins-text mb-4">
          <h2 className="text-sm font-semibold">Brands</h2>
          <AppButton
            name={"View All Brands"}
            variant={variant}
            onClick={() => navigate("/user/brands")}
          />
        </div>
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
          {brands.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="min-w-[70px] mb-3">
                  <SkeletonBox className="w-[74px] h-[74px] rounded-[12px]" />
                </div>
              ))
            : brands.slice(0, 15).map((item) => (
                <div key={item?._id} className="min-w-[70px] mb-3">
                  <div
                    onClick={() =>
                      navigate("/user/offers", { state: { brand: item?._id } })
                    }
                    style={{ border: "2px solid rgba(0, 0, 0, 0.15)" }}
                    className="w-[74px] h-[74px] cursor-pointer flex items-center justify-center rounded-[12px] bg-white shadow-lg"
                  >
                    <img
                      src={item?.image}
                      alt={item?.name}
                      className="w-[64px] h-[64px] object-contain rounded-lg"
                    />
                  </div>
                </div>
              ))}
        </div>

        {/* Offers */}
        <div className="flex items-center justify-between mt-6 poppins-text mb-4">
          <h2 className="text-sm font-semibold">Brand Offers</h2>
          <AppButton
            name={"View All Brand Offers"}
            variant={variant}
            onClick={() => navigate("/user/offers")}
          />
        </div>
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
          {offerData.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBox
                  key={i}
                  className="min-w-[192px] h-[140px] rounded-xl"
                />
              ))
            : offerData.slice(0, 15).map((offer) => (
                <div key={offer._id} className="min-w-[192px]">
                  <OfferCard data={offer} tier={tierColor} />
                </div>
              ))}
        </div>

        {/* Categories */}
        <div className="flex items-center justify-between mt-6 poppins-text mb-4">
          <h2 className="text-sm font-semibold">Categories</h2>
          <AppButton
            name={"View All Categories"}
            variant={variant}
            onClick={() => navigate("/user/categories")}
          />
        </div>
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide mb-4">
          {categories.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center min-w-[89px] w-[89px]"
                >
                  <SkeletonBox className="w-16 h-16 rounded-full mb-2" />
                  <SkeletonBox className="w-12 h-3 rounded-md" />
                </div>
              ))
            : categories.slice(0, 15).map((category) => (
                <div
                  key={category?._id}
                  onClick={() =>
                    navigate("/user/offers", {
                      state: { category: category?._id },
                    })
                  }
                  className="flex flex-col items-center min-w-[89px] w-[89px]"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-2">
                    <img
                      src={category?.image}
                      alt={category?.title?.en}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] text-center poppins-text line-clamp-2 leading-tight h-[28px]">
                    {category?.title?.en}
                  </p>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
