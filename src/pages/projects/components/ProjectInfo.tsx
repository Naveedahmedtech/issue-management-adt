import React, { useEffect, useState } from "react";
import { FaBuilding, FaCalendarAlt, FaRegClock, FaUser } from "react-icons/fa";
import { FiX } from "react-icons/fi";
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

const ProjectInfo: React.FC<ProjectInfoProps> = ({ projectData, refetch }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ value: string; label: string } | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<{ value: string; label: string }[]>([]);

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
        } catch (error:any) {
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
        <div className="relative bg-backgroundShade1 px-6 py-5 rounded-lg shadow-sm mb-6">
            {/* Badge and Title: Professional Inline Pill Style */}
            <div className="flex items-center mb-4">
                {projectData?.isOrder && (
                    <span
                        className="bg-primary text-background px-2 py-0.5 text-xs font-semibold uppercase rounded mr-3">
                        Order
                    </span>
                )}
                <h3 className="text-xl font-bold text-primary truncate">{projectData?.title}</h3>
            </div>

            {/* Description */}
            <div className="text-sm text-textLight mb-4">
                {showFullDescription
                    ? projectData?.description
                    : projectData?.description?.slice(0, 100)}
                {projectData?.description && projectData?.description.length > 100 && (
                    <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="ml-2 text-primary text-xs font-medium hover:underline"
                    >
                        {showFullDescription ? "Show Less" : "Show More"}
                    </button>
                )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-text mb-4">
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
                    />
                </div>
            )}

            {/* Assigned Users List */}
            {selectedUsers.length > 0 && (
                <div>
                    <p className="text-sm font-medium text-text mb-2">Assigned Users:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedUsers.map(user => (
                            <div
                                key={user.value}
                                className="flex items-center px-3 py-1 rounded-full text-sm border border-text"
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
        </div>

    );
};

export default ProjectInfo;
