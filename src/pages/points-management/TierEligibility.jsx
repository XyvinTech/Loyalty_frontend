import {
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import StyledButton from "../../ui/StyledButton";
import StyledSearchInput from "../../ui/StyledSearchInput";
import { useState, useMemo } from "react";
import AddTierEligibility from "../../components/points-management/AddTierEligibility";
import StyledTable from "../../ui/StyledTable";
import DeleteModal from "../../ui/DeleteModal";
import RefreshButton from "../../ui/RefreshButton";
import Loader from "../../ui/Loader";
import { useTierEligibility } from "../../hooks/useTierEligibility";
import useUiStore from "../../store/ui";

const TierEligibility = () => {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { useGetTierEligibilityCriteria, useDeleteTierEligibilityCriteria } =
    useTierEligibility();

  const deleteMutation = useDeleteTierEligibilityCriteria();
  const { addToast } = useUiStore();

  const {
    data: criteriaData,
    isLoading,
    isFetching,
    refetch,
    dataUpdatedAt,
  } = useGetTierEligibilityCriteria({
    page,
    limit,
    search: searchTerm,
  });


  const handleEdit = (id) => {
    setData({ id });
    setOpen(true);
  };

  const handleDeleteOpen = async (id) => {
    setData(id);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    deleteMutation.mutate(data, {
      onSuccess: (response) => {
        addToast({
          type: "success",
          message: response?.message ?? "Deleted successfully.",
        });
        setDeleteOpen(false);
        setData(null);
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error?.message ?? "Delete failed.",
        });
      },
    });
  };

  // Search is now handled by the backend

  const tableRows = useMemo(() => {
    const criteriaList = criteriaData?.data?.criteria;
    if (!criteriaList || criteriaList.length === 0) {
      return (
        <tr>
          <td
            colSpan="7"
            className="px-6 py-4 text-center text-gray-500 text-sm"
          >
            No data available
          </td>
        </tr>
      );
    }

    return criteriaList.map((item) => (
      <tr key={item._id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="font-medium text-gray-900">
            {item.tier_id?.name?.en || item.tier_id?.name || "N/A"}
          </div>
          <div className="text-sm text-gray-500">
            {item.tier_id?.points_required} points required
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {item.net_earning_required} points
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {item.evaluation_period_days} days
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {item.consecutive_periods_required} periods
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <div className="flex items-center space-x-1">
            {item.settings?.require_consecutive ? (
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
            ) : (
              <XCircleIcon className="h-4 w-4 text-red-500" />
            )}
            <span>Consecutive</span>
          </div>
          {item.settings?.grace_periods_allowed > 0 && (
            <div className="text-gray-600">
              Grace: {item.settings.grace_periods_allowed}
            </div>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              item.is_active
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {item.is_active ? "Active" : "Inactive"}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <button
              className="text-slate-400 hover:text-green-700 p-1 rounded-lg hover:bg-green-50"
              onClick={() => handleEdit(item._id)}
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 transition-colors"
              onClick={() => handleDeleteOpen(item._id)}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    ));
  }, [criteriaData?.data?.criteria, handleEdit, handleDeleteOpen]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tier Eligibility Criteria
          </h1>
          <p className="text-gray-600 mt-1">
            Manage tier upgrade requirements and evaluation criteria
          </p>
        </div>
        <div className="flex space-x-3">
          <RefreshButton onClick={refetch} isLoading={isFetching} />
          <StyledButton
            name="Add Criteria"
            onClick={() => setOpen(true)}
          ></StyledButton>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <StyledSearchInput
              placeholder="Search by tier, points, or days..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:max-w-md"
            />
            <div className="text-sm text-gray-500">
              Total: {criteriaData?.data?.pagination?.total_count || 0} criteria
            </div>
          </div>
        </div>

        <StyledTable
          paginationProps={{
            currentPage: page,
            totalCount: criteriaData?.data?.pagination?.total_count || 0,
            itemsPerPage: limit,
            setCurrentPage: setPage,
            setItemsPerPage: () => {},
          }}
        >
          <thead className="bg-gray-50 w-full">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Earning Required
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Evaluation Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Consecutive Periods
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Settings
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableRows}
          </tbody>
        </StyledTable>
      </div>

      <AddTierEligibility open={open} setOpen={setOpen} data={data} />

      <DeleteModal
        data="Tier Eligibility Criteria"
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        confirmLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default TierEligibility;
