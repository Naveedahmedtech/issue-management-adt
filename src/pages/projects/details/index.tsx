import { useCallback, useEffect, useRef, useState } from "react";
import Tabs from "../../../components/Tabs";
import Board from "../../../components/Board";
import Documents from "../../../components/Board/Documents";
import ProjectInfo from "../components/ProjectInfo";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ModalContainer from "../../../components/modal/ModalContainer.tsx";
import { orderDocumentColumns, projectDocumentColumns } from "../../../utils/Common.tsx";
import { projectDocumentData } from "../../../mock/tasks.ts";
import FileUpload from "../../../components/form/FileUpload";
import { BsThreeDotsVertical } from "react-icons/bs";
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
import { toast } from "react-toastify";
import { APP_ROUTES } from "../../../constant/APP_ROUTES.ts";
import { useAuth } from "../../../hooks/useAuth.ts";
import ProjectDropDown from "../components/ProjectDropDown.tsx";
import { DocumentDataRow } from "../../../types/types.ts";
import {  BASE_URL } from "../../../constant/BASE_URL.ts";
import Activity from "../components/Activity.tsx";
import { FiRefreshCw } from "react-icons/fi";
import Drawer from "../../../components/modal/Drawer.tsx";
import { format } from "date-fns";
import { PROJECT_STATUS } from "../../../constant";
import ExcelModal from "../components/ExcelModal.tsx";
import { useGetAllCommentsQuery, useGetLatestCommentQuery } from "../../../redux/features/commentApi.ts";
import Comments from "../components/Comments.tsx";
import { offCommentCreated, onCommentCreated } from "../../../utils/socketClient.ts";
import CheckboxField from "../../../components/form/CheckboxField.tsx";
import Checklist from "../components/Checklist.tsx";


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
    const [, setIsAnnotationModal] = useState(false)
    const [issueId, setIssueId] = useState();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [isFileView, setIsFileView] = useState(false);

    const [openExcelModal, setOpenExcelModal] = useState(false);

    const [isOpenComments, setIsOpenComments] = useState(false);
    const [commentPage, setCommentPage] = useState(1);


    const [uploadToOrder, setUploadToOrder] = useState(false)


    const { userData } = useAuth();
    const { userData: { role, id: userId, displayName: username } } = userData;

    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const isArchived = location.state?.archive;
    const onBackReset = location.state?.onBackReset;
    const { projectId } = params;

    const { data: projectData, refetch: refetchProjectData } = useGetProjectByIdQuery(projectId);
    const { data: commentData, isLoading: isLoadingComments, refetch: refetchCommentData } = useGetAllCommentsQuery({ projectId, page: commentPage, limit: 20 });


    const { data: latestCommentData, isLoading: isLoadingLatestComments, refetch: refetchLatestComments } = useGetLatestCommentQuery({ projectId });

    useEffect(() => {
        // 1) Define your two callbacks
        const handler1 = () => {
            refetchCommentData();
        };
        const handler2 = () => {
            refetchLatestComments();
        };

        // 2) Register both
        onCommentCreated(handler1);
        onCommentCreated(handler2);

        // 3) Cleanup both on unmount
        return () => {
            offCommentCreated(handler1);
            offCommentCreated(handler2);
            // if you want to fully teardown the socket, uncomment:
            // disconnectSocket();
        };
    }, [refetchCommentData, refetchLatestComments]);


    const {
        data: projectIssues,
        isLoading: isLoadingIssues,
        isFetching: isIssueFetching,
        refetch: refetchIssues
    } = useGetProjectIssuesQuery(projectId);
    const {
        data: projectFiles,
        isLoading: isLoadingProjectFiles,
        isFetching: isFileFetching,
        refetch: refetchProjectFiles
    } = useGetProjectFilesQuery(projectId);
    const [uploadFilesToProject, { isLoading: isUploadingProjectFile }] = useUploadFilesToProjectMutation();
    // ✅ Use the deleteProject mutation
    const [deleteProject, { isLoading: isDeletingProject }] = useDeleteProjectMutation();
    const [archiveProject, { isLoading: isArchiveProject }] = useToggleArchiveMutation();

    useEffect(() => {
        if (onBackReset) {
            setActiveTab('documents')
        }
    }, [onBackReset]);

    useEffect(() => {
        const handleMessage = () => {
            const wasIssueSaved = window.sessionStorage.getItem("ISSUE_SAVED") === "true";
            const wasSignatureSaved = window.sessionStorage.getItem("SIGNATURE_SAVED") === "true";
            if (wasIssueSaved) {
                refetchIssues();
                refetchProjectFiles();
                window.sessionStorage.removeItem("ISSUE_SAVED");
            }
            if (wasSignatureSaved) {
                refetchProjectFiles()
                window.sessionStorage.removeItem("SIGNATURE_SAVED");
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
                    type: `${file.type === "issueFile" ? `${"Issue File"} (${file?.issue?.title})` : `${file.isOrder ? "Order File" : "Project File"}`}` || "UNKNOWN",
                    isOrder: file.isOrder,
                    isSigned: file?.isSigned || false,
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
            setSelectedFile(file);
            if (file.fileName.endsWith(".xlsx")) {
                setOpenExcelModal(true)
                // toast.info("This feature is coming soon.")
                // setSelectedFile(null); // Temporarily reset the selected file
                //
                // setTimeout(() => {
                //     setSelectedFile(file); // Re-select the file to trigger useEffect
                // }, 0);
            } else if (file.fileName.endsWith(".pdf")) {
                navigate(`${APP_ROUTES.APP.PROJECTS.PDF_VIEWER}?userId=${userId}&username=${username}&projectId=${projectId}&fileId=${file?.id}&filePath=${file?.filePath}&isSigned=${file?.isSigned}`)
            } else {
                setIsFileView(true);
            }
        },
        [setSelectedFile, setIsAnnotationModal] // Dependencies
    );

    const handleSignFile = (file: DocumentDataRow) => {
        navigate(`${APP_ROUTES.APP.PROJECTS.PDF_VIEWER}?userId=${userId}&username=${username}&orderId=${projectId}&fileId=${file?.id}&filePath=${file?.filePath}&isSigned=${file?.isSigned}`)
    };

    // Function to handle view button click


    // Function to handle edit button click (you can extend this as needed)
    // const handleEditExcel = (filePath: string) => {
    //     alert(`Edit functionality is not implemented yet for: ${filePath}`);
    // };
    // const handleFileView = (filePath: string | undefined) => {
    //     // setSelectedFilePath(filePath);
    //     // setIsFileViewModalOpen(true)
    // }

    const documentColumns = projectDocumentColumns(handleAnnotateFile, isArchived);
    const orderColumns = orderDocumentColumns(handleSignFile, isArchived);

    const [windowWidth] = useWindowSize();
    const isSmallScreen = windowWidth <= 768; // Small screens (e.g., tablets or mobile)


    const tabs = [
        { id: "board", label: "Issues" },
        { id: "documents", label: "Documents" },
        { id: "checklist", label: "Checklist" },
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


    const handleUploadSubmit = async (isOrder: boolean) => {
        if (files.length === 0) {
            toast.error("Please select at least one file to upload.");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
            formData.append("isOrder", isOrder ? "true" : "false");
        });

        try {
            const response = await uploadFilesToProject({ projectId, formData }).unwrap();
            const { uploadedFiles, skippedFiles } = response?.data as any;
            let message = `Files processed successfully! Uploaded ${uploadedFiles.length} file${uploadedFiles.length !== 1 ? 's' : ''}.`;

            if (skippedFiles.length > 0) {
                message += ` Skipped ${skippedFiles.length} duplicate file${skippedFiles.length !== 1 ? 's' : ''} (already uploaded).`;
            }

            toast.success(message);
            setFiles([]);
            refetchProjectFiles();
            setIsUploadModalOpen(false);
            setUploadToOrder(false)
            setActiveTab('documents')
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

    const _projectFiles = documentData.filter((doc: any) => !doc.isOrder);
    const orderFiles = documentData.filter((doc: any) => doc.isOrder);

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
                    projectColumns={documentColumns}
                    projectData={_projectFiles}
                    isLoading={isLoadingProjectFiles || isFileFetching}
                    orderColumns={orderColumns}
                    orderData={orderFiles}
                    isOrderProject={projectData?.data?.isOrder}
                />;
            case "checklist":
                return <Checklist
                    projectId={projectId}
                    isArchived={isArchived}
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


            {
                latestCommentData?.data && !isLoadingLatestComments && latestCommentData?.data?.message && (
                    <div
                        tabIndex={0}
                        role="region"
                        aria-label="Latest comment"
                        className="
        mb-3 p-2
        bg-backgroundShade2
        border-l-4 border-primary
        rounded-lg shadow-sm
      "
                    >
                        <div className="flex flex-wrap items-center justify-between mb-1">
                            <div className="flex items-center space-x-1">
                                {/* Display the commenter’s name */}
                                <span className="text-[10px] font-semibold bg-primary text-text px-1.5 py-0.5 rounded">
                                    {latestCommentData?.data.user?.displayName ?? 'Anonymous'}
                                </span>
                                <h4 className="text-sm text-textDark font-medium">Latest Comment</h4>
                            </div>
                            <span className="text-xs text-textSecondary">
                                {latestCommentData?.data?.createdAt && format(
                                    new Date(latestCommentData?.data?.createdAt),
                                    "MMM d, yyyy h:mm a"
                                )}
                            </span>
                        </div>
                        <p className="text-sm text-textDark leading-snug">
                            {latestCommentData?.data?.message}
                        </p>
                    </div>
                )
            }


            <ProjectInfo projectData={projectData?.data} refetch={refetchProjectData} />

            <div className="flex flex-wrap justify-between items-center mb-4">
                {/* Tabs Component */}

                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="p-2 bg-backgroundShade1 text-text rounded-md"
                    >
                        Upload
                    </button>
                    <button
                        onClick={() => setIsOpenComments(true)}
                        className="p-2 bg-backgroundShade1 text-text rounded-md"
                    >
                        Comments
                    </button>
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="p-2 bg-backgroundShade1 text-text rounded-md"
                    >
                        Activity
                    </button>
                    {
                        isDrawerOpen &&
                        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} width="800px"
                            title={"Activity Logs"}>
                            <Activity projectId={projectId} issues={projectIssues?.data?.issues} issueId={issueId} />
                        </Drawer>
                    }
                    {
                        isOpenComments &&
                        <Drawer isOpen={isOpenComments} onClose={() => setIsOpenComments(false)} width="800px"
                            title={`Comments (${commentData?.data?.total ?? commentData?.data?.comments.length}) `}>
                            {
                                !isArchived &&
                                <Comments projectId={projectId} comments={commentData?.data?.comments} page={commentPage} totalPages={commentData?.data?.totalPages} setPage={setCommentPage} isLoading={isLoadingComments} total={commentData?.data?.total} />
                            }
                        </Drawer>
                    }
                    {/* Refetch (Refresh) Button */}
                    <button
                        onClick={refetchData} // Function to refetch data
                        className="inline-flex justify-center items-center rounded-md border border-border bg-backgroundShade1 py-2 px-3 text-sm font-medium text-text hover:bg-backgroundShade1 focus:outline-none"
                        title="Refresh"
                    >
                        <FiRefreshCw className="text-xl" />
                    </button>

                    <div ref={dropdownRef} className="relative">
                        {!isArchived ? (
                            <button
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="inline-flex justify-center w-full rounded-md border border-border bg-backgroundShade1 py-2 px-4 text-sm font-medium text-text hover:bg-backgroundShade1 focus:outline-none"
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
                {
                    projectData?.data?.isOrder &&
                    <CheckboxField
                        label="Upload as Order file?"
                        name="uploadToOrder"
                        checked={uploadToOrder}
                        onChange={e => setUploadToOrder(e.target.checked)}
                        className="mb-4"
                    />
                }
                <FileUpload
                    label="Upload Files (PDFs or Excel)"
                    onChange={handleFileUpload}
                    accept="application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="mb-4"
                />
                <div className="flex justify-end mt-6 space-x-4">
                    <Button
                        text={'Upload'}
                        onClick={() => handleUploadSubmit(uploadToOrder)}
                        isSubmitting={isUploadingProjectFile}
                    />
                </div>
            </ModalContainer>

            {
                selectedFile &&
                <ModalContainer
                    isOpen={isFileView}
                    onClose={() => setIsFileView(false)}
                    title="View File"
                >
                    <img src={`${BASE_URL}/${selectedFile.filePath}`} alt={"file"} />
                </ModalContainer>
            }

            {
                openExcelModal &&
                <ExcelModal
                    isModalOpen={openExcelModal}
                    setIsModalOpen={setOpenExcelModal}
                    selectedFile={selectedFile}
                    projectId={projectId}
                    refetch={refetchProjectFiles}

                />
            }
        </main>
    );
};

export default ProjectDetails;
