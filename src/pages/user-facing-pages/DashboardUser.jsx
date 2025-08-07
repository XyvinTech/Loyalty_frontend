import UserCard from "../../components/User-Facing/UserCard";
import bg from "../../assets/bg.png";
import OfferCard from "../../components/User-Facing/OfferCard";
import bronze from "../../assets/background.png";
import { data } from "../../assets/json/userData";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import sdkApi from "../../api/sdk";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import CouponCard from "../../components/User-Facing/CouponCard";
import silver from "../../assets/silver.png";
import gold from "../../assets/gold.png";
import AppButton from "../../ui/AppButton";
const DashboardUser = () => {
  const navigate = useNavigate();
  const [variant, setVariant] = useState("primary");
  const [offerData, setOfferData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tierColor, setTierColor] = useState("#FFE5C9");
  const { customerID, apiKey, customerData } = useCustomerAuth();
  const [backgroundImage, setBackgroundImage] = useState(bronze);
  useEffect(() => {
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
        const offers = await sdkApi.getMerchantOffers(customerID, apiKey);
        setOfferData(offers.data);
        const brandData = await sdkApi.getBrands(customerID, apiKey);
        setBrands(brandData.data);
        const categoriesData = await sdkApi.getCategories(customerID, apiKey);
        setCategories(categoriesData.data);
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
      }
    };

    fetchCustomerData();
  }, [customerID, apiKey, customerData]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative">
        <div
          className="rounded-b-2xl h-50"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
          }}
        ></div>
        <div className="absolute left-1/2 top-10 -translate-x-1/2 w-full px-4">
          <UserCard />
        </div>
      </div>

      <div className=" bg-white  rounded-t-3xl p-4 mt-10">
        <img src={bg} alt="Background decoration" />
        <div className="flex items-center justify-between mt-4 poppins-text mb-4">
          <h2 className="text-sm font-semibold ">Coupons</h2>

          <AppButton name={"View All Coupons"} variant={variant} />
        </div>
        <div
          className="flex space-x-3 overflow-x-auto scrollbar-hide"
          style={{
            scrollbarWidth: "auto",
            msOverflowStyle: "auto",
          }}
        >
          {data.map((item) => (
            <div key={item.id} className="min-w-[132px]">
              <CouponCard data={item} />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-6 poppins-text mb-4">
          <h2 className="text-sm font-semibold ">Brands</h2>
          <AppButton
            name={"View All Brands"}
            variant={variant}
            onClick={() => navigate("/user/brands")}
          />
        </div>
        <div
          className="flex space-x-3 overflow-x-auto scrollbar-hide"
          style={{
            scrollbarWidth: "auto",
            msOverflowStyle: "auto",
          }}
        >
          {brands?.slice(0, 5).map((item) => (
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
                  className="w-[64px] h-[64px] object-contain rounded-lg "
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-6 poppins-text mb-4">
          <h2 className="text-sm font-semibold ">Brand Offers</h2>
          <AppButton
            name={"View All Brand Offers"}
            variant={variant}
            onClick={() => navigate("/user/offers")}
          />
        </div>
        <div
          className="flex space-x-3 overflow-x-auto scrollbar-hide"
          style={{
            scrollbarWidth: "auto",
            msOverflowStyle: "auto",
          }}
        >
          {offerData?.slice(0, 5)?.map((offer) => (
            <div key={offer._id} className="min-w-[192px]">
              <OfferCard data={offer} tier={tierColor} />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-6 poppins-text mb-4">
          <h2 className="text-sm font-semibold ">Categories </h2>

          <AppButton
            name={"View All Categories"}
            variant={variant}
            onClick={() => navigate("/user/categories")}
          />
        </div>
        <div
          className="flex space-x-3 overflow-x-auto scrollbar-hide mb-4"
          style={{
            scrollbarWidth: "auto",
            msOverflowStyle: "auto",
          }}
        >
          {categories?.slice(0, 5)?.map((category) => (
            <div
              key={category?._id}
              onClick={() =>
                navigate("/user/offers", { state: { category: category?._id } })
              }
              className="flex flex-col items-center min-w-[89px] w-[89px]"
            >
              <div className="w-16 h-16 rounded-full  cusror-pointer overflow-hidden flex items-center justify-center mb-2">
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
