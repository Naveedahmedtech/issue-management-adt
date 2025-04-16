import React, {useEffect, useState} from "react";
import {FaBuilding, FaCalendarAlt, FaRegClock, FaUser} from "react-icons/fa";
import {FiX} from "react-icons/fi";
import {format} from "date-fns";
import {useAssignProjectMutation, useUnassignProjectMutation} from "../../../redux/features/projectsApi";
import {ProjectInfoProps} from "../../../types/types";
import PaginatedDropdown from "../../../components/dropdown/PaginatedDropdown";
import {getStatusBadge} from "../../../utils/Common";
import {useLazyGetAllUsersQuery} from "../../../redux/features/authApi";
import {useAuth} from "../../../hooks/useAuth";
import {ROLES} from "../../../constant/ROLES.ts";

const ProjectInfo: React.FC<ProjectInfoProps> = ({projectData, refetch}) => {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ value: string; label: string } | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<{ value: string; label: string }[]>([]);

    const {userData} = useAuth();
    const {role} = userData;

    const [assignToUser, {isLoading}] = useAssignProjectMutation();
    const [unassignUser] = useUnassignProjectMutation();
    const [triggerGetUsers] = useLazyGetAllUsersQuery();

    // Initialize selected users from projectData
    useEffect(() => {
        if (projectData?.assignedUsers) {
            setSelectedUsers(
                projectData.assignedUsers.map(({user}) => ({value: user.id, label: user.displayName}))
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
        } catch (error) {
            console.error("Error assigning project:", error);
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
            const response = await triggerGetUsers({page, limit: 10, roleName: ROLES.WORKER}).unwrap();
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
            return {data: [], hasMore: false};
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
        <div className="bg-backgroundShade1 px-4 py-3 rounded-lg shadow-sm mb-5">
            <h3 className="text-lg font-semibold text-primary truncate">{projectData?.title}</h3>
            <div className="mt-1 text-sm text-textLight">
                {showFullDescription ? projectData?.description : projectData?.description?.slice(0, 100)}
                {projectData?.description && projectData?.description?.length > 100 && (
                    <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="ml-2 text-primary text-xs font-medium hover:underline"
                    >
                        {showFullDescription ? "Show Less" : "Show More"}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm text-text mt-3">
                <div className="flex items-center space-x-2">
                    <FaRegClock className="text-primary text-sm"/>
                    <div className="flex flex-col">
                        <span className="text-xs text-textLight">Status</span>
                        {getStatusBadge(projectData?.status)}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-primary text-sm"/>
                    <div className="flex flex-col">
                        <span className="text-xs text-textLight">Start - End</span>
                        <span>{formattedStartDate} → {formattedEndDate}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <FaBuilding className="text-primary text-sm"/>
                    <div className="flex flex-col">
                        <span className="text-xs text-textLight">Company</span>
                        <span>{projectData?.company?.name || "N/A"}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <FaUser className="text-primary text-sm"/>
                    <div className="flex flex-col">
                        <span className="text-xs text-textLight">Created By</span>
                        <span>{projectData?.user?.displayName || "Unknown"}</span>
                    </div>
                </div>
            </div>

            {role !== ROLES.WORKER && (
                <div className="mt-4 flex gap-2 items-end">
                    <div className="flex-1">
                        <PaginatedDropdown
                            fetchData={fetchUsers}
                            renderItem={(item: any) => <span>{item.label}</span>}
                            onSelect={setSelectedUser}
                            placeholder={selectedUser ? selectedUser.label : "Select a worker"}
                        />
                    </div>
                    <button
                        onClick={handleAssignProject}
                        disabled={!selectedUser?.value || isLoading}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isLoading ? "Assigning..." : "Assign"}
                    </button>
                </div>
            )}

            {selectedUsers.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm font-medium text-text mb-2">Assigned Users:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedUsers.map((user) => (
                            <div key={user.value}
                                 className="flex items-center px-3 py-1 rounded-full text-sm border border-text transition">
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
