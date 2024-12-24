import { useState } from "react";
import Tabs from "../../../components/Tabs";
import Board from "../../../components/Board";
import Documents from "../../../components/Board/Documents";
import ProjectInfo from "../components/ProjectInfo";
import { Link, useParams } from "react-router-dom";
import { APP_ROUTES } from "../../../constant/APP_ROUTES.ts";
import ModalContainer from "../../../components/modal/ModalContainer.tsx";

const ProjectDetails = () => {
    const [activeTab, setActiveTab] = useState("board");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const params = useParams();
    const { projectId } = params;

    const tabs = [
        { id: "board", label: "Issues on Board" },
        { id: "documents", label: "Documents" },
        { id: "info", label: "Project Info" }, // New tab for Project Info
    ];

    const renderActiveTab = () => {
        switch (activeTab) {
            case "board":
                return <Board />;
            case "documents":
                return <Documents />;
            case "info":
                return <ProjectInfo projectId={projectId} />; // Render the ProjectInfo component
            default:
                return null;
        }
    };

    const handleDelete = () => {
        // Perform the delete operation (e.g., API call)
        console.log(`Project with ID ${projectId} deleted`);
        setIsDeleteModalOpen(false); // Close the modal after deletion
    };

    return (
        <main className="p-6">
            <div className="flex justify-between items-center mb-4">
                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="flex space-x-4">
                    <Link
                        to={`${APP_ROUTES.APP.PROJECTS.EDIT}/${projectId}`}
                        className="px-4 py-2 bg-primary rounded-md hover:bg-primary-dark transition-all"
                    >
                        Edit Project
                    </Link>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-4 py-2 bg-error rounded-md transition-all"
                    >
                        Delete Project
                    </button>
                </div>
            </div>
            <div>{renderActiveTab()}</div>

            {/* Delete Confirmation Modal */}
            <ModalContainer
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Project Confirmation"
            >
                <p className="text-text">
                    Are you sure you want to delete this project? This action cannot be undone.
                </p>
                <div className="flex justify-end mt-6 space-x-4">
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="px-4 py-2 bg-backgroundShade2 rounded-md hover:bg-backgroundShade1"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-error rounded-md"
                    >
                        Delete
                    </button>
                </div>
            </ModalContainer>
        </main>
    );
};

export default ProjectDetails;
