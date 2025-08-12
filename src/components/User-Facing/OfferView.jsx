import { CalendarDateRangeIcon } from "@heroicons/react/24/outline";
import moment from "moment/moment";
import "moment/locale/ar"; // Import Arabic locale

const OfferView = ({ product, onClick }) => {
  // Set moment to Arabic locale
  moment.locale("ar");

  const getDiscountLabel = () => {
    if (!product?.discountDetails) return "";
    const { type, value } = product.discountDetails;
    return type === "FIXED" ? `خصم ${value} ريال عماني` : `${value}% خصم`;
  };

  return (
    <div
      className="flex items-center gap-4 bg-white p-4 cursor-pointer w-full max-w-xl"
      onClick={onClick}
    >
      <img
        src={product?.posterImage}
        alt={product?.title?.ar}
        className="w-20 h-20 rounded-md object-cover"
      />

      <div className="flex-1 text-right"> {/* Right aligned for Arabic */}
        <p className="text-base font-semibold text-black poppins-text">
          {product?.title?.ar}
        </p>
        <p className="text-sm text-gray-800 poppins-text">
          {product?.merchantId?.title?.ar }
        </p>
        <div className="flex items-center justify-end gap-1 text-[#0A7800] mt-1 text-sm">
          <CalendarDateRangeIcon className="w-4 h-4" />
          <span>
            {moment(product?.validityPeriod?.startDate).format("DD MMM YYYY")} –{" "}
            {moment(product?.validityPeriod?.endDate).format("DD MMM YYYY")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OfferView;
