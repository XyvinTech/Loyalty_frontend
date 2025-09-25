import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import sdkApi from "../../api/sdk";
import { AppMainButton } from "../../ui/AppMainButton";
import moment from "moment";
import ArabicRedeemCard from "../../components/User-Facing/ArabicRedeemCard";
const ArabicCouponDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [offerData, setOfferData] = useState([]);
  const { customerID, apiKey } = useCustomerAuth();
  const couponId = searchParams.get("couponId");
  const [showRedeemCard, setShowRedeemCard] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferData = async () => {
      try {
        setLoading(true);
        const offers = await sdkApi.getCouponId(couponId, customerID, apiKey);
        setOfferData(offers.data);
      } catch (err) {
        console.error("Error fetching offer data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOfferData();
  }, [customerID, apiKey]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-sm">جارٍ التحميل...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-6 alexandria-text">
      <div className="relative bg-[#23243A]  pb-0">
        <img
          src={offerData?.posterImage}
          alt="صورة العرض"
          className="w-full h-md object-cover"
        />{" "}
        <button
          className="absolute top-4 right-4 bg-white w-8 h-8 bg-opacity-50 rounded-full p-0 flex items-center justify-center cursor-pointer"
          onClick={() => navigate("/user/offers/ar")}
        >
          <ArrowRightIcon className="w-3 h-3 text-black" />
        </button>
      </div>

      <div className="px-5 pt-5 text-[#2C2C2C] alexandria-text" dir="rtl">
        <div className="flex items-center mb-2">
          <img
            src={offerData?.merchantId?.image}
            alt="الشركة"
            className="w-14 h-14 ml-2"
          />
          <span className="font-semibold text-lg  ">
            {offerData?.merchantId?.title?.ar}
          </span>
        </div>
        <div className="font-medium text-xl mb-1 ">{offerData?.title?.ar}</div>

        <div>
          <div className="font-semibold text-base mb-2">التفاصيل</div>
          <ul className="text-xs list-disc pr-5 space-y-2">
            <li>
              <strong>صالح من:</strong>{" "}
              {moment(offerData?.validityPeriod?.startDate)
                .locale("ar")
                .format("DD MMMM YYYY")}{" "}
              إلى{" "}
              {moment(offerData?.validityPeriod?.endDate)
                .locale("ar")
                .format("DD MMMM YYYY")}
            </li>

            {offerData?.merchantId?.description?.ar && (
              <li className="break-words whitespace-pre-line text-xs leading-relaxed">
                <strong>تفاصيل التاجر</strong>{" "}
                {offerData.merchantId.description.ar}
              </li>
            )}
          </ul>
        </div>

        {offerData?.termsAndConditions?.length > 0 && (
          <div className="mt-4">
            <div className="text-xs italic text-gray-600 space-y-1" dir="ltr">
              {offerData.termsAndConditions.map((term, idx) => (
                <p key={idx}>• {term}</p>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <p
            className="text-xs text-gray-500 cursor-pointer hover:underline"
            onClick={() => navigate("/user/terms-and-conditions/ar")}
          >
            الشروط والأحكام
          </p>
        </div>

        {offerData?.is_eligible === true ? (
          <AppMainButton
            name="استرداد القسيمة"
            onClick={() => setShowRedeemCard(true)}
          />
        ) : (
          <AppMainButton
            name="قم بالترقية للاستفادة من هذا العرض"
            disabled={true}
          />
        )}
      </div>

      {showRedeemCard && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-40 transition-opacity flex items-center justify-center">
          <div className="w-[86%] max-w-md rounded-2xl ">
            <ArabicRedeemCard
              onClose={() => setShowRedeemCard(false)}
              image={offerData?.posterImage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArabicCouponDetail;
