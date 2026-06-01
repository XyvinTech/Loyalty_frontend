import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  ClockIcon,
  CreditCardIcon,
  GiftIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useCustomers } from "../../hooks/useCustomers";
import Loader from "../../ui/Loader";
import StyledTable from "../../ui/StyledTable";
import RefreshButton from "../../ui/RefreshButton";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const txTypeStyles = {
  earn: "bg-green-100 text-green-700",
  redeem: "bg-blue-100 text-blue-700",
  "offer-redeem": "bg-purple-100 text-purple-700",
  adjust: "bg-yellow-100 text-yellow-700",
  expire: "bg-red-100 text-red-700",
  tier_upgrade: "bg-indigo-100 text-indigo-700",
  tier_downgrade: "bg-orange-100 text-orange-700",
};

const statusStyles = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
  expired: "bg-red-100 text-red-700",
};

const formatPoints = (points, type) => {
  if (type === "adjust") {
    return (
      <span className="font-medium text-indigo-600">
        {Number(points).toLocaleString()}
      </span>
    );
  }
  const isNeg = type === "redeem" || type === "expire" || type === "offer-redeem";
  const sign = !isNeg ? "+" : "";
  const color = !isNeg ? "text-green-600" : "text-red-600";
  return (
    <span className={`font-medium ${color}`}>
      {sign}
      {Number(points).toLocaleString()}
    </span>
  );
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "—";

const StatCard = ({ label, value, icon: Icon, color = "indigo" }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
      <div className={`p-2 rounded-lg ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value ?? "—"}</p>
      </div>
    </div>
  );
};

// ─── Tab: Transactions ────────────────────────────────────────────────────────

const TX_TYPES = ["all", "earn", "redeem", "offer-redeem", "adjust", "expire"];

const TransactionsTab = ({ customerId }) => {
  const { useGetCustomerTransactions } = useCustomers();
  const [params, setParams] = useState({ page: 1, limit: 15 });
  const [typeFilter, setTypeFilter] = useState("all");

  const queryParams = {
    ...params,
    ...(typeFilter !== "all" ? { transaction_type: typeFilter } : {}),
  };

  const { data, isLoading, isFetching, refetch } = useGetCustomerTransactions(
    customerId,
    queryParams
  );

  const transactions = data?.data?.transactions || [];
  const pagination = data?.data?.pagination || {};
  const pointsSummary = data?.data?.points_summary;

  return (
    <div className="space-y-4">
      {pointsSummary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total Earned" value={pointsSummary.total_earned?.toLocaleString()} icon={CreditCardIcon} color="green" />
          <StatCard label="Total Spent" value={Math.abs(pointsSummary.total_spent || 0).toLocaleString()} icon={TagIcon} color="red" />
          <StatCard label="Balance" value={pointsSummary.balance?.toLocaleString()} icon={CheckBadgeIcon} color="indigo" />
          <StatCard label="Expiring (30d)" value={pointsSummary.expiring_soon?.toLocaleString()} icon={ClockIcon} color="amber" />
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {TX_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTypeFilter(t);
                setParams((p) => ({ ...p, page: 1 }));
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                typeFilter === t
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>
        <RefreshButton onClick={() => refetch()} isLoading={isFetching} />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <StyledTable
          pagination={{
            currentPage: pagination.currentPage || params.page,
            totalPages: pagination.totalPages || 1,
            totalItems: pagination.totalItems || 0,
            itemsPerPage: params.limit,
            onPageChange: (p) => setParams((prev) => ({ ...prev, page: p })),
            setItemsPerPage: (l) => setParams((prev) => ({ ...prev, limit: l, page: 1 })),
          }}
        >
          <thead className="bg-gray-50">
            <tr>
              {["Transaction ID", "Type", "Points", "Status", "Date"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs font-mono text-gray-600 max-w-[180px] truncate" title={tx.transaction_id}>
                    {tx.transaction_id || tx._id}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${txTypeStyles[tx.transaction_type] || "bg-gray-100 text-gray-600"}`}>
                      {tx.transaction_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{formatPoints(tx.points, tx.transaction_type)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[tx.status] || "bg-gray-100 text-gray-600"}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(tx.transaction_date)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </StyledTable>
      )}
    </div>
  );
};

// ─── Tab: Redeemed Offers ─────────────────────────────────────────────────────

const RedeemedOffersTab = ({ customerId }) => {
  const { useGetCustomerTransactions } = useCustomers();
  const [params, setParams] = useState({ page: 1, limit: 15 });

  const { data, isLoading, isFetching, refetch } = useGetCustomerTransactions(
    customerId,
    { ...params, transaction_type: "offer-redeem" }
  );

  const transactions = data?.data?.transactions || [];
  const pagination = data?.data?.pagination || {};

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <RefreshButton onClick={() => refetch()} isLoading={isFetching} />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <StyledTable
          pagination={{
            currentPage: pagination.currentPage || params.page,
            totalPages: pagination.totalPages || 1,
            totalItems: pagination.totalItems || 0,
            itemsPerPage: params.limit,
            onPageChange: (p) => setParams((prev) => ({ ...prev, page: p })),
            setItemsPerPage: (l) => setParams((prev) => ({ ...prev, limit: l, page: 1 })),
          }}
        >
          <thead className="bg-gray-50">
            <tr>
              {["Offer Title", "Points Used", "Status", "Date Redeemed"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {tx.metadata?.coupon_title || tx.metadata?.offer_title || "—"}
                    {tx.metadata?.coupon_discount && (
                      <span className="ml-2 text-xs text-gray-400">({tx.metadata.coupon_discount})</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-red-600">
                    -{Math.abs(tx.points).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[tx.status] || "bg-gray-100 text-gray-600"}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(tx.transaction_date)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">
                  No redeemed offers found
                </td>
              </tr>
            )}
          </tbody>
        </StyledTable>
      )}
    </div>
  );
};

// ─── Tab: Activity Timeline ───────────────────────────────────────────────────

const ActivityTab = ({ customerId }) => {
  const { useGetCustomerTransactions } = useCustomers();

  const { data, isLoading, isFetching, refetch } = useGetCustomerTransactions(
    customerId,
    { page: 1, limit: 50 }
  );

  const transactions = data?.data?.transactions || [];

  const activityIcon = (type) => {
    switch (type) {
      case "earn": return "🟢";
      case "redeem": return "🔵";
      case "offer-redeem": return "🎁";
      case "expire": return "🔴";
      case "adjust": return "🟡";
      case "tier_upgrade": return "⬆️";
      case "tier_downgrade": return "⬇️";
      default: return "⚪";
    }
  };

  const activityDescription = (tx) => {
    switch (tx.transaction_type) {
      case "earn":
        return `Earned ${tx.points?.toLocaleString()} points`;
      case "redeem":
        return `Redeemed ${Math.abs(tx.points)?.toLocaleString()} points`;
      case "offer-redeem":
        return `Redeemed offer: ${tx.metadata?.coupon_title || "Offer"}`;
      case "expire":
        return `${Math.abs(tx.points)?.toLocaleString()} points expired`;
      case "adjust":
        return `Points adjusted: ${tx.points > 0 ? "+" : ""}${tx.points?.toLocaleString()}`;
      case "tier_upgrade":
        return "Tier upgraded";
      case "tier_downgrade":
        return "Tier downgraded";
      default:
        return tx.transaction_type;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <RefreshButton onClick={() => refetch()} isLoading={isFetching} />
      </div>

      {isLoading ? (
        <Loader />
      ) : transactions.length > 0 ? (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />
          <ul className="space-y-3">
            {transactions.map((tx) => (
              <li key={tx._id} className="flex items-start gap-4 pl-2">
                <div className="relative z-10 flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-white border border-gray-200 text-base shadow-sm">
                  {activityIcon(tx.transaction_type)}
                </div>
                <div className="flex-1 bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                  <p className="text-sm font-medium text-gray-900">{activityDescription(tx)}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[tx.status] || "bg-gray-100 text-gray-600"}`}>
                      {tx.status}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(tx.transaction_date)}</span>
                    {tx.metadata?.requested_by && (
                      <span className="text-xs text-gray-400">via {tx.metadata.requested_by}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-gray-400 text-sm py-10">No activity found</p>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "transactions", label: "Transaction History", icon: CreditCardIcon },
  { id: "offers", label: "Redeemed Offers", icon: GiftIcon },
  { id: "activity", label: "Activity", icon: ClockIcon },
];

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useGetCustomerById, useGetCustomerDashboard } = useCustomers();
  const [activeTab, setActiveTab] = useState("transactions");

  const { data: customerData, isLoading: isLoadingCustomer } = useGetCustomerById(id);
  const { data: dashboardData, isLoading: isLoadingDashboard } = useGetCustomerDashboard(id);

  const customer = customerData?.data;
  const dashboard = dashboardData?.data;

  if (isLoadingCustomer) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-20 text-gray-400">Customer not found.</div>
    );
  }

  const tierProgress = dashboard?.tier_progress;

  return (
    <div className="space-y-6">
      {/* Back button + header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/customers")}
          className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Customer Details</h1>
          <p className="text-xs text-gray-400 font-mono">{customer.customer_id}</p>
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
          <div>
            <p className="text-xs text-gray-500">Customer ID</p>
            <p className="text-sm font-mono font-medium text-gray-900">{customer.customer_id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${customer.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {customer.status ? "Active" : "Inactive"}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500">Tier</p>
            <p className="text-sm font-medium text-indigo-600">{customer.tier?.name?.en || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Points</p>
            <p className="text-sm font-semibold text-gray-900">{customer.total_points?.toLocaleString() ?? 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Coins</p>
            <p className="text-sm font-medium text-gray-900">{customer.coins?.toLocaleString() ?? 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">App Type</p>
            <p className="text-sm text-gray-700">{customer.app_type?.map?.((a) => a.name).join(", ") || customer.app_type?.name || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Referral Code</p>
            <p className="text-sm font-mono text-gray-700">{customer.referral_code || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Registered</p>
            <p className="text-sm text-gray-700">{formatDate(customer.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Last Active</p>
            <p className="text-sm text-gray-700">{formatDate(customer.last_active)}</p>
          </div>
        </div>

        {/* Tier progress bar */}
        {tierProgress && !isLoadingDashboard && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Tier Progress</span>
              <span>{tierProgress.current_points?.toLocaleString()} / {tierProgress.points_for_next_tier?.toLocaleString()} pts to next tier</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(tierProgress.progress_percentage || 0, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-5">
          {activeTab === "transactions" && <TransactionsTab customerId={id} />}
          {activeTab === "offers" && <RedeemedOffersTab customerId={id} />}
          {activeTab === "activity" && <ActivityTab customerId={id} />}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
