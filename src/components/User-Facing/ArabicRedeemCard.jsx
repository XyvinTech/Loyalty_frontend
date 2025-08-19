import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import sdkApi from "../../api/sdk";
import { AppMainButton } from "../../ui/AppMainButton";
import { XMarkIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const ArabicRedeemCard = ({ onClose, image }) => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { customerID, apiKey } = useCustomerAuth();
  const [showPopup, setShowPopup] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
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
      setShowPopup("success");
      setTimeout(() => {
        setShowPopup(null);
        onClose?.();
      }, 2000);
    } catch (e) {
      const msg = e?.data || "Failed to redeem points";
      setErrorMessage(msg);
      setShowPopup("error");
      setTimeout(() => {
        setShowPopup(null);
      }, 2500);
    } finally {
      setLoading(false);
      setCode(["", "", "", ""]);
    }
  };

  return (
    <div className="bg-white rounded-2xl pb-6 relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-10 text-gray-600 rounded-full p-1 shadow hover:bg-gray-100"
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
        <h3 className="text-sm text-gray-500 font-medium text-right">
          طلب من التاجر إدخال الرمز السري المكون من 4 أرقام
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
        <AppMainButton
          loading={loading}
          onClick={handleSubmit}
          name="استبدال"
        />
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-30 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center animate-fadeInUp">
            {showPopup === "success" ? (
              <>
                <CheckCircleIcon className="w-16 h-16 text-green-500 mb-3 animate-bounce" />
                <p className="text-lg font-semibold text-gray-800">
                  تم الاستبدال بنجاح!
                </p>
              </>
            ) : (
              <>
                <XCircleIcon className="w-16 h-16 text-red-500 mb-3 animate-pulse" />
                <p className="text-lg font-semibold text-red-600">
                  {errorMessage}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArabicRedeemCard;
