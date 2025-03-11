import { useEffect, useState } from "react";
import { useGetRecentProjectsQuery } from "../../../redux/features/projectsApi";
import AllProjectsCards from "../components/AllProjects";
import InputField from "../../../components/form/InputField";
import SelectField from "../../../components/form/SelectField";
import DateField from "../../../components/form/DateField";
import { PROJECT_STATUS } from "../../../constant";

const AllProjects = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [projects, setProjects] = useState();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState("desc");

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

  return (
    <div>
      {/* Filters Bar */}
      <div className="flex flex-wrap  items-center gap-4 bg-backgroundShade1 p-4 rounded-md shadow-md mb-6">
        {/* Search Field */}
        <div className="">
          <InputField
            name="search"
            type="text"
            label=""
            value={search}
            placeholder="Search by title..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="">
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


        {/* Sort Order */}
        <div className="">
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

        
        {/* Start Date Filter */}
        <div className="">
          <DateField
            label=""
            placeholderText="Start Date"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>

        {/* End Date Filter */}
        <div className="">
          <DateField
            label=""
            placeholderText="End Date"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>
      </div>

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
