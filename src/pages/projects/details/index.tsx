import { useState, useEffect, useRef } from "react";
import Tabs from "../../../components/Tabs";
import Board from "../../../components/Board";
import Documents from "../../../components/Board/Documents";
import ProjectInfo from "../components/ProjectInfo";
import { useNavigate, useParams } from "react-router-dom";
import ModalContainer from "../../../components/modal/ModalContainer.tsx";
import { projectDocumentColumns } from "../../../utils/Common.tsx";
import { projectDocumentData } from "../../../mock/tasks.ts";
import FileUpload from "../../../components/form/FileUpload";
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from "../../../components/buttons/Button.tsx";
import CardLayout from "../../../components/Board/CardLayout.tsx";
import { useDeleteProjectMutation, useGetProjectByIdQuery, useGetProjectFilesQuery, useGetProjectIssuesQuery, useUploadFilesToProjectMutation } from "../../../redux/features/projectsApi.ts";
import { toast } from "react-toastify";
import { APP_ROUTES } from "../../../constant/APP_ROUTES.ts";
import { useAuth } from "../../../hooks/useAuth.ts";
import ProjectDropDown from "../components/ProjectDropDown.tsx";

const useWindowSize = () => {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

    useEffect(() => {
        const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return size;
};

const ProjectDetails = () => {
    const [activeTab, setActiveTab] = useState("board");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const [documentData, setDocumentData] = useState<any>(projectDocumentData);
    const [isEditMode, setIsEditMode] = useState(false);

    const [tasks, setTasks] = useState<any>([]);
    const [filteredTasks, setFilteredTasks] = useState<any>([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState("All"); // Filters: All, To Do, In Progress, Done

      const { userData } = useAuth();
      const { userData: { role } } = userData;
    


    const params = useParams();
    const navigate = useNavigate();
    const { projectId } = params;

    const { data: projectData } = useGetProjectByIdQuery(projectId);
    const { data: projectIssues, isLoading: isLoadingIssues, refetch: refetchIssues } = useGetProjectIssuesQuery(projectId);
    const { data: projectFiles, isLoading: isLoadingProjectFiles, refetch: refetchProjectFiles } = useGetProjectFilesQuery(projectId);
    const [uploadFilesToProject, { isLoading: isUploadingProjectFile }] = useUploadFilesToProjectMutation();
    // ✅ Use the deleteProject mutation
    const [deleteProject, { isLoading: isDeletingProject }] = useDeleteProjectMutation();


    useEffect(() => {
        if (projectFiles?.data?.files) {
            const formattedProjectFiles = projectFiles.data.files.map((file: any) => ({
                id: file.id,
                fileName: file.filePath.split("/").pop(),
                date: new Date(file.createdAt).toLocaleDateString("en-GB"),
                // type: file.filePath.split(".").pop()?.toUpperCase() || "UNKNOWN",
                type: `${file.type === "issueFile" ? `${file.type} (${file.issue.title})` : file.type}` || "UNKNOWN",
            }));

            // ✅ Replace the document data instead of merging
            setDocumentData(formattedProjectFiles);
        }
    }, [projectFiles]);


    useEffect(() => {
        if (projectIssues?.data) {
            const allTasks = projectIssues.data.flatMap((column: any) => column.tasks);
            setTasks(allTasks);
            setFilteredTasks(allTasks); // Initialize filtered tasks with all tasks
        }
    }, [projectIssues]);

    const handleFilterChange = (status: string) => {
        setActiveFilter(status);
        if (status === "All") {
            setFilteredTasks(tasks);
        } else {
            setFilteredTasks(tasks.filter((task: any) => task.status?.toUpperCase() === status?.toUpperCase()));
        }
    };

    const handleViewTask = (task: any) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleAnnotateFile = (file: any) => {
        console.log("Annotating file:", file);
        // Add logic for file annotation
    };

    const handleSignFile = (file: any) => {
        console.log("Signing file:", file);
        // Add logic for file signing
    };

    const documentColumns = projectDocumentColumns(handleAnnotateFile, handleSignFile);
    const [windowWidth] = useWindowSize();
    const isSmallScreen = windowWidth <= 768; // Small screens (e.g., tablets or mobile)



    const tabs = [
        { id: "board", label: "Issues" },
        { id: "documents", label: "Documents" },
        { id: "info", label: "Project Info" },
    ];

    const handleOutsideClick = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    const handleFileUpload = (uploadedFiles: File[]) => {
        const allowedFileTypes = [".pdf", ".xlsx"]; // Allowed file extensions
        const validFiles = uploadedFiles.filter((file) =>
            allowedFileTypes.some((type) => file.name.endsWith(type))
        );

        const excludedFiles = uploadedFiles.filter(
            (file) => !allowedFileTypes.some((type) => file.name.endsWith(type))
        );

        if (excludedFiles.length > 0) {
            alert(
                `The following files were not allowed and excluded:\n${excludedFiles
                    .map((file) => file.name)
                    .join(", ")}`
            );
        }

        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    };


    const handleUploadSubmit = async () => {
        if (files.length === 0) {
            toast.error("Please select at least one file to upload.");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });

        try {
            await uploadFilesToProject({ projectId, formData }).unwrap();
            toast.success("Files uploaded successfully!");
            setFiles([]);
            refetchProjectFiles();
            setIsUploadModalOpen(false);
        } catch (error: any) {
            console.error("Failed to upload files:", error);
            toast.error("Failed to upload files. Please try again.");
        }
    };


    useEffect(() => {
        if (dropdownOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [dropdownOpen]);

    const groupedTasks = {
        "To Do": filteredTasks.filter((task: any) => task.status.toUpperCase() === "TO DO"),
        "In Progress": filteredTasks.filter((task: any) => task.status.toUpperCase() === "IN PROGRESS"),
        "Completed": filteredTasks.filter((task: any) => task.status.toUpperCase() === "COMPLETED"),
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case "board":
                // return isSmallScreen ? <TaskTable projectId={projectId} /> : <Board />;
                return isSmallScreen ? <CardLayout
                    handleFilterChange={handleFilterChange}
                    activeFilter={activeFilter}
                    handleViewTask={handleViewTask}
                    isModalOpen={isModalOpen}
                    selectedTask={selectedTask}
                    setIsModalOpen={setIsModalOpen}
                    groupedTasks={groupedTasks}
                    isEditMode={isEditMode}
                    setIsEditMode={setIsEditMode}
                    refetch={refetchIssues}
                    isLoading={isLoadingIssues}
                /> : <Board
                    projectIssues={projectIssues?.data}
                    refetch={refetchIssues}
                    isLoading={isLoadingIssues}
                />;
            case "documents":
                return <Documents columns={documentColumns} data={documentData} setIsUploadModalOpen={setIsUploadModalOpen} isLoading={isLoadingProjectFiles} />;
            case "info":
                return <ProjectInfo projectId={projectId} projectData={projectData?.data} />;
            default:
                return null;
        }
    };

    const handleDelete = async () => {
        try {
            await deleteProject(projectId).unwrap();

            toast.success("Project deleted successfully!");
            setIsDeleteModalOpen(false);
            navigate(APP_ROUTES.APP.PROJECTS.CREATE)
        } catch (error: any) {
            console.error("Failed to delete project:", error);
            toast.error("Failed to delete project. Please try again.");
        }
    };

    const handleArchive = () => {
        console.log(`Project with ID ${projectId} archived`);
        setIsArchiveModalOpen(false);
    };

    return (
        <main className="p-6">
            <div className="flex justify-between items-center mb-4">
                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                <div ref={dropdownRef} className="relative">
                    <button
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="inline-flex justify-center w-full rounded-md border border-border bg-background py-2 px-4 text-sm font-medium text-text hover:bg-backgroundShade1 focus:outline-none"
                    >
                        <BsThreeDotsVertical className="text-xl" />
                    </button>
                    {dropdownOpen && (
                        <ProjectDropDown
                            projectId={projectId}
                            setIsDeleteModalOpen={setIsDeleteModalOpen}
                            setIsArchiveModalOpen={setIsArchiveModalOpen}
                            setIsUploadModalOpen={setIsUploadModalOpen}
                            role={role}
                        />
                    )}
                </div>
            </div>
            <div>{renderActiveTab()}</div>

            <ModalContainer
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Project Confirmation"
            >
                <p className="text-text">
                    Are you sure you want to delete this project? This action cannot be undone.
                </p>
                <div className="flex justify-end mt-6 space-x-4">
                    <Button
                        text={'Delete'}
                        onClick={handleDelete}
                        preview={'danger'}
                        fullWidth={false}
                        isSubmitting={isDeletingProject}
                    />
                </div>
            </ModalContainer>

            <ModalContainer
                isOpen={isArchiveModalOpen}
                onClose={() => setIsArchiveModalOpen(false)}
                title="Archive Project Confirmation"
            >
                <p className="text-text">
                    Are you sure you want to archive this project?
                </p>
                <div className="flex justify-end mt-6 space-x-4">
                    <Button
                        text={'Archive'}
                        onClick={handleArchive}
                        fullWidth={false}
                    />
                </div>
            </ModalContainer>

            <ModalContainer
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                title="Upload Files"
            >
                <FileUpload
                    label="Upload Files (PDFs or Excel)"
                    onChange={handleFileUpload}
                    accept="application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="mb-4"
                />
                <div className="flex justify-end mt-6 space-x-4">
                    <Button
                        text={'Upload'}
                        onClick={handleUploadSubmit}
                        isSubmitting={isUploadingProjectFile}
                    />

                </div>
            </ModalContainer>
        </main>
    );
};

export default ProjectDetails;
