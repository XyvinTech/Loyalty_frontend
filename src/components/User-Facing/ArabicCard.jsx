import { useState, useEffect, useMemo } from "react";
import khedmah from "../../assets/Frame 92.png";
import { ChevronLeftIcon } from "@heroicons/react/24/outline"; // flipped icon
import sdkApi from "../../api/sdk";
import { getTierTheme, getNextTierInfo } from "./themes/tierThemes";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import moment from "moment";
import "moment/locale/ar"; // Arabic locale
moment.locale("ar");
import {
  CheckCircleIcon,
  FireIcon,
  CalendarDaysIcon,
  FlagIcon,
} from "@heroicons/react/24/solid";
moment.updateLocale("ar", {
  months: [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ],
});
const ArabicCard = ({ streak }) => {
  const [user, setUser] = useState({
    name: "",
    membership: "Bronze",
    points: 0,
    nextTierPoints: 5000,
    avatar: null,
    requiredPoint: 0,
    nextTierName: null,
    nextTierProgress: null,
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
          const tierName = customerData.customer_tier?.ar || "Bronze";
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
            nextTierName: customerData.next_tier?.ar || null,
            nextTierProgress:
              customerData.next_tier?.next_tier_progress || null, // ✅ Fixed: corrected the path
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
          <div className="flex flex-col text-right" dir="rtl">
            <h2
              className={`${theme.styles.welcomeText} text-[18px] font-semibold poppins-text mb-1`}
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
        {streak ? (
          <div className="px-4 pb-4">
            {user?.nextTierProgress?.streak?.period_details?.length > 0 ? (
              <div className="relative w-full">
                <div className="absolute top-[14px] left-0 w-full h-[2px] bg-gray-200 rounded-full" />

                <div
                  className="absolute top-[14px] right-0 h-[2px] rounded-full bg-green-500 transition-all duration-500"
                  style={{
                    width: `${
                      (user.nextTierProgress.streak.completed_periods /
                        user.nextTierProgress.streak.period_details.length) *
                      100
                    }%`,
                  }}
                />

                <div className="flex justify-between relative z-10">
                  {user.nextTierProgress.streak.period_details.map(
                    (period, index) => {
                      const isCompleted = period.completed;
                      const isCurrent =
                        index ===
                        user.nextTierProgress.streak.completed_periods;

                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center text-center min-w-[64px]"
                        >
                          <div
                            className={`w-6 h-6 flex items-center justify-center ${
                              isCompleted
                                ? "text-green-600"
                                : isCurrent
                                ? "text-amber-500"
                                : "text-gray-400"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircleIcon className="w-5 h-5" />
                            ) : isCurrent ? (
                              typeof FireIcon !== "undefined" ? (
                                <FireIcon className="w-5 h-5 animate-pulse" />
                              ) : (
                                <svg
                                  className="w-5 h-5 animate-pulse"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M12 2s1.5 2 1.5 3.5S12 8 12 8s2-1 2-3 1-3 1-3-3 1-3 0z" />
                                  <path
                                    d="M12 10c-3.866 0-7 3.134-7 7a7 7 0 0014 0c0-3.866-3.134-7-7-7z"
                                    opacity="0.9"
                                  />
                                </svg>
                              )
                            ) : (
                              <CalendarDaysIcon className="w-5 h-5" />
                            )}
                          </div>

                          <span className="text-[11px] mt-1 text-gray-800">
                            {moment(
                              period.date_range.split(" - ")[0],
                              "D/M/YYYY"
                            )
                              .locale("ar")
                              .format("MMMM")}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {period.points_earned} / {period.points_required}
                          </span>
                        </div>
                      );
                    }
                  )}

                  <div className="flex flex-col items-center text-center min-w-[64px]">
                    <div className="w-6 h-6 flex items-center justify-center text-green-700">
                      <FlagIcon className="w-8 h-8" />
                    </div>
                    <span className="text-[16px] mt-1 text-gray-800">
                      {user.nextTierName}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <span className="text-gray-500 text-xs font-medium">
                  🎉 استمتع بمزايا فئة {user.membership}
                </span>
              </div>
            )}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ArabicCard;
