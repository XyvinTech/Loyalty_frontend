import { useState, useEffect, useMemo } from "react";
import khedmah from "../../assets/Frame 92.png";
import { ChevronLeftIcon } from "@heroicons/react/24/outline"; // flipped icon
import sdkApi from "../../api/sdk";
import { getTierTheme, getNextTierInfo } from "./themes/tierThemes";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";

const ArabicCard = () => {
  const [user, setUser] = useState({
    name: "",
    membership: "Bronze",
    points: 0,
    nextTierPoints: 5000,
    avatar: null,
    requiredPoint: 0,
    nextTierName: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const progress = useMemo(() => {
    const total = user.points + user.requiredPoint;
    return total > 0 ? (user.points / total) * 100 : 100;
  }, [user.points, user.requiredPoint]);

  const { customerID, apiKey, isAuthenticated, updateCustomerData } =
    useCustomerAuth();

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!isAuthenticated || !customerID || !apiKey) {
        setError("Customer ID and API Key are required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await sdkApi.getCustomerDetails(customerID, apiKey);

        if (response.status === 200 && response.data) {
          const customerData = response.data;
          const tierName = customerData.customer_tier?.en || "Bronze";
          const currentPoints = customerData.point_balance || 0;
          const nextTierInfo = getNextTierInfo(tierName, currentPoints);
          const requiredPoint = Number(
            customerData.next_tier?.required_point || 0
          );
          setUser({
            name: customerData.name || "Customer",
            membership: tierName,
            points: currentPoints,
            nextTierPoints: nextTierInfo.nextTier
              ? nextTierInfo.pointsToNext
              : 0,
            avatar: null,
            requiredPoint,
            nextTierName: customerData.next_tier?.en || null,
          });
          updateCustomerData(customerData);
        } else {
          setError("Failed to fetch customer data");
        }
      } catch (err) {
        console.error("Error fetching customer data:", err);
        setError("Error loading customer information");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerID, apiKey, isAuthenticated, updateCustomerData]);

  const theme = getTierTheme(user.membership);
  const formatPoints = (num) => num.toLocaleString("en-US");

  if (!isAuthenticated) {
    return (
      <div
        className="bg-white rounded-2xl max-w-md mx-auto overflow-hidden p-6 text-right"
        dir="rtl"
      >
        <p className="text-red-500 text-sm font-medium">
          Customer ID and API Key are required
        </p>
        <p className="text-gray-500 text-xs mt-2">
          الرجاء الدخول باستخدام customerID و apiKey صالحين
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="bg-white rounded-2xl max-w-md mx-auto overflow-hidden p-6"
        dir="rtl"
      >
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-2 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-white rounded-2xl max-w-md mx-auto overflow-hidden p-6 text-right"
        dir="rtl"
      >
        <p className="text-red-500 text-sm">{error}</p>
        <p className="text-gray-500 text-xs mt-2">
          يرجى التحقق من بيانات الدخول أو المحاولة مرة أخرى
        </p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className={`relative ${theme.colors.background.card} rounded-2xl max-w-md mx-auto overflow-hidden ${theme.styles.cardBorder} ${theme.colors.shadow}`}
    >
      <div
        className={`absolute inset-0 ${theme.colors.background.overlay} opacity-30 rounded-2xl pointer-events-none`}
      ></div>

      <div className="relative z-10">
        <div className="flex justify-between items-center px-4 py-4" dir="rtl">
          <div className="flex flex-col items-end text-right">
            <h2
              className={`${theme.styles.welcomeText} text-sm font-semibold poppins-text mb-1`}
            >
              مرحباً
            </h2>
            <h1
              className="text-base font-semibold poppins-text capitalize"
              style={{ color: theme.colors.text.primary }}
            >
              {user.name} !
            </h1>
          </div>
          <img
            src={khedmah}
            alt="Khedmah Logo"
            className="w-11 h-11 rounded-lg"
          />
        </div>

        <div className="relative flex items-center px-4 mb-2">
          <div className="relative z-10 pr-20 flex flex-col text-right">
            <span
              className="font-semibold text-xl leading-none poppins-text"
              style={{ color: theme.colors.text.primary }}
            >
              {user.membership}
            </span>
            <div className="flex items-center justify-end mt-1 text-xs">
              <span
                className="poppins-text"
                style={{ color: theme.colors.text.muted }}
              >
                {formatPoints(user.points)}
              </span>
              <span
                className="mr-1 poppins-text"
                style={{ color: theme.colors.text.muted }}
              >
                نقاط
              </span>
              <ChevronLeftIcon
                className="w-4 h-4 mr-1"
                style={{ color: theme.colors.text.muted }}
              />
            </div>
          </div>
          <img
            src={theme.badge}
            alt={`${user.membership} Badge`}
            className={`absolute right-[-12px] top-1/3 -translate-y-1/2 w-29 h-29 z-0 ${theme.styles.badgeGlow}`}
          />
        </div>
        <div className="px-4 pb-4 text-right">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-[#E39C75] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-[#8E8E8E] text-[12px] poppins-text">
            {user?.requiredPoint === 0
              ? "أعلى مستوى تم الوصول إليه!"
              : `${user.requiredPoint} نقاط إلى ${user.nextTierName}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArabicCard;
