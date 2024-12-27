import React from "react";
import { FaCalendarAlt,  FaRegClock } from "react-icons/fa";

interface ProjectInfoProps {
    projectId: string | undefined;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ projectId }) => {
    const project = {
        id: projectId,
        title: "Website Redesign",
        description: "Revamping the company website with a modern design.",
        status: "In Progress",
        startDate: "2024-12-01",
        endDate: "2024-12-31",
    };

    const getStatusBadge = (status: string) => {
        let badgeColor = "bg-yellow-500"; // Default color
        if (status === "Completed") badgeColor = "bg-success";
        if (status === "In Progress") badgeColor = "bg-todo";
        if (status === "Todo") badgeColor = "bg-pending";

        return (
            <span
                className={`inline-block px-3 py-1 text-sm text-white font-semibold rounded-md ${badgeColor}`}
            >
                {status}
            </span>
        );
    };

    return (
        <div className="p-6 bg-backgroundShade1 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-primary mb-4">{project.title}</h3>
            <p className="text-text text-lg mb-6">{project.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                    <FaRegClock className="text-primary text-lg" />
                    <div>
                        <p className="text-sm text-textLight font-medium">Status</p>
                        {getStatusBadge(project.status)}
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <FaCalendarAlt className="text-primary text-lg" />
                    <div>
                        <p className="text-sm text-textLight font-medium">Start Date</p>
                        <p className="text-text font-medium">
                            {new Date(project.startDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <FaCalendarAlt className="text-primary text-lg" />
                    <div>
                        <p className="text-sm text-textLight font-medium">End Date</p>
                        <p className="text-text font-medium">
                            {new Date(project.endDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectInfo;
