import moment from "moment/moment";
import "moment/locale/ar";
import { useNavigate, useSearchParams } from "react-router-dom";

const ArabicOfferCard = ({ data, tier }) => {
  const {
    title,
    merchantId,
    description,
    posterImage,
    discountDetails,
    eligibilityCriteria,
    validityPeriod,
  } = data;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  params.set("couponId", data?._doc?._id);
  const couponUrl = `/user/coupon/ar?${params.toString()}`;

  moment.locale("ar");

  return (
    <div
      onClick={() => {
        navigate(couponUrl);
      }}
      className="rounded-[22px] bg-white transition-all duration-200 hover:shadow-lg cursor-pointer overflow-hidden alexandria-text"
      style={{
        border: `1px solid ${tier}`,
      }}
      dir="rtl"
    >
      <div className="relative mb-0 overflow-hidden">
        <img
          src={posterImage}
          alt={title}
          className="w-full h-45 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-3 right-3">
          {discountDetails?.type === "PERCENTAGE" && (
            <div className="px-3 py-1 rounded-full text-[10px] font-medium text-white shadow-xl bg-yellow-600  ">
              {`${discountDetails?.value}% خصم`}
            </div>
          )}
          {discountDetails?.type === "BUY-1-GET-1" && (
            <div className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xl bg-yellow-600  "></div>
          )}
        </div>
      </div>

      <div className="p-4 pt-3 flex flex-col h-[160px] justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-1 mb-1">
            {merchantId?.title?.ar || merchantId?.title?.en}
          </h3>
          <p className="text-[11px] text-gray-600 leading-relaxed line-clamp-2">
            {description?.ar || description?.en}
          </p>
        </div>

        <hr className="my-3 border-gray-200" />

        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-500 mb-1">
              {eligibilityCriteria?.userTypes?.length > 0
                ? `لـ ${eligibilityCriteria.userTypes
                    .map((type) => type.toLowerCase())
                    .join("، ")}`
                : "لمستخدمين محددين"}
            </div>
            <div className="text-[10px] font-medium text-gray-800">
              صالح حتى {moment(validityPeriod?.endDate).format("DD-MM-YYYY")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArabicOfferCard;
