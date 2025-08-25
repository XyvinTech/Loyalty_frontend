const HowtoGet = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-8 poppins-text">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How to Earn Points
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover all the ways you can earn reward points through Khedmah services and unlock exclusive benefits
          </p>
        </div>

        {/* Khedmah Services Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            Khedmah Services
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Nama & Telecom Postpaid */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Nama & Telecom Postpaid, Electricity Prepaid, ROP & SPF Fees
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                  <span className="font-medium text-gray-700">Points Earned:</span>
                  <span className="text-blue-600 font-bold">35 points</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                  <span className="font-medium text-gray-700">Min. Amount:</span>
                  <span className="text-gray-600">OMR 3</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">Limit:</span>
                  <span className="text-gray-600">1 transaction/account/month</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Includes:</h4>
                <div className="grid grid-cols-1 gap-1 text-sm text-gray-600">
                  <span>• Nama Electricity (Postpaid & Prepaid)</span>
                  <span>• Nama Water</span>
                  <span>• Omantel, Ooredoo, Vodafone Postpaid</span>
                  <span>• ROP (Fine & Mulkia Renewal)</span>
                  <span>• Social Protection Fund Fees</span>
                  <span>• Awsr, Awan Gas</span>
                </div>
              </div>
            </div>

            {/* Telecom Recharge */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Telecom Recharge, Vouchers & Insurance
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-green-200">
                  <span className="font-medium text-gray-700">Points Earned:</span>
                  <span className="text-green-600 font-bold">2% of transaction value</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Includes:</h4>
                <div className="grid grid-cols-1 gap-1 text-sm text-gray-600">
                  <span>• Omantel, Ooredoo, Friendi Recharge</span>
                  <span>• Renna, Vodafone, Redbull Recharge</span>
                  <span>• Estore</span>
                  <span>• Insurance</span>
                  <span>• Prepay Nation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Khedmah Delivery Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            Khedmah Delivery
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Order Rewards */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Rewards</h3>
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-lg border-l-4 border-orange-400">
                  <div className="font-medium text-gray-800">First Order</div>
                  <div className="text-orange-600 font-bold">2% of Order Value</div>
                  <div className="text-sm text-gray-600">Normal Customer</div>
                </div>
                <div className="p-3 bg-white rounded-lg border-l-4 border-gray-400">
                  <div className="font-medium text-gray-800">Subsequent Orders</div>
                  <div className="text-gray-600 font-bold">1% of Order Value</div>
                  <div className="text-sm text-gray-600">Normal Customer</div>
                </div>
                <div className="p-3 bg-white rounded-lg border-l-4 border-purple-400">
                  <div className="font-medium text-gray-800">Diamond Member</div>
                  <div className="text-purple-600 font-bold">2% of Order Value</div>
                  <div className="text-sm text-gray-600">All orders after first</div>
                </div>
              </div>
            </div>

            {/* Diamond Subscription */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Diamond Subscription</h3>
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Monthly</span>
                    <span className="text-purple-600 font-bold">50 points</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Annual</span>
                    <span className="text-purple-600 font-bold">300 points</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Topup */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Topup</h3>
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-lg">
                  <div className="font-medium text-gray-800 mb-2">Points Earned</div>
                  <div className="text-teal-600 font-bold text-lg">1% of Topup Value</div>
                  <div className="text-sm text-gray-600 mt-2">Minimum RO 10 required</div>
                </div>
              </div>
            </div>
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
                backgroundColor: '#f8c44c',
                borderColor: '#A16133'
              }}
            >
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(270deg, #FBC07F, #FFF9F3, #F9B97C, #A75D32)'
                }}
              ></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{
                      background: 'linear-gradient(90deg, #F7CAA6, #FFFFFF, #A16133)'
                    }}
                  >
                    <span className="text-white font-bold text-xl drop-shadow">B</span>
                  </div>
                  <h3 
                    className="text-xl font-bold"
                    style={{ 
                      background: 'linear-gradient(90deg, #F7CAA6, #FFFFFF, #A16133)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Bronze
                  </h3>
                  <p 
                    className="text-sm font-medium"
                    style={{ color: '#784019' }}
                  >
                    Entry Level (Default)
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div 
                    className="rounded-lg p-3"
                    style={{ backgroundColor: '#FFDDBD' }}
                  >
                    <div className="text-sm font-medium" style={{ color: '#784019' }}>Points Multiplier</div>
                    <div className="font-bold" style={{ color: '#A16133' }}>1x points earned</div>
                  </div>
                  <div 
                    className="rounded-lg p-3"
                    style={{ backgroundColor: '#FFDDBD' }}
                  >
                    <div className="text-sm font-medium" style={{ color: '#784019' }}>Points Expiry</div>
                    <div style={{ color: '#784019' }}>45 days</div>
                  </div>
                  <div 
                    className="rounded-lg p-3"
                    style={{ backgroundColor: '#FFDDBD' }}
                  >
                    <div className="text-sm font-medium" style={{ color: '#784019' }}>Offers</div>
                    <div className="text-sm" style={{ color: '#784019' }}>Standard range - everyday deals on essentials, dining, retail</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Silver Tier */}
            <div 
              className="rounded-xl p-6 border-2 relative overflow-hidden"
              style={{ 
                backgroundColor: '#bcbcbc',
                borderColor: '#6F6F6F'
              }}
            >
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(270deg, #090909, #6F6F6F)'
                }}
              ></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{
                      background: 'linear-gradient(90deg, #D8D8D8, #FFFFFF)'
                    }}
                  >
                    <span className="font-bold text-xl" style={{ color: '#0E0E0E' }}>S</span>
                  </div>
                  <h3 
                    className="text-xl font-bold"
                    style={{ 
                      background: 'linear-gradient(90deg, #D8D8D8, #FFFFFF)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Silver
                  </h3>
                  <p 
                    className="text-sm font-medium"
                    style={{ color: '#0E0E0E' }}
                  >
                    100 points/month for 3 months
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div 
                    className="rounded-lg p-3"
                    style={{ backgroundColor: '#434343' }}
                  >
                    <div className="text-sm font-medium text-white">Points Multiplier</div>
                    <div className="font-bold text-white">1.1x points earned</div>
                  </div>
                  <div 
                    className="rounded-lg p-3"
                    style={{ backgroundColor: '#434343' }}
                  >
                    <div className="text-sm font-medium text-white">Points Expiry</div>
                    <div className="text-white">60 days</div>
                  </div>
                  <div 
                    className="rounded-lg p-3"
                    style={{ backgroundColor: '#434343' }}
                  >
                    <div className="text-sm font-medium text-white">Offers</div>
                    <div className="text-sm text-white">Expanded range - lifestyle, travel, entertainment deals</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gold Tier */}
            <div 
              className="rounded-xl p-6 border-2 relative overflow-hidden"
              style={{ 
                backgroundColor: '#FBC000',
                borderColor: '#FDCD01'
              }}
            >
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(270deg, #FFF08B, #FED500, #FFE289, #FDCD01, #FFC100)'
                }}
              ></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{
                      background: 'linear-gradient(90deg, #FBC000, #FFFFFF, #FFDD00)'
                    }}
                  >
                    <span className="font-bold text-xl" style={{ color: '#784019' }}>G</span>
                  </div>
                  <h3 
                    className="text-xl font-bold"
                    style={{ 
                      background: 'linear-gradient(90deg, #FBC000, #FFFFFF, #FFDD00)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Gold
                  </h3>
                  <p 
                    className="text-sm font-medium"
                    style={{ color: '#784019' }}
                  >
                    150 points/month for 3 months
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div 
                    className="rounded-lg p-3"
                    style={{ backgroundColor: '#FFDDBD' }}
                  >
                    <div className="text-sm font-medium" style={{ color: '#784019' }}>Points Multiplier</div>
                    <div className="font-bold" style={{ color: '#FBC000' }}>1.25x points earned</div>
                  </div>
                  <div 
                    className="rounded-lg p-3"
                    style={{ backgroundColor: '#FFDDBD' }}
                  >
                    <div className="text-sm font-medium" style={{ color: '#784019' }}>Points Expiry</div>
                    <div style={{ color: '#784019' }}>90 days</div>
                  </div>
                  <div 
                    className="rounded-lg p-3"
                    style={{ backgroundColor: '#FFDDBD' }}
                  >
                    <div className="text-sm font-medium" style={{ color: '#784019' }}>Offers</div>
                    <div className="text-sm" style={{ color: '#784019' }}>Premium offers from top brands - luxury, travel, electronics, wellness</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">💡 Pro Tips to Maximize Your Points</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">1</span>
              </div>
              <p>Subscribe to Diamond membership for higher rewards on all delivery orders</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">2</span>
              </div>
              <p>Reach Silver or Gold tier for bonus point multipliers and longer expiry periods</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">3</span>
              </div>
              <p>Use telecom recharge services regularly to earn 2% on every transaction</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">4</span>
              </div>
              <p>Top up your wallet with minimum RO 10 to earn additional points</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HowtoGet;