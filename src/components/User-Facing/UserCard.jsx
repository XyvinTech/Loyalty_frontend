import { useState, useEffect } from "react";
import sdkApi from "../../api/sdk";
import moment from "moment";
import { getNextTierInfo } from "./themes/tierThemes";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import { ArrowRightIcon, CheckIcon } from "@heroicons/react/24/outline";
import walking from "../../assets/Vector.png";
import bronzeimage from "../../assets/bronse loyality.webp";
import goldImage from "../../assets/Gold1 loyality.webp";
import silverImage from "../../assets/SIL loyality.webp";
import bronzebg from "../../assets/bronzetier.webp";
import silverbg from "../../assets/silvertier.webp";
import goldbg from "../../assets/goldtier.webp";
import { useLocation } from "react-router-dom";
import AppButton from "../../ui/AppButton";
import { useNavigationWithParams } from "../../utils/navigationUtils";

const UserCard = ({ streak, show }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const { customerData, isAuthenticated } = useCustomerAuth();
  const { navigateWithParams } = useNavigationWithParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlName = queryParams.get("name");

  // ✅ Use the data already fetched by useCustomerAuth
  useEffect(() => {
    if (!isAuthenticated || !customerData) return;

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

    setLoading(false);
  }, [isAuthenticated, customerData]);

  const getTierTheme = (tier) => {
    switch (tier?.toLowerCase()) {
      case "bronze":
        return {
          welcomeColor: "#FFDDBD",
          nameGradient: "linear-gradient(90deg, #F7CAA6, #FFFFFF, #A16133)",
          membershipGradient:
            "linear-gradient(270deg, #FBC07F, #FFF9F3, #F9B97C, #A75D32)",
          transactionColor: "#784019",
          img: bronzebg,
          bg: "#f8c44c",
          variant: "bronze",
          image: bronzeimage,
        };
      case "silver":
        return {
          welcomeColor: "#434343",
          nameGradient: "linear-gradient(90deg, #D8D8D8, #FFFFFF)",
          membershipGradient: "linear-gradient(270deg, #090909, #6F6F6F)",
          transactionColor: "#0E0E0E",
          image: silverImage,
          img: silverbg,
          variant: "silver",
          bg: "#bcbcbc",
        };
      case "gold":
        return {
          welcomeColor: "#FFDDBD",
          nameGradient: "linear-gradient(90deg,#FBC000, #FFFFFF,#FFDD00)",
          membershipGradient:
            "linear-gradient(270deg, #FFF08B, #FED500,#FFE289,#FDCD01,#FFC100)",
          transactionColor: "#784019",
          image: goldImage,
          img: goldbg,
          variant: "gold",
        };
      default:
        return {
          welcomeColor: "#9A653D",
          nameGradient: "linear-gradient(90deg, #9A653D, #CBAD8B)",
        };
    }
  };

  if (loading || !user) {
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

  const theme = getTierTheme(user.membership);

  return (
    <>
      <div className="relative max-w-md w-full h-full  rounded-2xl overflow-hidden shadow-lg mx-auto">
        <img
          src={theme.image}
          alt="Loyalty Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="text-start pl-10 px-4 flex justify-between items-start pt-0">
            <div className="pt-5">
              <h1
                className="text-xl font-bold poppins-text uppercase bg-clip-text text-transparent"
                style={{ backgroundImage: theme.nameGradient }}
              >
                {urlName}
              </h1>

              <h2
                className="uppercase text-base font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: theme.membershipGradient }}
              >
                {user.membership}
              </h2>
            </div>
          </div>
          <div className="flex flex-col items-end px-4 pb-4 pt-15 space-y-2">
            <h2
              className=" text-[12px]  bg-clip-text text-transparent font-medium"
              style={{ color: theme.transactionColor }}
            >
              Point Balance:{" "}
              <span
                className="px-2 py-1 rounded-full"
                style={{ background: theme.nameGradient }}
              >
                {user.points}
              </span>
            </h2>
            {show && (
              <button
                className="text-sm font-semibold flex items-center bg-clip-text text-transparent"
                style={{ color: theme.transactionColor }}
                onClick={() => navigateWithParams("/user/history")}
              >
                See Transactions
                <span className="ml-1">{">"}</span>
              </button>
            )}
          </div>
        </div>
      </div>{" "}
      <div className="px-0 pb-0 pt-0 ">
        {streak ? (
          <div className="px-0 pt-6">
            {user?.nextTierProgress?.streak?.period_details?.length > 0 ? (
              <>
                <div className="relative w-full flex items-center justify-between mt-5 ">
                  <div className="flex flex-col items-center min-w-[30px]">
                    <img
                      src={walking}
                      alt="Walker"
                      className="w-[16px] h-[30px]"
                    />
                  </div>

                  <div className="flex flex-col items-center min-w-[64px] relative">
                    <span className="absolute -top-6 text-xs font-semibold text-[#0C3262] whitespace-nowrap">
                      You are here !
                    </span>
                    <img
                      src={theme.img}
                      alt={user.membership}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-bold text-[#0C3262]">
                      {user.membership}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-between mx-0 relative mt-6">
                    <div className="absolute top-2 left-0 w-full h-[4px] bg-gray-200 rounded-full" />

                    <div className="absolute top-2 left-0 flex w-full h-[4px] rounded-full overflow-hidden">
                      {user.nextTierProgress.streak.period_details.map(
                        (period, index) => (
                          <div
                            key={index}
                            className="h-full transition-all duration-500 relative"
                            style={{
                              width: "100%",
                              background: theme.transactionColor,
                            }}
                          />
                        )
                      )}
                    </div>
                    {user.nextTierProgress.streak.period_details.map(
                      (period, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center text-center relative z-10"
                          style={{
                            width: `${
                              100 /
                              user.nextTierProgress.streak.required_periods
                            }%`,
                          }}
                        >
                          <div
                            className={`flex items-center justify-center w-5 h-5 rounded-full mb-1 border-2 ${
                              period.completed
                                ? "bg-[#FFDD00] border-[#FFDD00]" // completed
                                : "bg-white border-gray-400" // not completed
                            }`}
                          >
                            {period.completed ? (
                              <CheckIcon className="w-3 h-3 text-black" />
                            ) : (
                              <span className="text-[10px] text-gray-500">
                                ✕
                              </span>
                            )}
                          </div>

                          <span className="text-[12px] text-[#0C3262] font-medium">
                            {moment(
                              period.date_range.split(" - ")[0],
                              "D/M/YYYY"
                            )
                              .locale("en")
                              .format("MMM")}
                          </span>

                          <span className="text-[8px] text-[#0C3262]">
                            {period.points_earned} / {period.points_required}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="flex flex-col items-center min-w-[64px]">
                    <img
                      src={getTierTheme(user.nextTierName).img}
                      alt={user.nextTierName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-bold text-[#0C3262]">
                      {user.nextTierName}
                    </span>
                  </div>
                </div>
                {show && (
                  <div className="mt-6 flex justify-center items-center pb-18">
                    <AppButton
                      name={
                        <>
                          How to get to silver or gold ?
                          <ArrowRightIcon className="w-4 h-4" />
                        </>
                      }
                      onClick={() => navigateWithParams("/user/how-to")}
                      variant={theme.variant}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="mt-6 flex justify-center items-center pb-0">
                <AppButton
                  name={<>Yeh!! Enjoy the {user.membership} tier Benefits</>}
                  variant={theme.variant}
                  onClick={() => navigateWithParams("/user/how-to")}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="px-4 pb-4">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-[#E39C75] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-[#8E8E8E] text-[12px] poppins-text">
              {user?.requiredPoint === 0
                ? "Maximum Level Reached!"
                : `${user.requiredPoint} points to ${user.nextTierName}`}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default UserCard;
