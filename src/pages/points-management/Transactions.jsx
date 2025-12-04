import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import StyledButton from "../../ui/StyledButton";
import RefreshButton from "../../ui/RefreshButton";
import {
  ArrowDownTrayIcon,
  EyeIcon,
  XMarkIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import StyledTable from "../../ui/StyledTable";
import Loader from "../../ui/Loader";
import { useTransaction } from "../../hooks/useTransaction";

// Transaction type badge styles
const transactionTypeStyles = {
  earn: "bg-green-100 text-green-700",
  redeem: "bg-blue-100 text-blue-700",
  adjust: "bg-yellow-100 text-yellow-700",
  expire: "bg-red-100 text-red-700",
};

// Transaction status badge styles
const statusStyles = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
  expired: "bg-red-100 text-red-700",
};

// Filter options
const transactionTypes = ["earn", "redeem", "adjust", "expire"];
const statusOptions = [
  "completed",
  "pending",
  "failed",
  "cancelled",
  "expired",
];

// Format points with sign and color
const formatPoints = (points, type) => {
  if (type === "adjust") {
    // For adjustments, use neutral color and no sign
    return (
      <span className="font-medium text-indigo-600">
        {points.toLocaleString()}
      </span>
    );
  }

  const value =
    type === "redeem" || type === "expire" ? -Math.abs(points) : points;
  const textColor = value >= 0 ? "text-green-600" : "text-red-600";
  const sign = type === "earn" ? "+" : ""; // Only show + for earn transactions

  return (
    <span className={`font-medium ${textColor}`}>
      {sign}
      {value.toLocaleString()}
    </span>
  );
};

// Filter Modal Component
const FilterModal = ({ filters, onClose, onApply }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 mt-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          {" "}
          <h2 className="text-lg font-semibold">Filter Transactions</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto space-y-4 flex-1">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </label>
            <select
              className="w-full rounded-md border border-gray-300 p-2"
              value={localFilters.transaction_type || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  transaction_type: e.target.value || undefined,
                })
              }
            >
              <option value="">All Types</option>
              {transactionTypes.map((type) => (
                <option key={type} value={type} className="capitalize">
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full rounded-md border border-gray-300 p-2"
              value={localFilters.status || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  status: e.target.value || undefined,
                })
              }
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status} className="capitalize">
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 p-2"
              value={localFilters.start_date || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  start_date: e.target.value || undefined,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 p-2"
              value={localFilters.end_date || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  end_date: e.target.value || undefined,
                })
              }
            />
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              className="w-full rounded-md border border-gray-300 p-2"
              value={localFilters.sort_by || "transaction_date"}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, sort_by: e.target.value })
              }
            >
              <option value="transaction_date">Date</option>
              <option value="points">Points</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort Order
            </label>
            <select
              className="w-full rounded-md border border-gray-300 p-2"
              value={localFilters.sort_order || "desc"}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, sort_order: e.target.value })
              }
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end space-x-3 sticky bottom-0 bg-white z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <StyledButton name="Apply Filters" onClick={handleApply} />
        </div>
      </div>
    </div>
  );
};

FilterModal.propTypes = {
  filters: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

// Transaction Detail Modal Component
const TransactionDetailModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Transaction Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Customer Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Customer ID: {transaction.customer_id?.customer_id || transaction.customer_id}
                </p>
              </div>
            </div>

            {/* Transaction Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Transaction Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Transaction ID:</span>
                  <span className="text-sm font-mono">
                    {transaction.transaction_id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                      transactionTypeStyles[
                        transaction.transaction_type.toLowerCase()
                      ]
                    }`}
                  >
                    {transaction.transaction_type}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Points:</span>
                  {formatPoints(
                    transaction.points,
                    transaction.transaction_type.toLowerCase()
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                      statusStyles[transaction.status.toLowerCase()]
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm">
                    {new Date(transaction.transaction_date).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {(transaction.note ||
              transaction.reference_id ||
              transaction.payment_method) && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Additional Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {transaction.payment_method && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Payment Method:
                      </span>
                      <span className="text-sm capitalize">
                        {transaction.payment_method}
                      </span>
                    </div>
                  )}
                  {transaction.reference_id && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Reference ID:
                      </span>
                      <span className="text-sm font-mono">
                        {transaction.reference_id}
                      </span>
                    </div>
                  )}
                  {transaction.note && (
                    <div>
                      <span className="text-sm text-gray-600 block mb-1">
                        Note:
                      </span>
                      <p className="text-sm text-gray-800 bg-white p-2 rounded">
                        {transaction.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

TransactionDetailModal.propTypes = {
  transaction: PropTypes.shape({
    customer_id: PropTypes.shape({
      name: PropTypes.string,
    }),
    transaction_id: PropTypes.string,
    transaction_type: PropTypes.string,
    points: PropTypes.number,
    status: PropTypes.string,
    transaction_date: PropTypes.string,
    payment_method: PropTypes.string,
    reference_id: PropTypes.string,
    note: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

const Transactions = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    transaction_type: undefined,
    status: undefined,
    start_date: undefined,
    end_date: undefined,
    sort_by: "transaction_date",
    sort_order: "desc",
  });

  const { useGetTransactions } = useTransaction();
  const {
    data: transactionsData,
    dataUpdatedAt,
    refetch,
    isLoading,
  } = useGetTransactions(filters);

  const transactions = transactionsData?.data?.transactions || [];
  const totalCount = transactionsData?.data?.pagination?.total || 0;

  // const handleSearch = (value) => {
  //   setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  // };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const tableRows = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return (
        <tr>
          <td
            colSpan="6"
            className="px-6 py-4 text-center text-gray-500 text-sm"
          >
            No data available
          </td>
        </tr>
      );
    }

    return transactions.map((item) => (
      <tr key={item.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {item.customer_id?.customer_id}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
              transactionTypeStyles[item.transaction_type.toLowerCase()]
            }`}
          >
            {item.transaction_type}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
          {item.transaction_id}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          {formatPoints(item.points, item.transaction_type.toLowerCase())}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
              statusStyles[item.status.toLowerCase()]
            }`}
          >
            {item.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
          <button
            onClick={() => setSelectedTransaction(item)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </td>
      </tr>
    ));
  }, [transactions]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Transactions
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Last Updated: {new Date(dataUpdatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
          <RefreshButton onClick={() => refetch()} isLoading={isLoading} />
          {/* <StyledSearchInput
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:w-auto"
          /> */}
          <StyledButton
            name={
              <>
                <FunnelIcon className="h-5 w-5" />
                Filter
              </>
            }
            onClick={() => setShowFilterModal(true)}
            variant="secondary"
          />
          {/* <StyledButton
            name={
              <>
                <ArrowDownTrayIcon className="w-4 h-4" /> Export{" "}
              </>
            }
            variant="download"
          /> */}
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.transaction_type ||
        filters.status ||
        filters.start_date ||
        filters.end_date) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.transaction_type && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Type: {filters.transaction_type}
              <XMarkIcon
                className="ml-2 h-4 w-4 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    transaction_type: undefined,
                  }))
                }
              />
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Status: {filters.status}
              <XMarkIcon
                className="ml-2 h-4 w-4 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, status: undefined }))
                }
              />
            </span>
          )}
          {filters.start_date && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              From: {new Date(filters.start_date).toLocaleDateString()}
              <XMarkIcon
                className="ml-2 h-4 w-4 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, start_date: undefined }))
                }
              />
            </span>
          )}
          {filters.end_date && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              To: {new Date(filters.end_date).toLocaleDateString()}
              <XMarkIcon
                className="ml-2 h-4 w-4 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, end_date: undefined }))
                }
              />
            </span>
          )}
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                transaction_type: undefined,
                status: undefined,
                start_date: undefined,
                end_date: undefined,
                page: 1,
              }))
            }
            className="text-xs text-indigo-600 hover:text-indigo-900"
          >
            Clear all filters
          </button>
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <StyledTable
          paginationProps={{
            currentPage: filters.page,
            totalCount,
            itemsPerPage: filters.limit,
            setCurrentPage: handlePageChange,
            setItemsPerPage: handleLimitChange,
          }}
        >
          <thead className="bg-gray-50 w-full">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableRows}
          </tbody>
        </StyledTable>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal
          filters={filters}
          onClose={() => setShowFilterModal(false)}
          onApply={(newFilters) => {
            setFilters({ ...newFilters, page: 1 });
          }}
        />
      )}
    </>
  );
};

export default Transactions;
