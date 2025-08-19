import { CalendarDateRangeIcon } from "@heroicons/react/24/outline";
import moment from "moment/moment";
moment.locale("en");
const OfferView = ({ product, onClick }) => {
  const getDiscountLabel = () => {
    if (!product?.discountDetails) return "";
    const { type, value } = product.discountDetails;
    return type === "FIXED" ? `OMR ${value} off` : `${value}% off`;
  };
  return (
    <div
      className="flex items-center gap-4 bg-white p-4 cursor-pointer w-full max-w-xl"
      onClick={onClick}
    >
      <div className="relative w-20 h-20">
        <img
          src={product?.posterImage}
          alt={product?.title?.en}
          className="w-20 h-20 rounded-md object-cover"
        />

        {product?.merchantId?.image && (
          <img
            src={product?.merchantId?.image}
            alt={product?.merchantId?.title?.en}
            className="absolute top-1 left-1 w-[37px] h-[37px] rounded bg-black/15 p-[0.6px] object-contain shadow"
          />
        )}
      </div>
      <div className="flex-1">
        <p className="text-base font-semibold text-black poppins-text">
          {product?.title?.en}
        </p>
        <p className="text-sm text-gray-800 poppins-text">
          {product?.merchantId?.title?.en || "Biriyani Bowl Restaurent"}
        </p>
        <div className="flex items-center gap-1 text-[#0A7800] mt-1 text-sm">
          <CalendarDateRangeIcon className="w-4 h-4" />
          <span>
            {moment(product?.validityPeriod?.startDate)
              .locale("en")
              .format("DD MMM YYYY")}{" "}
            –{" "}
            {moment(product?.validityPeriod?.endDate)
              .locale("en")
              .format("DD MMM YYYY")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OfferView;
