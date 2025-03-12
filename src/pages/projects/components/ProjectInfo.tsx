import React, { useState } from "react";
import { FaCalendarAlt, FaRegClock, FaBuilding, FaUser } from "react-icons/fa";
import { format } from "date-fns";

interface ProjectInfoProps {
  projectData: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    startDate: string | null;
    endDate: string | null;
    companyName: string | null;
    user: {
      displayName: string;
    };
    company: {
      id: string;
      name: string;
    }
  };
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ projectData }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const getStatusBadge = (status: string) => {
    const badgeColor = {
      completed: "bg-success",
      "in progress": "bg-todo",
      pending: "bg-pending",
    }[status?.toLowerCase()] || "bg-yellow-500";

    return (
      <span className={`px-3 py-1 text-xs font-semibold text-text rounded-full ${badgeColor}`}>
        {status}
      </span>
    );
  };

  const formattedStartDate = projectData?.startDate
    ? format(new Date(projectData.startDate), "MMM dd, yyyy")
    : "N/A";

  const formattedEndDate = projectData?.endDate
    ? format(new Date(projectData.endDate), "MMM dd, yyyy")
    : "N/A";

  return (
    <div className="bg-backgroundShade1 px-4 py-3 rounded-lg shadow-sm mb-5">
      {/* Title */}
      <h3 className="text-lg font-semibold text-primary truncate">{projectData?.title}</h3>

      {/* Description with Show More/Less */}
      <div className="mt-1 text-sm text-textLight">
        {showFullDescription ? projectData?.description : projectData?.description?.slice(0, 100)}
        {projectData?.description && projectData.description.length > 100 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="ml-2 text-primary text-xs font-medium hover:underline"
          >
            {showFullDescription ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      {/* Project Details in a Single Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm text-text mt-3">
        {/* Status */}
        <div className="flex items-center space-x-2">
          <FaRegClock className="text-primary text-sm" />
          <div className="flex flex-col">
            <span className="text-xs text-textLight">Status</span>
            {getStatusBadge(projectData?.status)}
          </div>
        </div>

        {/* Start & End Dates */}
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="text-primary text-sm" />
          <div className="flex flex-col">
            <span className="text-xs text-textLight">Start - End</span>
            <span>{formattedStartDate} → {formattedEndDate}</span>
          </div>
        </div>

        {/* Company Name */}
        <div className="flex items-center space-x-2">
          <FaBuilding className="text-primary text-sm" />
          <div className="flex flex-col">
            <span className="text-xs text-textLight">Company</span>
            <span>{projectData?.company?.name || "N/A"}</span>
          </div>
        </div>

        {/* Created By */}
        <div className="flex items-center space-x-2">
          <FaUser className="text-primary text-sm" />
          <div className="flex flex-col">
            <span className="text-xs text-textLight">Created By</span>
            <span>{projectData?.user?.displayName || "Unknown"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
