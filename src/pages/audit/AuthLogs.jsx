import React, { useEffect, useMemo, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import RefreshButton from "../../ui/RefreshButton";
import Loader from "../../ui/Loader";
import { useAudits } from "../../hooks/useAudit";
import StyledButton from "../../ui/StyledButton";
import ViewLog from "../../components/system-and-settings/ViewLog";
import { EyeDropperIcon, EyeIcon } from "@heroicons/react/24/outline";

const AuthLogs = () => {
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [Id, setId] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    adminName: "",
    status: "",
  });

  const { useAuthLogs } = useAudits();
  const {
    data: logs,
    dataUpdatedAt,
    isLoading,
    refetch,
  } = useAuthLogs({
    page: currentPage,
    limit: itemsPerPage,
    ...filters,
  });
  useEffect(() => {
    setCurrentPage(1); 
  }, [itemsPerPage, filters]);
  useEffect(() => {
    if (logs?.data?.pagination?.total !== undefined) {
      setTotalCount(logs.data.pagination.total);
    }
  }, [logs]);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterApply = () => {
    setCurrentPage(1);
    refetch();
  };

  const handleFilterReset = () => {
    setFilters({
      startDate: "",
      endDate: "",
      adminName: "",
      status: "",
    });
    setCurrentPage(1);
    refetch();
  };

  const tableRows = useMemo(() => {
    const logList = logs?.data?.logs;
    if (!logList || logList?.length === 0) {
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
    return logList?.map((item) => (
      <tr key={item.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {item?.details?.username}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {item?.userAgent?.length > 20
            ? item.userAgent.slice(0, 20) + "..."
            : item?.userAgent}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {" "}
          {new Date(item?.createdAt).toLocaleString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.action}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              item?.status === "success"
                ? "bg-green-100 text-green-800"
                : item?.status === "failure"
                ? "bg-red-100 text-red-800"
                : item?.status === "warning"
                ? "bg-yellow-100 text-yellow-800"
                : item?.status === "info"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {item?.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <button
              className="text-slate-400 hover:text-green-700 p-1 rounded-lg hover:bg-green-50"
              onClick={() => {
                setId(item?._id);
                setViewOpen(true);
              }}
            >
              <EyeIcon className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    ));
  }, [logs?.data?.logs]);
  const inputClass =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors";
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Authentication Logs
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Last Updated: {new Date(dataUpdatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <RefreshButton onClick={() => refetch()} isLoading={isLoading} />
        </div>
      </div>

      {/* <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-3">Filter Logs</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col">
            <label htmlFor="startDate" className="text-xs text-gray-600 mb-1">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-xs text-gray-600 mb-1">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className={inputClass}
            />
          </div>

        

          <div className="flex flex-col">
            <label htmlFor="status" className="text-xs text-gray-600 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className={inputClass}
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <StyledButton name={"Apply Filters"} onClick={handleFilterApply} />

            <StyledButton
              name={"Reset Filters"}
              onClick={handleFilterReset}
              variant="download"
            />
          </div>
        </div>
      </div> */}

      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-6">
          <StyledTable
            paginationProps={{
              currentPage,
              totalCount,
              itemsPerPage,
              setCurrentPage,
              setItemsPerPage,
            }}
          >
            <thead className="bg-gray-50 w-full">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
              
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableRows}
            </tbody>
          </StyledTable>
        </div>
      )}
      <ViewLog
        id={Id}
        onClose={() => {
          setId(null);
          setViewOpen(false);
        }}
        open={viewOpen}
      />
    </div>
  );
};

export default AuthLogs;
