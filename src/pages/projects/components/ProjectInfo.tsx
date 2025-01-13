import React from "react";
import { FaCalendarAlt, FaRegClock } from "react-icons/fa";
import { format } from "date-fns";

interface ProjectInfoProps {
  projectId: string | undefined;
  projectData: {
    id: string;
    title: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
    archived: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
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
        <div className="flex items-center space-x-4">
          <FaRegClock className="text-primary text-lg" />
          <div>
            <p className="text-sm text-textLight font-medium">Status</p>
            {getStatusBadge(projectData?.status)}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <FaCalendarAlt className="text-primary text-lg" />
          <div>
            <p className="text-sm text-textLight font-medium">Start Date</p>
            <p className="text-text font-medium">{formattedStartDate}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <FaCalendarAlt className="text-primary text-lg" />
          <div>
            <p className="text-sm text-textLight font-medium">End Date</p>
            <p className="text-text font-medium">{formattedEndDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
