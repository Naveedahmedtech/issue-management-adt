import {useCallback, useEffect, useRef, useState} from "react";
import Tabs from "../../../components/Tabs";
import Board from "../../../components/Board";
import Documents from "../../../components/Board/Documents";
import ProjectInfo from "../components/ProjectInfo";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import ModalContainer from "../../../components/modal/ModalContainer.tsx";
import {projectDocumentColumns} from "../../../utils/Common.tsx";
import {projectDocumentData} from "../../../mock/tasks.ts";
import FileUpload from "../../../components/form/FileUpload";
import {BsThreeDotsVertical} from "react-icons/bs";
import Button from "../../../components/buttons/Button.tsx";
import CardLayout from "../../../components/Board/CardLayout.tsx";
import {
    useDeleteProjectMutation,
    useGetProjectByIdQuery,
    useGetProjectFilesQuery,
    useGetProjectIssuesQuery,
    useToggleArchiveMutation,
    useUploadFilesToProjectMutation
} from "../../../redux/features/projectsApi.ts";
import {toast} from "react-toastify";
import {APP_ROUTES} from "../../../constant/APP_ROUTES.ts";
import {useAuth} from "../../../hooks/useAuth.ts";
import ProjectDropDown from "../components/ProjectDropDown.tsx";
import {DocumentDataRow} from "../../../types/types.ts";
import {ANGULAR_URL, BASE_URL} from "../../../constant/BASE_URL.ts";
import {API_ROUTES} from "../../../constant/API_ROUTES.ts";
import Activity from "../components/Activity.tsx";
import LargeModal from "../../../components/modal/LargeModal.tsx";
import AnnotationIframe from "../../../components/iframe/AnnotationIframe.tsx";
import {FiRefreshCw} from "react-icons/fi";
import Drawer from "../../../components/modal/Drawer.tsx";
import {format} from "date-fns";
import {PROJECT_STATUS} from "../../../constant";


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
    const [isUnArchiveModalOpen, setIsUnArchiveModalOpen] = useState(false);
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
    const [selectedFile, setSelectedFile] = useState<DocumentDataRow | null>();
    const [isAnnotationModal, setIsAnnotationModal] = useState(false)
    const [issueId, setIssueId] = useState();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);



    const { userData } = useAuth();
    const { userData: { role, id: userId, displayName: username } } = userData;

    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const isArchived = location.state?.archive;
    const { projectId } = params;

    const { data: projectData, refetch: refetchProjectData } = useGetProjectByIdQuery(projectId);
    const { data: projectIssues, isLoading: isLoadingIssues, isFetching: isIssueFetching, refetch: refetchIssues } = useGetProjectIssuesQuery(projectId);
    const { data: projectFiles, isLoading: isLoadingProjectFiles, isFetching: isFileFetching, refetch: refetchProjectFiles } = useGetProjectFilesQuery(projectId);
    const [uploadFilesToProject, { isLoading: isUploadingProjectFile }] = useUploadFilesToProjectMutation();
    // ✅ Use the deleteProject mutation
    const [deleteProject, { isLoading: isDeletingProject }] = useDeleteProjectMutation();
    const [archiveProject, { isLoading: isArchiveProject }] = useToggleArchiveMutation();


    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== ANGULAR_URL) return;

            if (event.data?.type === 'ISSUE_SAVE') {
                refetchIssues();
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);


    useEffect(() => {
        if (projectFiles?.data?.files) {
            const formattedProjectFiles = projectFiles.data.files.map((file: DocumentDataRow) => {
                const dateObj = new Date(file.updatedAt);

                return {
                    id: file.type === "issueFile" ? file.fileId : file.id,
                    fileName: file.filePath.split("/").pop(),
                    extension: file.filePath.split(".").pop(),
                    filePath: file.filePath,
                    date: format(dateObj, "EEEE, MMMM do yyyy"),
                    time: format(dateObj, "hh:mm a"),
                    type: `${file.type === "issueFile" ? `${file.type} (${file?.issue?.title})` : file.type}` || "UNKNOWN",
                };
            });

            // ✅ Replace the document data instead of merging
            setDocumentData(formattedProjectFiles);
        }
    }, [projectFiles]);


    useEffect(() => {
        if (projectIssues?.data?.columns) {
            const allTasks = projectIssues.data?.columns?.flatMap((column: any) => column.tasks);
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

    const handleAnnotateFile = useCallback(
        (file: DocumentDataRow) => {
            if (file.fileName.endsWith(".xlsx")) {
                setSelectedFile(null); // Temporarily reset the selected file

                setTimeout(() => {
                    setSelectedFile(file); // Re-select the file to trigger useEffect
                }, 0);
            } else {
                // toast.info("We are working on PDF annotation for you!");
                setSelectedFile(file);
                setIsAnnotationModal(true);
            }
        },
        [setSelectedFile, setIsAnnotationModal] // Dependencies
    );

    const handleSignFile = (file: any) => {
        console.log("Signing file:", file);
        // Add logic for file signing
    };


    const handleDownloadFile = async (file: DocumentDataRow) => {
        toast.info("Downloading file, please wait...");
        const type = file.type === 'projectFile' ? 'project' : 'issue';
        try {
            const response = await fetch(
                `${BASE_URL}${API_ROUTES.PROJECT.ROOT}/${API_ROUTES.PROJECT.FILES}/${file.id}/${API_ROUTES.PROJECT.DOWNLOAD}?type=${type}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                console.log("ERRR!!!", response)
                throw new Error("Failed to download file");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Create an anchor and trigger the download
            const a = document.createElement("a");
            a.href = url;
            a.download = file.fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();

            toast.success("File downloaded successfully!");
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Failed to download the file.");
        }
    };


    // Function to handle view button click


    // Function to handle edit button click (you can extend this as needed)
    // const handleEditExcel = (filePath: string) => {
    //     alert(`Edit functionality is not implemented yet for: ${filePath}`);
    // };


    const documentColumns = projectDocumentColumns(handleAnnotateFile, handleSignFile, handleDownloadFile, isArchived);
    const [windowWidth] = useWindowSize();
    const isSmallScreen = windowWidth <= 768; // Small screens (e.g., tablets or mobile)



    const tabs = [
        { id: "board", label: "Issues" },
        { id: "documents", label: "Documents" },
        // { id: "info", label: "Project Info" },
        // { id: "activity", label: "Activity" },
    ];

    const handleOutsideClick = (event: MouseEvent) => {
        setSelectedFile(null)
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
            setIsAnnotationModal(false)
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
            const response = await uploadFilesToProject({ projectId, formData }).unwrap();
            const { uploadedFiles, skippedFiles } = response?.data as any;

            toast.success(
                `Files processed successfully! Uploaded: ${uploadedFiles.length}, Skipped: ${skippedFiles.length}`
            );
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
        "Active": filteredTasks?.filter((task: any) => task.status?.toUpperCase() === PROJECT_STATUS.ACTIVE.toUpperCase()),
        "On Going": filteredTasks?.filter((task: any) => task.status?.toUpperCase() === PROJECT_STATUS.ON_GOING.toUpperCase()),
        "Completed": filteredTasks?.filter((task: any) => task.status?.toUpperCase() === PROJECT_STATUS.COMPLETED.toUpperCase()),
    };

    const refetchData = () => {
        console.log("🔄 Refetching data...");
        // Call API or state update logic here
        refetchProjectFiles();
        refetchIssues();
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
                    isLoading={isLoadingIssues || isIssueFetching}
                    isArchived={isArchived}
                    projectId={projectId}
                    setActiveTab={setActiveTab}
                    setIssueId={setIssueId}
                    refetchFiles={refetchProjectFiles}
                /> : <Board
                    projectIssues={projectIssues?.data?.columns}
                    refetch={refetchIssues}
                    isLoading={isLoadingIssues || isIssueFetching}
                    isArchived={isArchived}
                    projectId={projectId}
                    setActiveTab={setActiveTab}
                    setIssueId={setIssueId}
                    refetchFiles={refetchProjectFiles}
                />;
            case "documents":
                return <Documents
                    columns={documentColumns}
                    data={documentData}
                    setIsUploadModalOpen={setIsUploadModalOpen}
                    isLoading={isLoadingProjectFiles || isFileFetching}
                    selectedFile={selectedFile}
                    projectIdForNow={projectId}
                    refetch={refetchProjectFiles}
                />;
            case "info":
                return <ProjectInfo projectData={projectData?.data} refetch={refetchProjectData} />;
            case "activity":
                return <Activity projectId={projectId} issues={projectIssues?.data?.issues} issueId={issueId} />;
            default:
                return null;
        }
    };

    const handleDelete = async () => {
        try {
            await deleteProject(projectId).unwrap();

            toast.success("Project deleted successfully!");
            setIsDeleteModalOpen(false);
            navigate(APP_ROUTES.APP.PROJECTS.ALL)
        } catch (error: any) {
            console.error("Failed to delete project:", error);
            toast.error("Failed to delete project. Please try again.");
        }
    };

    const handleArchive = async () => {
        try {
            await archiveProject(projectId);
            toast.success(`Project ${isArchived ? "unarchived" : "archived"} successfully!`);
            navigate(APP_ROUTES.APP.PROJECTS.CREATE)
        } catch (error) {
            toast.error("Failed to archive project. Please try again.");

        } finally {
            setIsArchiveModalOpen(false);
        }
    };

    return (
        <main className="p-6">
            <ProjectInfo projectData={projectData?.data} refetch={refetchProjectData} />
            <div className="flex flex-wrap justify-between items-center mb-4">
                {/* Tabs Component */}

                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="p-2 bg-primary text-white rounded-md"
                    >
                        Activity
                    </button>
                    {
                        isDrawerOpen &&
                        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} width="500px" title={"Activity Logs"} >
                            <Activity projectId={projectId} issues={projectIssues?.data?.issues} issueId={issueId} />
                        </Drawer>
                    }
                    {/* Refetch (Refresh) Button */}
                    <button
                        onClick={refetchData} // Function to refetch data
                        className="inline-flex justify-center items-center rounded-md border border-border bg-background py-2 px-3 text-sm font-medium text-text hover:bg-backgroundShade1 focus:outline-none"
                        title="Refresh"
                    >
                        <FiRefreshCw className="text-xl" />
                    </button>

                    <div ref={dropdownRef} className="relative">
                        {!isArchived ? (
                            <button
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="inline-flex justify-center w-full rounded-md border border-border bg-background py-2 px-4 text-sm font-medium text-text hover:bg-backgroundShade1 focus:outline-none"
                            >
                                <BsThreeDotsVertical className="text-xl" />
                            </button>
                        ) : (
                            <Button text="Unarchive" onClick={() => setIsUnArchiveModalOpen(true)} />
                        )}

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
                        isSubmitting={isArchiveProject}
                    />
                </div>
            </ModalContainer>


            <ModalContainer
                isOpen={isUnArchiveModalOpen}
                onClose={() => setIsUnArchiveModalOpen(false)}
                title="Archive Project Confirmation"
            >
                <p className="text-text">
                    Are you sure you want to unarchive this project?
                </p>
                <div className="flex justify-end mt-6 space-x-4">
                    <Button
                        text={'Unarchive'}
                        onClick={handleArchive}
                        fullWidth={false}
                        isSubmitting={isArchiveProject}
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

            <LargeModal
                isOpen={isAnnotationModal}
                onClose={() => {
                    setSelectedFile(null)
                    setIsAnnotationModal(false)
                }}
                title="Webview"
            >
                <div className="relative h-full">
                    <AnnotationIframe userId={userId} selectedFile={selectedFile} projectId={projectId} username={username} />
                    <div className="sticky bottom-0 bg-background">
                        <Link
                            to={{
                                pathname: APP_ROUTES.APP.PROJECTS.PDF_VIEWER,
                            }}
                            state={{
                                userId: userId, selectedFile: selectedFile, projectId: projectId, username
                            }}
                            className="underline text-textSecondary"
                        >
                            Open New Page
                        </Link>
                    </div>
                </div>
            </LargeModal>

        </main>
    );
};

export default ProjectDetails;
