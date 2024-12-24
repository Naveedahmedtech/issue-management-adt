import React from "react";

interface ProjectInfoProps {
    projectId: string | undefined;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ projectId }) => {
    // Mocked project data; replace with API call or prop data
    const project = {
        id: projectId,
        title: "Website Redesign",
        description: "Revamping the company website with a modern design.",
        status: "In Progress",
        startDate: "2024-12-01",
        endDate: "2024-12-31",
    };

    return (
        <div className="p-4 bg-backgroundShade1 rounded-md shadow-md">
            <h3 className="text-xl font-bold text-text mb-4">{project.title}</h3>
            <p className="text-text mb-2">
                <strong>Description:</strong> {project.description}
            </p>
            <p className="text-text mb-2">
                <strong>Status:</strong> {project.status}
            </p>
            <p className="text-text mb-2">
                <strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}
            </p>
            <p className="text-text mb-2">
                <strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}
            </p>
        </div>
    );
};

export default ProjectInfo;
