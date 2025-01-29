import React from "react";
import { FaCalendarAlt, FaRegClock, FaBuilding, FaUser } from "react-icons/fa";
import { format } from "date-fns";

interface ProjectInfoProps {
  projectId: string | undefined;
  projectData: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    startDate: string | null;
    endDate: string | null;
    archived: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
    companyName: string | null;
    user: {
      email: string;
      displayName: string;
    };
  };
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ projectData }) => {
  // Function to get the status badge with a dynamic color
  const getStatusBadge = (status: string) => {
    let badgeColor = "bg-yellow-500"; // Default color
    if (status.toLocaleLowerCase() === "completed") badgeColor = "bg-success";
    if (status.toLocaleLowerCase() === "in progress") badgeColor = "bg-todo";
    if (status.toLocaleLowerCase() === "pending") badgeColor = "bg-pending";

    return (
      <span
        className={`inline-block px-3 py-1 text-sm text-white font-semibold rounded-md ${badgeColor}`}
      >
        {status}
      </span>
    );
  };

  // Format dates using date-fns
  const formattedStartDate = projectData?.startDate
    ? format(new Date(projectData.startDate), "yyyy-MM-dd")
    : "N/A";

  const formattedEndDate = projectData?.endDate
    ? format(new Date(projectData.endDate), "yyyy-MM-dd")
    : "N/A";

  return (
    <div className="p-6 bg-backgroundShade1 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-primary mb-4">{projectData?.title}</h3>
      <p className="text-text text-lg mb-6">{projectData?.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Status */}
        <div className="flex items-center space-x-4">
          <FaRegClock className="text-primary text-lg" />
          <div>
            <p className="text-sm text-textLight font-medium">Status</p>
            {getStatusBadge(projectData?.status)}
          </div>
        </div>

        {/* Start Date */}
        <div className="flex items-center space-x-4">
          <FaCalendarAlt className="text-primary text-lg" />
          <div>
            <p className="text-sm text-textLight font-medium">Start Date</p>
            <p className="text-text font-medium">{formattedStartDate}</p>
          </div>
        </div>

        {/* End Date */}
        <div className="flex items-center space-x-4">
          <FaCalendarAlt className="text-primary text-lg" />
          <div>
            <p className="text-sm text-textLight font-medium">End Date</p>
            <p className="text-text font-medium">{formattedEndDate}</p>
          </div>
        </div>

        {/* Company Name */}
        <div className="flex items-center space-x-4">
          <FaBuilding className="text-primary text-lg" />
          <div>
            <p className="text-sm text-textLight font-medium">Company</p>
            <p className="text-text font-medium">
              {projectData?.companyName || "N/A"}
            </p>
          </div>
        </div>

        {/* Created By */}
        <div className="flex items-center space-x-4">
          <FaUser className="text-primary text-lg" />
          <div>
            <p className="text-sm text-textLight font-medium">Created By</p>
            <p className="text-text font-medium">
              {projectData?.user?.displayName || "Unknown"} 
              {/* ({projectData?.user?.email || "N/A"}) */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
