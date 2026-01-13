import React, { useEffect, useState } from "react";
import { FaBuilding, FaCalendarAlt, FaRegClock, FaUser } from "react-icons/fa";
import { FiInfo, FiX } from "react-icons/fi";
import { format } from "date-fns";
import { useAssignProjectMutation, useToggleArchiveMutation, useUnassignProjectMutation, useUpdateProjectMutation } from "../../../redux/features/projectsApi";
import { ProjectInfoProps } from "../../../types/types";
import PaginatedDropdown from "../../../components/dropdown/PaginatedDropdown";
// import { getStatusBadge } from "../../../utils/Common";
import { useLazyGetAllUsersQuery } from "../../../redux/features/authApi";
import { useAuth } from "../../../hooks/useAuth";
import { ROLES } from "../../../constant/ROLES.ts";
import Button from "../../../components/buttons/Button.tsx";
import { toast } from "react-toastify";
import ModalContainer from "../../../components/modal/ModalContainer.tsx";
import ProjectStatusDropDown from "../../../components/Board/ProjectStatusDropDown.tsx";
import { PROJECT_STATUS } from "../../../constant/index.ts";
import { APP_ROUTES } from "../../../constant/APP_ROUTES.ts";
import { useNavigate } from "react-router-dom";

const ProjectInfo: React.FC<ProjectInfoProps> = ({ projectData, refetch }) => {
    const [selectedUser, setSelectedUser] = useState<{ value: string; label: string } | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<{ value: string; label: string }[]>([]);
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);

    const [confirmStatus, setConfirmStatus] = useState<{ open: boolean; newStatus: string | null }>({
        open: false,
        newStatus: null,
    });


    const { userData } = useAuth();
    const { role } = userData;

    const navigate = useNavigate()
    const [assignToUser, { isLoading }] = useAssignProjectMutation();
    const [unassignUser] = useUnassignProjectMutation();
    const [triggerGetUsers] = useLazyGetAllUsersQuery();
    const [updateProject] = useUpdateProjectMutation();
    const [archiveProject] = useToggleArchiveMutation();



    // Initialize selected users from projectData
    useEffect(() => {
        if (projectData?.assignedUsers) {
            setSelectedUsers(
                projectData.assignedUsers.map(({ user }) => ({ value: user.id, label: user.displayName }))
            );
        }
    }, [projectData]);

    // Handle assigning a new user
    const handleAssignProject = async () => {
        if (!selectedUser || selectedUsers.some(user => user.value === selectedUser.value)) return;

        try {
            await assignToUser({
                projectId: projectData.id,
                userIds: [...selectedUsers.map(user => user.value), selectedUser.value],
            }).unwrap();
            refetch()
            setSelectedUsers((prev) => [...prev, selectedUser]);
            setSelectedUser(null);
        } catch (error: any) {
            console.error("Error assigning project:", error);
            toast.error(error?.data?.error?.message || "Failed to update project. Please try again.");

        }
    };

    // Handle unassigning a user
    const handleRemoveUser = async (userId: string) => {
        try {
            await unassignUser({
                projectId: projectData.id,
                userId,
            }).unwrap();
            refetch()
            setSelectedUsers((prev) => prev.filter((user) => user.value !== userId));
        } catch (error) {
            console.error("Error unassigning user:", error);
        }
    };

    // Fetch users for dropdown
    const fetchUsers = async (page: number, query = "") => {
        try {
            const response = await triggerGetUsers({ page, limit: 200, roleName: ROLES.WORKER, q: query }).unwrap();
            const users = response?.data?.users ?? [];
            const pagination = response?.data?.pagination ?? {};

            const userOptions = users.map((user: any) => ({
                value: user.id,
                label: user.displayName || user.email,
            }));

            return {
                data: page === 1 && userOptions,
                hasMore: (pagination.page * pagination.limit) < pagination.total,
            };
        } catch (error) {
            console.error("Error fetching users:", error);
            return { data: [], hasMore: false };
        }
    };

    // ✅ Handle form submission for updating the project
    const handleStatusUpdate = async (status: string) => {
        const formDataToSend = new FormData();

        // Append form fields
        formDataToSend.append("title", projectData?.title);
        formDataToSend.append("status", status || "");

        try {
            // ✅ Call the updateProject mutation
            if (status === PROJECT_STATUS.ARCHIVE?.toUpperCase()) {
                await archiveProject(projectData?.id);
                navigate(APP_ROUTES.APP.PROJECTS.ARCHIVED)
            } else {
                await updateProject({ projectId: projectData?.id, formData: formDataToSend }).unwrap();

            }
            refetch();
        } catch (error: any) {
            console.log('err', error)
            toast.error(error?.data?.error?.message || "Failed to update project. Please try again.");
        }
    };

    // Format Dates
    const formattedStartDate = projectData?.startDate
        ? format(new Date(projectData.startDate), "MMM dd, yyyy")
        : "N/A";

    const formattedEndDate = projectData?.endDate
        ? format(new Date(projectData.endDate), "MMM dd, yyyy")
        : "N/A";

    return (
        <div className="relative bg-backgroundShade2 text-textDark px-6 py-5 rounded-lg shadow-md mb-6">
            {/* Badge and Title: Professional Inline Pill Style */}
            <div className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    {/* Title + Badge */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start gap-2">
                            {projectData?.isOrder && (
                                <span className="bg-primary text-text px-2 py-0.5 text-xs font-semibold uppercase rounded">
                                    Order
                                </span>
                            )}
                            <h3
                                className="
            text-base sm:text-lg md:text-xl font-bold
            break-words break-all whitespace-normal max-w-full
            sm:line-clamp-2 sm:overflow-hidden
          "
                                title={projectData?.title}
                            >
                                {projectData?.title}
                            </h3>
                        </div>
                    </div>

                    {/* View Description Button */}
                    {projectData?.description && (
                        <div className="sm:ml-4 sm:flex-shrink-0">
                            <button
                                onClick={() => setShowDescriptionModal(true)}
                                className="flex items-center text-sm text-primary hover:underline gap-1"
                            >
                                <FiInfo className="w-4 h-4" />
                                View Description
                            </button>
                        </div>
                    )}
                </div>
            </div>



            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-text mb-4 text-textDark">
                {/* Status */}
                {/* Status */}
                <div className="flex items-center space-x-2">
                    {/* <FaRegClock className="text-primary" /> */}
                    <div>
                        <span className="block text-xs text-textLight">Status</span>
                        {
                            projectData?.archived ? (
                                <span className="px-2 py-1 text-xs font-medium text-text bg-backgroundShade1 rounded-full">
                                    Archived
                                </span>

                            ) : (
                                <ProjectStatusDropDown
                                    value={projectData?.status || ""}
                                    onChange={(newStatus) => setConfirmStatus({ open: true, newStatus })}
                                    disabled={role === ROLES.WORKER} // workers cannot change status
                                />
                            )
                        }

                    </div>
                </div>


                {/* Dates */}
                <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-primary" />
                    <div>
                        <span className="block text-xs text-textLight">Start - End</span>
                        <span>{formattedStartDate} → {formattedEndDate}</span>
                    </div>
                </div>

                {/* Company */}
                <div className="flex items-center space-x-2">
                    <FaBuilding className="text-primary" />
                    <div>
                        <span className="block text-xs text-textLight">Company</span>
                        <span>{projectData?.company?.name || "N/A"}</span>
                    </div>
                </div>

                {/* Created By */}
                <div className="flex items-center space-x-2">
                    <FaUser className="text-primary" />
                    <div>
                        <span className="block text-xs text-textLight">Created By</span>
                        <span>{projectData?.user?.displayName || "Unknown"}</span>
                    </div>
                </div>
            </div>

            {/* Assignment Section for Non-Worker Roles */}
            {role !== ROLES.WORKER && (
                <div className="flex flex-wrap gap-3 items-center mb-4">
                    <PaginatedDropdown
                        fetchData={fetchUsers}
                        renderItem={(item: any) => <span>{item.label}</span>}
                        onSelect={setSelectedUser}
                        placeholder={selectedUser ? selectedUser.label : "Select a worker"}
                    />
                    <Button
                        text={isLoading ? "Assigning..." : "Assign"}
                        onClick={handleAssignProject}
                        isSubmitting={isLoading}
                        type={'button'}
                        fullWidth={false}
                        className="text-text bg-backgroundShade1 border-backgroundShade1"
                    />
                </div>
            )}

            {/* Assigned Users List */}
            {selectedUsers.length > 0 && (
                <div>
                    <p className="text-sm font-medium text-textDark mb-2">Assigned Users:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedUsers.map(user => (
                            <div
                                key={user.value}
                                className="flex items-center px-3 py-1 rounded-full text-sm border border-border"
                            >
                                {user.label}
                                <FiX
                                    className="ml-2 text-red-500 cursor-pointer hover:text-red-700"
                                    onClick={() => handleRemoveUser(user.value)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {showDescriptionModal && (
                <ModalContainer
                    isOpen={showDescriptionModal}
                    onClose={() => setShowDescriptionModal(false)}
                    title="Project Description"
                >
                    <div className="prose prose-sm max-w-none text-text prose-headings:text-text  prose-strong:text-text">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: projectData?.description || "<p>No description available.</p>",
                            }}
                        />
                    </div>
                </ModalContainer>
            )}
            {confirmStatus.open && (
                <ModalContainer
                    isOpen={confirmStatus.open}
                    onClose={() => setConfirmStatus({ open: false, newStatus: null })}
                    title="Confirm Status Change"
                >
                    <div className="space-y-6">
                        {/* Icon + Text */}
                        <div className="flex items-center gap-4">
                            {/* Circular Icon */}
                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                                <FaRegClock className="w-6 h-6" />
                            </div>

                            {/* Text Block */}
                            <div className="flex-1">
                                <p className="text-sm sm:text-base text-text">
                                    Are you sure you want to change the project status to{" "}
                                    <span className="font-semibold text-primary">
                                        {confirmStatus.newStatus}
                                    </span>
                                    ?
                                </p>
                                <p className="text-xs text-textLight mt-1">
                                    This update will be applied immediately and visible to all users.
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                            <Button
                                text="Yes, Update"
                                onClick={async () => {
                                    if (confirmStatus.newStatus) {
                                        await handleStatusUpdate(confirmStatus.newStatus);
                                    }
                                    setConfirmStatus({ open: false, newStatus: null });
                                }}
                                type="button"
                                className="bg-primary hover:bg-primary-dark"
                                fullWidth={false}
                            />
                        </div>
                    </div>
                </ModalContainer>
            )}


        </div>

    );
};

export default ProjectInfo;
