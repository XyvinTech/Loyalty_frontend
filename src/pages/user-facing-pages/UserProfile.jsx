import { useState } from "react";
import {
  UserIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  PencilIcon,
  StarIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const UserProfile = () => {
  const [user] = useState({
    name: "Abdul Wahaab",
    email: "abdul.wahaab@example.com",
    phone: "+968 9876 5432",
    memberSince: "January 2023",
    tier: "Bronze",
    totalPoints: 50000,
    pointsToNextTier: 25000,
    totalEarned: 75000,
    totalRedeemed: 25000,
  });

  const menuItems = [
    {
      id: "edit-profile",
      title: "Edit Profile",
      icon: PencilIcon,
      action: () => {},
    },
    {
      id: "transaction-history",
      title: "Transaction History",
      icon: DocumentTextIcon,
      action: () => {},
    },
    {
      id: "help-support",
      title: "Help & Support",
      icon: QuestionMarkCircleIcon,
      action: () => {},
    },
    {
      id: "settings",
      title: "Settings",
      icon: CogIcon,
      action: () => {},
    },
    {
      id: "logout",
      title: "Logout",
      icon: ArrowRightOnRectangleIcon,
      action: () => {},
      isDestructive: true,
    },
  ];

  const getTierColor = (tier) => {
    switch (tier.toLowerCase()) {
      case "bronze":
        return "bg-gradient-to-r from-orange-600 to-orange-800";
      case "silver":
        return "bg-gradient-to-r from-gray-400 to-gray-600";
      case "gold":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case "platinum":
        return "bg-gradient-to-r from-purple-400 to-purple-600";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600";
    }
  };

  const getTierProgress = () => {
    const totalForNextTier = user.totalPoints + user.pointsToNextTier;
    return (user.totalPoints / totalForNextTier) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-6 text-white">
        <h1 className="text-lg font-semibold text-center">Profile</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* User Info Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                Member since {user.memberSince}
              </p>
            </div>
          </div>
        </div>

        {/* Tier Status Card */}
        <div className={`${getTierColor(user.tier)} rounded-lg p-6 text-white`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrophyIcon className="w-6 h-6" />
              <span className="text-lg font-semibold">{user.tier} Member</span>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-4 h-4 ${
                    i <
                    (user.tier === "Bronze"
                      ? 1
                      : user.tier === "Silver"
                      ? 2
                      : user.tier === "Gold"
                      ? 3
                      : 4)
                      ? "text-yellow-300 fill-current"
                      : "text-white opacity-30"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm opacity-90">Current Points</span>
              <span className="font-semibold">
                {user.totalPoints.toLocaleString()}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="opacity-90">Progress to next tier</span>
                <span>
                  {user.pointsToNextTier.toLocaleString()} more needed
                </span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getTierProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Points Summary */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Points Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {user.totalEarned.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Earned</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {user.totalRedeemed.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Redeemed</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={item.action}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-gray-100" : ""
              } ${item.isDestructive ? "text-red-600" : "text-gray-800"}`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </div>
              <div className="w-5 h-5 text-gray-400">→</div>
            </button>
          ))}
        </div>

        {/* App Version */}
        <div className="text-center text-gray-500 text-sm">
          <p>Kedmah Loyalty App v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
