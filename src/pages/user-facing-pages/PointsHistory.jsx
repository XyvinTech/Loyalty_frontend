import { useState, useEffect, useCallback, useRef } from "react";
import silver from "../../assets/silver.png";
import gold from "../../assets/gold.png";
import bronze from "../../assets/background.png";
import plus from "../../assets/plus.png";
import minus from "../../assets/minus.png";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import sdkApi from "../../api/sdk";
import { getTierTheme } from "../../components/User-Facing/themes/tierThemes";

const PAGE_SIZE = 20;

const PointsHistory = () => {
  const [customer, setCustomer] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(bronze);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  // Use the customer auth hook
  const { customerID, apiKey, isAuthenticated, customerData } =
    useCustomerAuth();

  // Fetch transaction history
  const fetchTransactionHistory = useCallback(
    async (pageToLoad = 1) => {
      if (!isAuthenticated || !customerID || !apiKey) {
        setError("Customer ID and API Key are required");
        setLoading(false);
        return;
      }
      try {
        if (pageToLoad === 1) setLoading(true);
        setIsLoadingMore(true);

        const response = await sdkApi.getTransactionHistory(
          customerID,
          apiKey,
          pageToLoad,
          PAGE_SIZE
        );
        if (response.status === 200 && response.data) {
          setCustomer(response.data.customer);
          setPagination(response.data.pagination);
          if (pageToLoad === 1) {
            setTransactions(response.data.transactions || []);
          } else {
            setTransactions((prev) => [
              ...prev,
              ...(response.data.transactions || []),
            ]);
          }
        } else {
          setError("Failed to fetch transaction history");
        }
      } catch (err) {
        setError(
          `Error loading transaction history: ${
            err.response?.data?.message || err.message
          }`
        );
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [customerID, apiKey, isAuthenticated]
  );

  // Initial fetch OR when user / api key changes
  useEffect(() => {
    setPage(1);
    setError(null);
    fetchTransactionHistory(1);
    // eslint-disable-next-line
  }, [customerID, apiKey, isAuthenticated]);

  // When page increments, fetch more transactions
  useEffect(() => {
    if (page === 1) return;
    fetchTransactionHistory(page);
  }, [page, fetchTransactionHistory]);

  // Tier-related background
  useEffect(() => {
    const tier = customerData?.customer_tier?.en;
    switch (tier) {
      case "Silver":
        setBackgroundImage(silver);
        break;
      case "Gold":
        setBackgroundImage(gold);
        break;
      default:
        setBackgroundImage(bronze);
    }
  }, [customerData]);

  // Infinite scroll observer
  const observer = useRef();
  const lastRowRef = useCallback(
    (node) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          pagination?.has_next &&
          !isLoadingMore
        ) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, pagination]
  );

  const customerTier =
    customer?.customer_tier?.en || customerData?.customer_tier?.en || "Bronze";
  const theme = getTierTheme(customerTier);
  const formatPoints = (num) => num?.toLocaleString("de-DE") || "0";
  const customerName = customer?.name || customerData?.name || "Customer";
  const pointBalance =
    customer?.point_balance || customerData?.point_balance || 0;

  // Auth error UI
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl max-w-md mx-auto overflow-hidden p-6 text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">
            Authentication Required
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Please access this page with valid customer credentials.
          </p>
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
            <p className="font-medium mb-1">Required URL format:</p>
            <p className="font-mono text-xs break-all">
              ?customerID=YOUR_ID&apiKey=YOUR_KEY
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading UI (first load only)
  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative">
          <div
            className="h-52 flex items-center justify-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
          >
            <div className="p-4 poppins-text items-center bg-white rounded-2xl space-y-2 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-28"></div>
            </div>
          </div>
          <div className="w-full bg-white top-38 absolute rounded-t-3xl p-4 mt-10">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center border-b border-b-[#F8F8F8] p-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="w-16">
                    <div className="h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl max-w-md mx-auto overflow-hidden p-6 text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">
            Error Loading History
          </div>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <div
          className="h-52 flex items-center justify-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
          }}
        >
          <div
            className={`p-4 poppins-text items-center bg-white rounded-2xl space-y-2 ${theme.styles.cardBorder} ${theme.colors.shadow}`}
          >
            <h2
              className="text-xl font-semibold"
              style={{ color: theme.colors.text.primary }}
            >
              {customerName.toUpperCase()}
            </h2>
            <h1
              className="text-3xl font-semibold"
              style={{ color: theme.colors.accent }}
            >
              {formatPoints(pointBalance)}
            </h1>
            <h3 className="text-[#6B7276] text-sm font-medium">
              Total Point Balance
            </h3>
            <div
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${theme.styles.tierBadge}`}
              style={{
                backgroundColor: theme.colors.background.tier,
                color: theme.colors.text.tier,
              }}
            >
              {customerTier} Member
            </div>
          </div>
        </div>
        <div className="w-full bg-white top-38 absolute rounded-t-3xl p-4 mt-10 pb-20 max-h-[80vh] overflow-auto">
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                No transaction history found
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Your transaction history will appear here once you start earning
                or redeeming points
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 poppins-text">
                  Transaction History
                </h3>
                {pagination && (
                  <span className="text-xs text-gray-500 poppins-text">
                    {pagination.total_count} transactions
                  </span>
                )}
              </div>
              {transactions.map((item, idx) => {
                const lastItem = transactions.length === idx + 1;
                return (
                  <div
                    key={item.id}
                    ref={lastItem ? lastRowRef : null}
                    className="flex items-center mb-2 border-b border-b-[#F8F8F8] p-3"
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full mr-3 
                        ${
                          item.type === "earned"
                            ? "bg-[#E5FFF1]"
                            : "bg-[#FFE7E7]"
                        }`}
                    >
                      {item.type === "earned" ? (
                        <img src={plus} alt="plus" className="w-5 h-7" />
                      ) : (
                        <img src={minus} alt="minus" className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1 poppins-text">
                      <div className="font-medium text-[#1E2022] text-sm mb-2">
                        {item.title}
                      </div>
                      <div className="text-xs opacity-40">
                        {item.description}
                      </div>
                    </div>
                    <div
                      className={`font-medium text-xs poppins-text ${
                        item.type === "earned"
                          ? "text-[#00BC06]"
                          : "text-[#ED4747]"
                      }`}
                    >
                      {item.type === "earned" ? "+" : "-"}
                      {item.points} <span className="text-xs">pts</span>
                      <div className="text-[#000] opacity-40 text-xs mt-1">
                        {item.date}
                      </div>
                    </div>
                  </div>
                );
              })}
              {isLoadingMore && (
                <div className="flex justify-center py-3 text-xs text-gray-500">
                  Loading more transactions...
                </div>
              )}
              {!pagination?.has_next && transactions.length > 0 && (
                <div className="flex justify-center py-3 text-gray-400 text-xs">
                  You've reached the end of your transaction history
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointsHistory;
