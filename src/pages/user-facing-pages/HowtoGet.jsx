import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HowtoGet = ({ link }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How to Earn Points
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover all the ways you can earn reward points through Khedmah
              services and unlock exclusive benefits
            </p>
          </div>
        </div>

        {/* Tier Benefits Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">★</span>
            </div>
            Tier Benefits
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Bronze Tier */}
            <div
              className="rounded-xl p-6 border-2 relative overflow-hidden"
              style={{
                backgroundColor: "#DF9872",
                borderColor: "#DF9872",
              }}
            >
              <div
                className="absolute inset-0 opacity-20"
                // style={{
                //   background:
                //     "linear-gradient(270deg, #FBC07F, #FFF9F3, #F9B97C, #A75D32)",
                // }}
              ></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{
                      background:
                        "linear-gradient(90deg, #F7CAA6, #FFFFFF, #A16133)",
                    }}
                  >
                    <span className="text-white font-bold text-xl drop-shadow">
                      B
                    </span>
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{
                      background:
                        "linear-gradient(90deg, #F7CAA6, #FFFFFF, #A16133)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Bronze
                  </h3>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#784019" }}
                  >
                    Entry level (default)
                  </p>
                </div>

                <div className="space-y-3">
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#FFDDBD" }}
                  >
                    <div
                      className="text-sm font-medium"
                      style={{ color: "#784019" }}
                    >
                      Points Multiplier
                    </div>
                    <div className="font-bold" style={{ color: "#A16133" }}>
                      1x points earned
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#FFDDBD" }}
                  >
                    <div
                      className="text-sm font-medium"
                      style={{ color: "#784019" }}
                    >
                      Points Expiry
                    </div>
                    <div style={{ color: "#784019" }}>45 days</div>
                  </div>
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#FFDDBD" }}
                  >
                    <div
                      className="text-sm font-medium"
                      style={{ color: "#784019" }}
                    >
                      Offers
                    </div>
                    <div className="text-sm" style={{ color: "#784019" }}>
                      Standard range of offers - everyday deals on essentials,
                      dining, retail
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Silver Tier */}
            <div
              className="rounded-xl p-6 border-2 relative overflow-hidden"
              style={{
                backgroundColor: "#C0C0C0",
                borderColor: "#C0C0C0",
              }}
            >
              <div
                className="absolute inset-0 opacity-20"
                // style={{
                //   background: "linear-gradient(270deg, #090909, #6F6F6F)",
                // }}
              ></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{
                      background: "linear-gradient(90deg, #D8D8D8, #FFFFFF)",
                    }}
                  >
                    <span
                      className="font-bold text-xl"
                      style={{ color: "#0E0E0E" }}
                    >
                      S
                    </span>
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{
                      background: "linear-gradient(90deg, #D8D8D8, #FFFFFF)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Silver
                  </h3>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#0E0E0E" }}
                  >
                    Minimum 100 points earned each month for 3 consecutive
                    months
                  </p>
                </div>

                <div className="space-y-3">
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#434343" }}
                  >
                    <div className="text-sm font-medium text-white">
                      Points Multiplier
                    </div>
                    <div className="font-bold text-white">
                      1.1x points earned
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#434343" }}
                  >
                    <div className="text-sm font-medium text-white">
                      Points Expiry
                    </div>
                    <div className="text-white">60 days</div>
                  </div>
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#434343" }}
                  >
                    <div className="text-sm font-medium text-white">Offers</div>
                    <div className="text-sm text-white">
                      Expanded range of offers across categories - broader deals
                      including lifestyle, travel, entertainment
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gold Tier */}
            <div
              className="rounded-xl p-6 border-2 relative overflow-hidden"
              style={{
                backgroundColor: "#FFD700",
                borderColor: "#FFD700",
              }}
            >
              <div
                className="absolute inset-0 opacity-30"
                // style={{
                //   background:
                //     "linear-gradient(270deg, #FFF08B, #FED500, #FFE289, #FDCD01, #FFC100)",
                // }}
              ></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{
                      background:
                        "linear-gradient(90deg, #FBC000, #FFFFFF, #FFDD00)",
                    }}
                  >
                    <span
                      className="font-bold text-xl"
                      style={{ color: "#784019" }}
                    >
                      G
                    </span>
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{
                      background:
                        "linear-gradient(90deg, #FBC000, #FFFFFF, #FFDD00)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Gold
                  </h3>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#784019" }}
                  >
                    Minimum 300 points earned each month for 3 consecutive
                    months
                  </p>
                </div>

                <div className="space-y-3">
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#FFDDBD" }}
                  >
                    <div
                      className="text-sm font-medium"
                      style={{ color: "#784019" }}
                    >
                      Points Multiplier
                    </div>
                    <div className="font-bold" style={{ color: "#FBC000" }}>
                      2x points earned
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#FFDDBD" }}
                  >
                    <div
                      className="text-sm font-medium"
                      style={{ color: "#784019" }}
                    >
                      Points Expiry
                    </div>
                    <div style={{ color: "#784019" }}>180 days</div>
                  </div>
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#FFDDBD" }}
                  >
                    <div
                      className="text-sm font-medium"
                      style={{ color: "#784019" }}
                    >
                      Offers
                    </div>
                    <div className="text-sm" style={{ color: "#784019" }}>
                      Maximum offers including premium & exclusive deals -
                      premium offers from top brands (luxury, travel,
                      electronics, wellness, fine dining)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Point Earning Criteria - Khedmah App */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            Khedmah App
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Electricity, Water, Telecom Postpaid, ROP, SPF */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Electricity Bill Payment, Water Bill Payment, Telecom Post Paid
                Bill Payment, Electricity Prepaid Recharge, ROP Payments, Social
                Protection Fund Payments
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                  <span className="font-medium text-gray-700">
                    Reward Points Earned:
                  </span>
                  <span className="text-blue-600 font-bold">35 points</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                  <span className="font-medium text-gray-700">
                    Min. Transaction Amount:
                  </span>
                  <span className="text-gray-600">&gt; OMR 3.000</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">
                    Number of Transactions:
                  </span>
                  <span className="text-gray-600">
                    Not more than 1 transaction per account, per month
                  </span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">
                  Service Types Include:
                </h4>
                <div className="grid grid-cols-1 gap-1 text-sm text-gray-600">
                  <span>1. Nama Electricity</span>
                  <span>2. Nama Water</span>
                  <span>3. Omantel Postpaid</span>
                  <span>4. Ooredoo Postpaid</span>
                  <span>5. Awasr</span>
                  <span>6. ROP</span>
                  <span>7. Vodafone Postpaid</span>
                  <span>8. Social Protection Fund</span>
                  <span>9. Awan Gas</span>
                </div>
              </div>
            </div>

            {/* Telecom Recharge, Purchase of Vouchers & Insurance */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Telecom Recharge, Purchase of Vouchers & Insurance
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-green-200">
                  <span className="font-medium text-gray-700">
                    Reward Points Earned:
                  </span>
                  <span className="text-green-600 font-bold">
                    2% of transaction value
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                  <span className="font-medium text-gray-700">
                    Min. Transaction Amount:
                  </span>
                  <span className="text-gray-600">&gt; OMR 1.000</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">
                  Service Types Include:
                </h4>
                <div className="grid grid-cols-1 gap-1 text-sm text-gray-600">
                  <span>1. Omantel Recharge</span>
                  <span>2. Ooredoo Recharge</span>
                  <span>3. Vodafone Recharge</span>
                  <span>4. Friendi Recharge</span>
                  <span>5. Renna Recharge</span>
                  <span>6. Redbull Recharge</span>
                  <span>7. E-store</span>
                  <span>8. Insurance</span>
                  <span>9. International Recharge</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Khedmah Delivery App Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            Khedmah Delivery App
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Order Delivered */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Delivered
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-lg border-l-4 border-orange-400">
                  <div className="font-medium text-gray-800">
                    First order Any Customer
                  </div>
                  <div className="text-orange-600 font-bold">
                    2% of Order Value
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border-l-4 border-gray-400">
                  <div className="font-medium text-gray-800">
                    Second order onwards Regular Customer
                  </div>
                  <div className="text-gray-600 font-bold">
                    1% of Order Value
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border-l-4 border-purple-400">
                  <div className="font-medium text-gray-800">
                    Second order onwards Diamond Subscriber
                  </div>
                  <div className="text-purple-600 font-bold">
                    2% of Order Value
                  </div>
                </div>
              </div>
            </div>

            {/* Diamond Subscription */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Diamond Subscription
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">
                      Monthly Subscription
                    </span>
                    <span className="text-purple-600 font-bold">50 points</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">
                      Annual Subscription
                    </span>
                    <span className="text-purple-600 font-bold">
                      300 points
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Top-up */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Wallet Top-up (Minimum RO 10.000)
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-lg">
                  <div className="font-medium text-gray-800 mb-2">Top-up</div>
                  <div className="text-teal-600 font-bold text-lg">
                    1% of Top-up Value
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">
            💡 Pro Tips to Maximize Your Points
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">1</span>
              </div>
              <p>
                Subscribe to Diamond membership to earn 2% on all delivery
                orders after the first one
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">2</span>
              </div>
              <p>
                Earn minimum 100 points each month for 3 consecutive months to
                reach Silver tier
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">3</span>
              </div>
              <p>
                Use telecom recharge services regularly to earn 2% of
                transaction value
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">4</span>
              </div>
              <p>
                Maintain greater than OMR 3.000 transactions for bill payments
                to earn 35 points
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <p
            className="text-xs text-gray-500 cursor-pointer hover:underline"
            onClick={() =>
              navigate(
                link ? "/terms-and-conditions" : "/user/terms-and-conditions"
              )
            }
          >
            Terms and Conditions
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowtoGet;
