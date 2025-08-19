import { useState, useEffect, useMemo } from "react";
import khedmah from "../../assets/Frame 92.png";
import { CheckIcon, ChevronLeftIcon } from "@heroicons/react/24/outline"; // flipped icon
import sdkApi from "../../api/sdk";
import { getNextTierInfo } from "./themes/tierThemes";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import moment from "moment";
import "moment/locale/ar";
import bronzeimage from "../../assets/bronse loyality.webp";
import goldImage from "../../assets/Gold1 loyality.webp";
import silverImage from "../../assets/SIL loyality.webp";
import fireImage from "../../assets/Group (1).png";
import bronzebg from "../../assets/Ellipse 3.png";
moment.locale("ar");
import { FireIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";
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
    tier: "Bronze",
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
  const getTierTheme = (tier) => {
    switch (tier.toLowerCase()) {
      case "bronze":
        return {
          welcomeColor: "#9A653D",
          nameMembershipGradient: "linear-gradient(90deg, #9A653D, #CBAD8B)",
          img: bronzebg,
          bg: "#f8c44c",
          image: bronzeimage,
        };
      case "silver":
        return {
          welcomeColor: "#A6A6A6",
          nameMembershipGradient: "linear-gradient(90deg, #FFFFFF, #828282)",
          image: silverImage,
          img: bronzebg,
          bg: "#bcbcbc",
        };
      case "gold":
        return {
          welcomeColor: "#B87F06",
          nameMembershipGradient: "linear-gradient(90deg, #F6D27E, #D99A00)",
          image: goldImage,
        };
      default:
        return {
          welcomeColor: "#9A653D",
          nameMembershipGradient: "linear-gradient(90deg, #9A653D, #CBAD8B)",
        };
    }
  };
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
          const tier = customerData.customer_tier?.en || "Bronze";
          const tierName = customerData.customer_tier?.ar || "Bronze";
          const currentPoints = customerData.point_balance || 0;
          const nextTierInfo = getNextTierInfo(tierName, currentPoints);
          const requiredPoint = Number(
            customerData.next_tier?.required_point || 0
          );
          setUser({
            name: customerData.name || "Customer",
            membership: tierName,
            tier: tier,
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

  const theme = getTierTheme(user.tier);
  const formatPoints = (num) => num.toLocaleString("en-US");

  if (loading) {
    return (
      <div className="relative w-[350px] h-[200px] rounded-2xl overflow-hidden shadow-lg mx-auto bg-gray-100 animate-pulse">
        <div className="absolute inset-0 bg-gray-200" />

        <div className="relative z-10 h-full flex flex-col justify-between p-4">
          <div>
            <div className="h-4 w-20 bg-gray-300 rounded mb-2"></div>
            <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
            <div className="h-6 w-20 bg-gray-300 rounded"></div>
          </div>

          <div>
            <div className="h-2 w-full bg-gray-300 rounded mb-2"></div>
            <div className="h-2 w-2/3 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="relative w-[350px] h-[200px] rounded-2xl overflow-hidden shadow-lg mx-auto"
    >
      <img
        src={theme.image}
        alt="Loyalty Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10">
        <div className="text-start pl-30 px-4 flex justify-between items-start  pt-4">
          <div className="pt-5">
            <p
              className="text-[14px] italic windsong-text"
              style={{ color: theme.welcomeColor }}
            >
              مرحباً
            </p>

            <h1
              className="text-lg font-bold poppins-text uppercase bg-clip-text text-transparent"
              style={{ backgroundImage: theme.nameMembershipGradient }}
            >
              {user.name}
            </h1>

            <h2
              className="uppercase text-2xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: theme.nameMembershipGradient }}
            >
              {user.membership}
            </h2>
          </div>
          {/* <img
            src={khedmah}
            alt="Khedmah Logo"
            className="w-11 h-11 rounded-lg"
          /> */}
        </div>
        {streak ? (
          <div className="px-12 pr-6 pb-0 pt-6">
            {user?.nextTierProgress?.streak?.period_details?.length > 0 ? (
              <div className="relative w-full">
                <div className="absolute top-[14px] left-0 w-full h-[2px] bg-gray-200 rounded-full" />

                <div
                  className="absolute top-[14px] right-0 h-[2px] rounded-full  transition-all duration-500"
                  style={{
                    width: `${user.nextTierProgress.streak.percentage}%`,
                    backgroundImage: theme.nameMembershipGradient,
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
                            className={`flex items-center justify-center rounded-full ${
                              isCompleted ? "w-5 h-5" : "w-6 h-6"
                            } ${
                              isCurrent ? "text-[#F6CD00]" : "text-gray-400"
                            }`}
                            style={{ backgroundColor: theme.bg }}
                          >
                            {isCompleted ? (
                              <span className="text-white font-bold text-xs">
                                <CheckIcon className="w-4 h-4" />
                              </span>
                            ) : isCurrent ? (
                              <span className="text-white font-bold text-xs">
                                <CheckIcon className="w-6 h-6" />
                              </span>
                            ) : (
                              <span className="text-white font-bold text-xs">
                                <CheckIcon className="w-4 h-4" />
                              </span>
                            )}
                          </div>

                          <span
                            className="text-[11px] mt-1 "
                            style={{ color: theme.bg }}
                          >
                            {moment(
                              period.date_range.split(" - ")[0],
                              "D/M/YYYY"
                            )
                              .locale("ar")
                              .format("MMMM")}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] text-white">
                              {period.points_earned} / {period.points_required}
                            </span>
                          )}
                        </div>
                      );
                    }
                  )}

                  <div className="flex flex-col items-center text-center min-w-[64px]">
                    <div
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-center bg-cover"
                      style={{ backgroundImage: `url(${theme.img})` }}
                    >
                      <img
                        src={fireImage}
                        alt="Fire"
                        className="w-[9px] h-[11px]"
                      />
                    </div>
                    {/* <span className="text-[16px] mt-1 text-gray-800">
                      {user.nextTierName}
                    </span> */}
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
