import { useEffect, useState } from "react";
import AllOrdersTable from "../components/AllOrders";
import InputField from "../../../components/form/InputField";
import SelectField from "../../../components/form/SelectField";
import DateField from "../../../components/form/DateField";
import { useGetRecentOrdersQuery } from "../../../redux/features/orderApi";

const AllOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orders, setOrders] = useState();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState("desc");

  const { data, error, isLoading } = useGetRecentOrdersQuery({
    page: currentPage,
    limit: 15,
    search,
    status,
    startDate: startDate ? startDate.toISOString() : "",
    endDate: endDate ? endDate.toISOString() : "",
    sortOrder,
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (data?.data?.orders) {
      setOrders(data.data.orders);
      setTotalPages(Math.ceil(data?.data?.totalOrders / data?.data?.limit));
    }
  }, [data]);

  return (
    <div>
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-backgroundShade1 p-4 rounded-md shadow-md mb-6">
        {/* Search Field */}
        <div className="flex-grow">
          <InputField
            name="search"
            type="text"
            label="Search"
            value={search}
            placeholder="Search by title..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="flex-grow">
          <SelectField
            label=""
            options={[
              { label: "All Status", value: "" },
              { label: "Completed", value: "Completed" },
              { label: "In Progress", value: "In Progress" },
              { label: "Pending", value: "Pending" },
            ]}
            value={status ? { label: status, value: status } : { label: "All Status", value: "" }}
            onChange={(option) => setStatus(option?.value || "")}
          />
        </div>

        {/* Start Date Filter */}
        <div className="flex-grow">
          <DateField
            label=""
            placeholderText="Start Date"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>

        {/* End Date Filter */}
        <div className="flex-grow">
          <DateField
            label=""
            placeholderText="End Date"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>

        {/* Sort Order */}
        <div className="flex-grow">
          <SelectField
            label=""
            options={[
              { label: "Newest First", value: "desc" },
              { label: "Oldest First", value: "asc" },
            ]}
            value={sortOrder ? { label: sortOrder === "desc" ? "Newest First" : "Oldest First", value: sortOrder } : { label: "Newest First", value: "desc" }}
            onChange={(option) => setSortOrder(option?.value || "desc")}
          />
        </div>
      </div>

      {/* Orders Table */}
      <AllOrdersTable
        orders={orders}
        error={error}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AllOrders;
