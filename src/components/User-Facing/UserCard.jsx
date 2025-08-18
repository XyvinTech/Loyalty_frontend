import { useState, useEffect } from "react";
import khedmah from "../../assets/Frame 92.png";
import sdkApi from "../../api/sdk";
import moment from "moment";
import { getNextTierInfo } from "./themes/tierThemes";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import { FireIcon } from "@heroicons/react/24/outline";
import bronzeimage from "../../assets/bronse loyality.webp";
import goldImage from "../../assets/Gold1 loyality.webp";
import silverImage from "../../assets/SIL loyality.webp";
import fireImage from "../../assets/Group (1).png";
import bronzebg from "../../assets/Ellipse 3.png";

const UserCard = ({ streak }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    name: "",
    membership: "Bronze",
    points: 0,
    nextTierPoints: 5000,
    requiredPoint: 0,
    nextTierName: null,
    nextTierProgress: null,
  });

  const { customerID, apiKey, isAuthenticated, updateCustomerData } =
    useCustomerAuth();

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!isAuthenticated || !customerID || !apiKey) return;

      setLoading(true);
      const response = await sdkApi.getCustomerDetails(customerID, apiKey);
      if (response.status === 200 && response.data) {
        const customerData = response.data;
        const tierName = customerData.customer_tier?.en || "Bronze";
        const currentPoints = customerData.point_balance || 0;
        const nextTierInfo = getNextTierInfo(tierName, currentPoints);

        setUser({
          name: customerData.name || "Customer",
          membership: tierName,
          points: currentPoints,
          nextTierPoints: nextTierInfo.nextTier ? nextTierInfo.pointsToNext : 0,
          requiredPoint: Number(customerData.next_tier?.required_point || 0),
          nextTierName: customerData.next_tier?.en || null,
          nextTierProgress: customerData.next_tier?.next_tier_progress || null,
        });

        updateCustomerData(customerData);
      }
      setLoading(false);
    };

    fetchCustomerData();
  }, [customerID, apiKey, isAuthenticated, updateCustomerData]);

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

  const theme = getTierTheme(user.membership);

  // ✅ Skeleton Loader
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
    <div className="relative w-[350px] h-[200px] rounded-2xl overflow-hidden shadow-lg mx-auto">
      {/* Background image */}
      <img
        src={theme.image}
        alt="Loyalty Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Tier Info */}
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
          <img
            src={khedmah}
            alt="Khedmah Logo"
            className="w-11 h-11 rounded-lg"
          />
        </div>

        {/* Progress or streaks */}
        <div className="px-4 pb-4">
          {streak ? (
            <div className="px-4 pb-0 pt-6">
              {user?.nextTierProgress?.streak?.period_details?.length > 0 ? (
                <div className="relative w-full">
                  <div className="absolute top-[12px] left-0 w-full h-[4px] bg-gray-200 rounded-full" />

                  <div
                    className="absolute top-[12px] right-0 h-[4px] rounded-full  transition-all duration-500"
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
                              className={`w-5 h-5 flex items-center justify-center rounded-full ${
                                isCompleted
                                  ? "" 
                                  : isCurrent
                                  ? "text-amber-500"
                                  : "text-gray-400"
                              }`}
                              style={
                                isCompleted ? { backgroundColor: theme.bg } : {}
                              }
                            >
                              {isCompleted ? (
                                <span className="text-white font-bold text-xs">
                                  ✔
                                </span>
                              ) : isCurrent ? (
                                <FireIcon className="w-5 h-5 animate-pulse" />
                              ) : (
                                <CalendarDaysIcon className="w-5 h-5" />
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
                                .locale("en")
                                .format("MMMM")}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] text-white">
                                {period.points_earned} /{" "}
                                {period.points_required}
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
                      {/* <span className="text-[16px] mt-1"style={{color: theme.bg}}>
                        {user.nextTierName}
                      </span> */}
                    </div>
                  </div>
                </div>
              ) : (
                <div className=" rounded-lg p-4 text-center">
                  <span className="text-[#CC9101] text-xs font-medium">
                    Yeh!! Enjoy the {user.membership} tier Benefits
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
    </div>
  );
};

export default UserCard;
