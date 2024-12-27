import  { useState, useEffect, useRef } from "react";
import Tabs from "../../../components/Tabs";
import Board from "../../../components/Board";
import Documents from "../../../components/Board/Documents";
import ProjectInfo from "../components/ProjectInfo";
import { Link, useParams } from "react-router-dom";
import { APP_ROUTES } from "../../../constant/APP_ROUTES.ts";
import ModalContainer from "../../../components/modal/ModalContainer.tsx";
import { projectDocumentColumns } from "../../../utils/Common.tsx";
import { projectDocumentData } from "../../../mock/tasks.ts";
import FileUpload from "../../../components/form/FileUpload";
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from "../../../components/buttons/Button.tsx";
import {fetchMockProject} from "../../../mock/mockAPI.ts";
import CardLayout from "../../../components/Board/CardLayout.tsx";

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

    const [documentData] = useState(projectDocumentData);


    const [tasks, setTasks] = useState<any>([]);
    const [filteredTasks, setFilteredTasks] = useState<any>([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState("All"); // Filters: All, To Do, In Progress, Done

    useEffect(() => {
        const fetchTasks = async () => {
            const data = await fetchMockProject();
            const allTasks = data.columns.flatMap((column) => column.tasks);
            setTasks(allTasks);
            setFilteredTasks(allTasks); // Initialize with all tasks
        };
        fetchTasks();
    }, []);

    const handleFilterChange = (status: string) => {
        setActiveFilter(status);
        if (status === "All") {
            setFilteredTasks(tasks);
        } else {
            setFilteredTasks(tasks.filter((task:any) => task.status === status));
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

    const params = useParams();
    const { projectId } = params;

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


    const handleUploadSubmit = () => {
        console.log("Files uploaded:", files);
        setIsUploadModalOpen(false);
        // Add logic to update the projectDocumentData with uploaded files
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
        "To Do": filteredTasks.filter((task:any) => task.status === "To Do"),
        "In Progress": filteredTasks.filter((task:any) => task.status === "In Progress"),
        "Done": filteredTasks.filter((task:any) => task.status === "Completed"),
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case "board":
                // return isSmallScreen ? <TaskTable projectId={projectId} /> : <Board />;
                 return isSmallScreen ?       <CardLayout
                     handleFilterChange={handleFilterChange}
                     activeFilter={activeFilter}
                     handleViewTask={handleViewTask}
                     isModalOpen={isModalOpen}
                     selectedTask={selectedTask}
                     setIsModalOpen={setIsModalOpen}
                     groupedTasks={groupedTasks}
                 /> : <Board />;
            case "documents":
                return <Documents columns={documentColumns} data={documentData} setIsUploadModalOpen={setIsUploadModalOpen} />;
            case "info":
                return <ProjectInfo projectId={projectId} />;
            default:
                return null;
        }
    };

    const handleDelete = () => {
        console.log(`Project with ID ${projectId} deleted`);
        setIsDeleteModalOpen(false);
    };

    const handleArchive = () => {
        console.log(`Project with ID ${projectId} archived`);
        setIsArchiveModalOpen(false);
    };

    return (
        <main className="p-6">
            <div className="flex flex-wrap justify-between items-center mb-4">
                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                <div ref={dropdownRef} className="relative">
                    <button
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="inline-flex justify-center w-full rounded-md border border-border bg-background py-2 px-4 text-sm font-medium text-text hover:bg-backgroundShade1 focus:outline-none"
                    >
                        <BsThreeDotsVertical className="text-xl" />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-background rounded-md shadow-lg z-50">
                            <ul className="py-2">
                                <li>
                                    <Link
                                        to={`${APP_ROUTES.APP.PROJECTS.EDIT}/${projectId}`}
                                        className="block px-4 py-2 text-sm text-text hover:bg-backgroundShade1"
                                    >
                                        Edit Project
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        className="w-full text-left block px-4 py-2 text-sm text-text hover:bg-backgroundShade1"
                                    >
                                        Delete Project
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setIsArchiveModalOpen(true)}
                                        className="w-full text-left block px-4 py-2 text-sm text-text hover:bg-backgroundShade1"
                                    >
                                        Archive Project
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setIsUploadModalOpen(true)}
                                        className="w-full text-left block px-4 py-2 text-sm text-text hover:bg-backgroundShade1"
                                    >
                                        Upload File
                                    </button>
                                </li>
                            </ul>
                        </div>
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
                    />

                </div>
            </ModalContainer>
        </main>
    );
};

export default ProjectDetails;
