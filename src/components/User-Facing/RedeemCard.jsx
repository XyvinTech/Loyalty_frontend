import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import sdkApi from "../../api/sdk";
import { AppMainButton } from "../../ui/AppMainButton";
import { XMarkIcon, XCircleIcon } from "@heroicons/react/24/outline";

const RedeemCard = ({ onClose, image }) => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { customerID, apiKey } = useCustomerAuth();
  const [showPopup, setShowPopup] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const couponId = searchParams.get("couponId");
  const [transactionId, setTransactionId] = useState("");
  const customerName = searchParams.get("name");
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
      const res = await sdkApi.addRedeem(customerID, apiKey, {
        pin: code.join(""),
        couponId: couponId,
      });
      setTransactionId(res?.total_count?.transactionId || "");
      setShowPopup("success");
    } catch (e) {
      const msg = e?.data || "Failed to redeem points";
      setErrorMessage(msg);
      setShowPopup("error");
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
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-sm mx-4 text-center animate-fadeInUp relative border border-gray-100">
            <button
              onClick={() => {
                setShowPopup(null);
                setErrorMessage("");
                onClose();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-full p-2 transition-all duration-200 hover:scale-110"
              aria-label="Close popup"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            {showPopup === "success" ? (
              <>
                <div className="relative mb-8 mt-4 ">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-white text-4xl font-bold">✓</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-400 rounded-full animate-ping delay-300"></div>
                </div>

                <p className="font-medium text-sm text-gray-800 leading-6 alexandria-text px-2">
                  Hey {customerName || "Customer"},
                  <br />
                  Your coupon has been successfully redeemed 🎁
                  <br />
                  <span className="font-bold text-[#FF9900] bg-orange-50 px-2 py-1 rounded-md inline-block mt-2 mb-2">
                    Your Transaction ID: {transactionId || "---"}
                  </span>
                  <br />
                  Just show this message at the partner outlet and make the most
                  of the offer.
                  <br />
                  Check your{" "}
                  <span className="font-bold text-blue-600">
                    “History”
                  </span>{" "}
                  section in the app to view the details.
                  <br />
                  Thanks for being part of{" "}
                  <span className="font-bold text-green-600">Khedmah</span> –
                  keep using our services regularly to unlock even more awesome
                  offers!
                </p>
              </>
            ) : (
              <>
                <div className="relative mb-6 mt-4">
                  <XCircleIcon className="w-20 h-20 text-red-500 mx-auto animate-pulse" />
                </div>
                <p className="text-lg font-semibold text-red-600 alexandria-text px-2">
                  {errorMessage}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default RedeemCard;
