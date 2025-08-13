import { useMemo, useState } from "react";
import Loader from "../../ui/Loader";
import RefreshButton from "../../ui/RefreshButton";
import StyledButton from "../../ui/StyledButton";
import StyledSearchInput from "../../ui/StyledSearchInput";
import StyledTable from "../../ui/StyledTable";
import { useSupport } from "../../hooks/useSupport";
import moment from "moment/moment";
import { useCustomers } from "../../hooks/useCustomers";
import CustomerView from "../../components/customer-management/CustomerView";
import TicketView from "../../components/customer-management/TicketView";
import { EyeIcon } from "@heroicons/react/24/outline";

const Support = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(10);
  const [view, setView] = useState(false);
  const [viewDetails, setViewDetails] = useState(false);
  const [data, setData] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { useGetSupport, useTicketById } = useSupport();
  const {
    data: ticketData,
    refetch,
    isLoading,
    dataUpdatedAt,
  } = useGetSupport();
  const { useGetCustomerById } = useCustomers();
  const { data: customerData } = useGetCustomerById(customer);
  const { data: ticketDetails } = useTicketById(data);
  const tableRows = useMemo(() => {
    const ticketList = ticketData?.data?.tickets;
    if (!ticketList || ticketList?.length === 0) {
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
    return ticketList?.map((item) => (
      <tr key={item?._id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {item?.ticket_id}
        </td>
        <td
          className="px-6 py-4 whitespace-nowrap text-sm text-green-500 cursor-pointer"
          onClick={() => {
            setView(true);
            setCustomer(item?.customer?._id);
          }}
        >
          {item?.customer?.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {item?.subject}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              item?.category === "Points"
                ? "bg-blue-200 text-blue-800"
                : item?.category === "Redemption"
                ? "bg-green-200 text-green-800"
                : item?.category === "Technical"
                ? "bg-yellow-200 text-yellow-800"
                : item?.category === "Account"
                ? "bg-purple-200 text-purple-800"
                : item?.category === "Other"
                ? "bg-gray-200 text-gray-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {item?.category}
          </span>
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              item?.status === "open"
                ? "bg-blue-200 text-blue-800"
                : item?.status === "in_progress"
                ? "bg-yellow-200 text-yellow-800"
                : item?.status === "resolved"
                ? "bg-green-200 text-green-800"
                : item?.status === "closed"
                ? "bg-gray-200 text-gray-800"
                : item?.status === "reopened"
                ? "bg-purple-200 text-purple-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {item?.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {item?.createdAt ? moment(item.createdAt).locale("en").format("M/D/YYYY") : "-"}
        </td>
        <td
          className="px-6 py-4 whitespace-nowrap text-sm hover:text-green-500 text-slate-400 cursor-pointer"
          onClick={() => {
            setViewDetails(true);
            setData(item?._id);
          }}
        >
          <EyeIcon className="w-4 h-4" />
        </td>
      </tr>
    ));
  }, [ticketData]);
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          {" "}
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Tickets
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {" "}
            Last Updated: {new Date(dataUpdatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
          <RefreshButton onClick={() => refetch()} isLoading={isLoading} />
          <StyledSearchInput
            placeholder="Search"
            className="w-full sm:w-auto"
          />
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
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
                Ticket ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
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
      )}
      <CustomerView
        data={customerData?.data}
        open={view}
        onClose={() => {
          setView(false);
          setCustomer(null);
        }}
      />
      <TicketView
        data={ticketDetails?.data}
        open={viewDetails}
        onClose={() => {
          setViewDetails(false);
          setData(null);
        }}
      />
    </div>
  );
};

export default Support;
