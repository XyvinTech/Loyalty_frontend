import { useState } from "react";
import useUiStore from "../../store/ui";
import { useSearchParams } from "react-router-dom";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import sdkApi from "../../api/sdk";
import { AppMainButton } from "../../ui/AppMainButton";
import { XMarkIcon } from "@heroicons/react/24/outline";

const RedeemCard = ({ onClose, image }) => {
  const [code, setCode] = useState(["", "", "", ""]);
  const { addToast } = useUiStore();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { customerID, apiKey, customerData } = useCustomerAuth();
  const couponId = searchParams.get("couponId");
const handleChange = (index) => (e) => {
  const value = e.target.value;
  if (/^[a-zA-Z0-9]{0,1}$/.test(value)) {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 3) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  }
};

const handlePaste = (e) => {
  e.preventDefault();
  const pasted = e.clipboardData.getData("text/plain");
  if (/^[a-zA-Z0-9]{4}$/.test(pasted)) {
    setCode(pasted.split("").slice(0, 4));
    document.getElementById("code-3")?.focus();
  }
};

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await sdkApi.addRedeem(customerID, apiKey, {
        pin: code.join(""),
        couponId: couponId,
      });
      addToast({
        type: "success",
        message: "Points redeemed successfully",
      });
    } catch (e) {
      addToast({
        type: "error",
        message: e.data || "Failed to redeem points",
      });
    } finally {
      setLoading(false);
      onClose?.();
      setCode(["", "", "", ""]);
    }
  };
  return (
    <div className="bg-white rounded-2xl pb-6 relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-10  text-gray-600 rounded-full p-1 shadow hover:bg-gray-100"
        aria-label="Close"
      >
        <XMarkIcon style={{ width: "20px", height: "20px" }} />
      </button>
      <div className="relative pb-4">
        <img
          src={image}
          alt="Sneaker"
          className="w-full h-56 object-contain rounded-t-2xl"
        />
      </div>

      <div className="px-5 pt-5 text-[#2C2C2C] poppins-text">
        <h3 className="text-sm text-gray-500 font-medium">
          Request the merchant to enter the 4 digit code:
        </h3>
        <div className="grid grid-cols-4 gap-3 px-4 py-4">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              value={digit}
              onChange={handleChange(index)}
              onPaste={handlePaste}
              maxLength={1}
              inputMode="numeric"
              pattern="\d{1}"
              className="w-[48px] h-[58px] text-center text-lg font-semibold border border-[#FFD95E] rounded-[10px] bg-[#FFFBF5] focus:outline-none poppins-text"
            />
          ))}
        </div>
        <AppMainButton loading={loading} onClick={handleSubmit} name="Redeem" />
      </div>
    </div>
  );
};

export default RedeemCard;
