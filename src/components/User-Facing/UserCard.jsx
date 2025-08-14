import { useState, useEffect, use, useMemo } from "react";
import khedmah from "../../assets/Frame 92.png";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import sdkApi from "../../api/sdk";
import moment from "moment";
import { getTierTheme, getNextTierInfo } from "./themes/tierThemes";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import {
  CheckCircleIcon,
  FireIcon,
  CalendarDaysIcon,
  FlagIcon,
} from "@heroicons/react/24/solid";
const UserCard = ({ streak }) => {
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
    const value = total > 0 ? (user.points / total) * 100 : 100;
    return value;
  }, [user.points, user.requiredPoint]);

  // Use the customer auth hook
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
          // Get tier name (default to Bronze if not available)
          const tierName = customerData.customer_tier?.en || "Bronze";
          const currentPoints = customerData.point_balance || 0;

          // Get next tier info using the theme system
          const nextTierInfo = getNextTierInfo(tierName, currentPoints);
          const requiredPoint = Number(
            customerData.next_tier?.required_point || 0
          );
          const userData = {
            name: customerData.name || "Customer",
            membership: tierName,
            points: currentPoints,
            nextTierPoints: nextTierInfo.nextTier
              ? nextTierInfo.pointsToNext
              : 0,
            avatar: null,
            requiredPoint,
            nextTierName: customerData.next_tier?.en || null,
            nextTierProgress:
              customerData.next_tier?.next_tier_progress || null, // ✅ Fixed: corrected the path
          };

          setUser(userData);

          // Update the stored customer data
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

  // Get the current tier theme
  const theme = getTierTheme(user.membership);
  const formatPoints = (num) => num.toLocaleString("en-US");

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl max-w-md mx-auto overflow-hidden p-6">
        <div className="text-center">
          <p className="text-red-500 text-sm font-medium">
            Customer ID and API Key are required
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Please access this page with valid customerID and apiKey parameters
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Example: ?customerID=YOUR_ID&apiKey=YOUR_KEY
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl max-w-md mx-auto overflow-hidden p-6">
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
      <div className="bg-white rounded-2xl max-w-md mx-auto overflow-hidden p-6">
        <div className="text-center">
          <p className="text-red-500 text-sm">{error}</p>
          <p className="text-gray-500 text-xs mt-2">
            Please check your authentication or try again
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${theme.colors.background.card} rounded-2xl max-w-md mx-auto overflow-hidden ${theme.styles.cardBorder} ${theme.colors.shadow}`}
    >
      <div
        className={`absolute inset-0 ${theme.colors.background.overlay} opacity-30 rounded-2xl pointer-events-none`}
      ></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start px-4 py-4">
          <div>
            <h2
              className={`${theme.styles.welcomeText} text-sm font-semibold poppins-text mb-1`}
            >
              Welcome
            </h2>
            <h1
              className="text-base font-semibold poppins-text uppercase"
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
          <img
            src={theme.badge}
            alt={`${user.membership} Badge`}
            className={`absolute left-[-12px] top-1/3 -translate-y-1/2 w-29 h-29 z-0 ${theme.styles.badgeGlow}`}
            style={{
              pointerEvents: "none",
              filter:
                user.membership === "Silver"
                  ? "hue-rotate(180deg) saturate(0.5) brightness(1.2)"
                  : user.membership === "Gold"
                  ? "hue-rotate(40deg) saturate(1.5) brightness(1.3)"
                  : user.membership === "Platinum"
                  ? "hue-rotate(200deg) saturate(0.3) brightness(1.4)"
                  : "none",
            }}
          />
          <div className="relative z-10 pl-20 flex flex-col">
            <span
              className="font-semibold text-xl leading-none poppins-text"
              style={{ color: theme.colors.text.primary }}
            >
              {user.membership}
            </span>
            <div className="flex items-center mt-1 text-xs">
              <span
                className="poppins-text"
                style={{ color: theme.colors.text.muted }}
              >
                {formatPoints(user.points)}
              </span>
              <span
                className="ml-1 poppins-text"
                style={{ color: theme.colors.text.muted }}
              >
                Points
              </span>
              <ChevronRightIcon
                className="w-4 h-4 ml-1"
                style={{ color: theme.colors.text.muted }}
              />
            </div>
          </div>
        </div>
        {streak ? (
          <div className="px-4 pb-4">
            {user?.nextTierProgress?.streak?.period_details?.length > 0 ? (
              <div className="relative w-full">
                <div className="absolute top-[14px] left-0 w-full h-[2px] bg-gray-200 rounded-full" />

                <div
                  className="absolute top-[14px] left-0 h-[2px] rounded-full bg-green-500 transition-all duration-500"
                  style={{
                    width: `${user.nextTierProgress.streak.percentage}%`,
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
                              .locale("en")
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
                  No streak details available
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="px-4 pb-4">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-[#E39C75] h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              ></div>
            </div>
            <span className="text-[#8E8E8E] text-[12px] poppins-text">
              {user?.requiredPoint === 0 ? (
                "Maximum Level Reached!"
              ) : (
                <>
                  {user.requiredPoint} points to {user.nextTierName}
                </>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
