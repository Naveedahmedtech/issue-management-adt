import { useEffect, useState } from "react";
import { useGetRecentProjectsQuery } from "../../../redux/features/projectsApi";
import AllProjectsCards from "../components/AllProjects";
import InputField from "../../../components/form/InputField";
import SelectField from "../../../components/form/SelectField";
import DateField from "../../../components/form/DateField";
import { PROJECT_STATUS } from "../../../constant";
import { FiFilter, FiX } from "react-icons/fi";

const AllProjects = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [projects, setProjects] = useState();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data, error, isLoading } = useGetRecentProjectsQuery({
    page: currentPage,
    limit: 20,
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
    if (data?.data?.projects) {
      setProjects(data.data.projects);
      setTotalPages(Math.ceil(data?.data?.totalProjects / data?.data?.limit));
    }
  }, [data]);

  const renderFilters = (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
      <div className="md:col-span-2">
        <InputField
          name="search"
          type="text"
          label=""
          value={search}
          placeholder="Search by title..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="md:col-span-1">
        <SelectField
          label=""
          options={[
            { label: "All Status", value: "" },
            { label: PROJECT_STATUS.COMPLETED, value: PROJECT_STATUS.COMPLETED.toUpperCase() },
            { label: PROJECT_STATUS.ON_GOING, value: PROJECT_STATUS.ON_GOING.toUpperCase() },
            { label: PROJECT_STATUS.ACTIVE, value: PROJECT_STATUS.ACTIVE.toUpperCase() },
          ]}
          value={status ? { label: status, value: status } : { label: "All Status", value: "" }}
          onChange={(option) => setStatus(option?.value || "")}
        />
      </div>
      <div className="md:col-span-1">
        <SelectField
          label=""
          options={[
            { label: "Newest First", value: "desc" },
            { label: "Oldest First", value: "asc" },
          ]}
          value={{
            label: sortOrder === "desc" ? "Newest First" : "Oldest First",
            value: sortOrder,
          }}
          onChange={(option) => setSortOrder(option?.value || "desc")}
        />
      </div>
      <div className="md:col-span-1">
        <DateField
          label=""
          placeholderText="Start Date"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
      </div>
      <div className="md:col-span-1">
        <DateField
          label=""
          placeholderText="End Date"
          selected={endDate}
          onChange={(date) => setEndDate(date)}
        />
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Mobile Filter Button */}
      <div className="sticky top-5 md:hidden flex justify-end p-2">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center gap-2 bg-primary text-text px-4 py-2 rounded-md shadow hover:bg-primaryDark transition"
        >
          <FiFilter className="text-lg" />
          <span>Filters</span>
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block bg-backgroundShade2 text-textDark p-4 rounded-md shadow-md mb-6">
        {renderFilters}
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end md:hidden">
          <div className="bg-backgroundShade2 w-full rounded-t-2xl p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filter Projects</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-500 hover:text-black text-2xl"
              >
                <FiX />
              </button>
            </div>
            {renderFilters}
          </div>
        </div>
      )}

      {/* Projects Table */}
      <AllProjectsCards
        projects={projects}
        error={error}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AllProjects;
