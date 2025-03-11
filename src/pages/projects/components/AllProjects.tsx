import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { APP_ROUTES } from "../../../constant/APP_ROUTES";
import { PROJECT_STATUS } from "../../../constant";
import PaginatedCardList from "../../../components/PaginatedCardList";

interface Project {
    id: string;
    title: string;
    status: string;
    startDate?: string;
    endDate?: string;
}

const AllProjectsCards: React.FC<{ projects: any, error?: any, isLoading: boolean, totalPages: number, currentPage: number, onPageChange?: (e: number) => void; }> = ({ projects, error, isLoading, totalPages, currentPage, onPageChange }) => {

    const navigate = useNavigate();

    const getStatusBadge = (status: string) => {
        let color = "bg-gray-500";
        switch (status?.toUpperCase()) {
            case PROJECT_STATUS.COMPLETED.toUpperCase():
                color = "bg-success text-white";
                break;
            case PROJECT_STATUS.ON_GOING.toUpperCase():
                color = "bg-todo text-white";
                break;
            case PROJECT_STATUS.ACTIVE.toUpperCase():
                color = "bg-pending text-white";
                break;
            default:
                color = "bg-gray-500 text-white";
        }
        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{status}</span>;
    };

    const renderProjectCard = (project: Project) => (
        <div
            key={project.id}
            className="border border-border rounded-lg p-4 shadow-lg bg-background hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => navigate(APP_ROUTES.APP.PROJECTS.DETAILS.replace(":projectId", project.id))}
        >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-bold text-text">{project.title}</h3>
                <div>{getStatusBadge(project.status)}</div>
            </div>

            {/* Card Content */}
            <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-textSecondary">
                    <span className="font-medium">Start Date:</span>{" "}
                    {project.startDate ? format(new Date(project.startDate), 'PP') : "N/A"}
                </p>
                <p className="text-sm text-textSecondary">
                    <span className="font-medium">End Date:</span>{" "}
                    {project.endDate ? format(new Date(project.endDate), 'PP') : "N/A"}
                </p>
            </div>

            {/* Card Footer */}
            <div className="mt-2">
                <Link
                    to={APP_ROUTES.APP.PROJECTS.DETAILS.replace(":projectId", project.id)}
                    className="inline-flex items-center text-primary font-semibold hover:text-hover transition-colors duration-300"
                >
                    <span>View Project</span>
                    <span className="ml-2">→</span>
                </Link>
            </div>
        </div>
    );

    return (
        <div>
            <main className="">
                <section className="mb-8">
                    {error && <p className="text-error text-lg font-semibold">Failed to load recent projects.</p>}
                    {isLoading ? <p className="text-text text-lg">Loading...</p> :  projects?.length > 0 ? (
                        <PaginatedCardList
                            data={projects}
                            renderCard={renderProjectCard}
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={onPageChange}
                        />
                    ) : (
                        <div className="text-center p-6 bg-backgroundShade1 border border-border rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-textSecondary">No projects found</h3>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default AllProjectsCards;
