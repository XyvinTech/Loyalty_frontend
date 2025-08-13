import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate, useSearchParams } from "react-router-dom";
import RedeemCard from "../../components/User-Facing/RedeemCard";
import { useEffect, useState } from "react";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import sdkApi from "../../api/sdk";
import { AppMainButton } from "../../ui/AppMainButton";
import moment from "moment";

const CouponDetails = () => {
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
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-6">
      <div className="relative bg-[#23243A]  pb-0">
        <button
          className="absolute top-4 left-4 bg-white w-8 h-8 bg-opacity-50 rounded-full p-0 flex items-center justify-center cursor-pointer"
          onClick={() => navigate("/user/offers")}
        >
          <ArrowLeftIcon className="w-3 h-3 text-black" />
        </button>
        <img
          src={offerData?.posterImage}
          alt="Sneaker"
          className="w-full h-md object-cover"
        />
      </div>

      <div className="px-5 pt-5 text-[#2C2C2C] poppins-text">
        <div className="flex items-center mb-2">
          <img
            src={offerData?.merchantId?.image}
            alt="Merchant"
            className="w-14 h-14 mr-2"
          />
          <span className="font-semibold text-lg ">
            {offerData?.merchantId?.title?.en}
          </span>
        </div>
        <div className="font-medium text-xl mb-1 ">{offerData?.title?.en}</div>

        <div>
          <div className="font-semibold text-base mb-2">Details</div>
          <ul className="text-xs list-disc pl-5 space-y-2">
            <li>
              <strong>Valid from:</strong>{" "}
              {moment(offerData?.validityPeriod?.startDate).locale("en").format(
                "DD-MM-YYYY"
              )}{" "}
              to{" "}
              {moment(offerData?.validityPeriod?.endDate).locale("en").format("DD-MM-YYYY")}
            </li>
            {offerData?.discountDetails?.type && (
              <li>
                <strong>Discount:</strong>{" "}
                {offerData.discountDetails.type === "PERCENTAGE"
                  ? `${offerData.discountDetails.value}% off`
                  : `Flat ${offerData.discountDetails.value} off`}
              </li>
            )}

            <li>
              <strong>Redemption Type:</strong> {offerData?.type}
            </li>

            {offerData?.usagePolicy?.frequency && (
              <li>
                <strong>Usage Limit:</strong>{" "}
                {offerData.usagePolicy.maxUsagePerPeriod}x per{" "}
                {offerData.usagePolicy.frequency.toLowerCase()}
              </li>
            )}
            {offerData?.merchantId?.description?.en && (
              <li className="break-words whitespace-pre-line text-xs leading-relaxed">
                <strong>Merchant Info:</strong>{" "}
                {offerData.merchantId.description.en}
              </li>
            )}
          </ul>
        </div>

        {offerData?.termsAndConditions?.length > 0 && (
          <div className="mt-4">
            <div className="text-xs italic text-gray-600 space-y-1">
              {offerData.termsAndConditions.map((term, idx) => (
                <p key={idx}>• {term}</p>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <p
            className="text-xs text-gray-500 cursor-pointer hover:underline"
            onClick={() => navigate("/user/terms-and-conditions")}
          >
            Terms and Conditions
          </p>
        </div>

        <AppMainButton
          name="Redeem Coupon"
          onClick={() => setShowRedeemCard(true)}
        />
      </div>

      {showRedeemCard && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-40 transition-opacity flex items-center justify-center">
          <div className="w-[86%] max-w-md rounded-2xl ">
            <RedeemCard
              onClose={() => setShowRedeemCard(false)}
              image={offerData?.posterImage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponDetails;
