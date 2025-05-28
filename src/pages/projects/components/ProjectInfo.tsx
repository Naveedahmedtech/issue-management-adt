import React, { useEffect, useState } from "react";
import { FaBuilding, FaCalendarAlt, FaRegClock, FaUser } from "react-icons/fa";
import { FiInfo, FiX } from "react-icons/fi";
import { format } from "date-fns";
import { useAssignProjectMutation, useUnassignProjectMutation } from "../../../redux/features/projectsApi";
import { ProjectInfoProps } from "../../../types/types";
import PaginatedDropdown from "../../../components/dropdown/PaginatedDropdown";
import { getStatusBadge } from "../../../utils/Common";
import { useLazyGetAllUsersQuery } from "../../../redux/features/authApi";
import { useAuth } from "../../../hooks/useAuth";
import { ROLES } from "../../../constant/ROLES.ts";
import Button from "../../../components/buttons/Button.tsx";
import { toast } from "react-toastify";
import ModalContainer from "../../../components/modal/ModalContainer.tsx";

const ProjectInfo: React.FC<ProjectInfoProps> = ({ projectData, refetch }) => {
    const [selectedUser, setSelectedUser] = useState<{ value: string; label: string } | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<{ value: string; label: string }[]>([]);
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);


    const { userData } = useAuth();
    const { role } = userData;

    const [assignToUser, { isLoading }] = useAssignProjectMutation();
    const [unassignUser] = useUnassignProjectMutation();
    const [triggerGetUsers] = useLazyGetAllUsersQuery();

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
    const fetchUsers = async (page: number) => {
        try {
            const response = await triggerGetUsers({ page, limit: 10, roleName: ROLES.WORKER }).unwrap();
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <div className="flex items-center gap-3">
                    {projectData?.isOrder && (
                        <span className="bg-primary text-text px-2 py-0.5 text-xs font-semibold uppercase rounded ">
                            Order
                        </span>
                    )}
                    <h3 className="text-xl font-bold break-words">
                        {projectData?.title}
                    </h3>
                </div>

                {projectData?.description && (
                    <button
                        onClick={() => setShowDescriptionModal(true)}
                        className="flex items-center text-sm text-primary hover:underline gap-1 sm:ml-auto mt-2 sm:mt-0"
                    >
                        <FiInfo className="w-4 h-4" />
                        View Description
                    </button>
                )}

            </div>


            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-text mb-4 text-textDark">
                {/* Status */}
                <div className="flex items-center space-x-2">
                    <FaRegClock className="text-primary" />
                    <div>
                        <span className="block text-xs text-textLight">Status</span>
                        {getStatusBadge(projectData?.status)}
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
                        className="text-text"
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
                    <div className="prose prose-sm max-w-none text-text">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: projectData?.description || "<p>No description available.</p>",
                            }}
                        />
                    </div>
                </ModalContainer>
            )}

        </div>

    );
};

export default ProjectInfo;
