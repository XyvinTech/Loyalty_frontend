import StyledPagination from "./StyledPagination";

const StyledTable = ({ children, paginationProps }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden w-full">
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 w-full">
          {children}
        </table>
      </div>
      {paginationProps && <StyledPagination {...paginationProps} />}
    </div>
  );
};

export default StyledTable;
