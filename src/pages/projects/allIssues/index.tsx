import React, { useState } from "react";
import { useGetAllProjectIssuesQuery } from "../../../redux/features/projectsApi.ts";
import Board from "../../../components/Board";
import { useAuth } from "../../../hooks/useAuth.ts";
import { ROLES } from "../../../constant/ROLES.ts";
import { useLazyGetAllUsersQuery } from "../../../redux/features/authApi.ts";
import PaginatedDropdown from "../../../components/dropdown/PaginatedDropdown.tsx";

const AllIssues = () => {
    const [selectedUser, setSelectedUser] = useState<{ value: string; label: string } | null>(null);
    const { userData } = useAuth();
    const { role, id: loggedInUserId } = userData;

    const filterUserId = role === ROLES.WORKER ? loggedInUserId : selectedUser?.value;

    const {
        data: projectIssues,
        isLoading: isLoadingIssues,
        isFetching: isIssueFetching,
        refetch: refetchIssues
    } = useGetAllProjectIssuesQuery({ userId: filterUserId });

    // Using Lazy Query for Users
    const [triggerGetUsers] = useLazyGetAllUsersQuery();

    // Fetch users dynamically for pagination
    const fetchUsers = async (page: number) => {
        try {
            const response = await triggerGetUsers({ page, limit: 10 }).unwrap();
            const users = response?.data?.users ?? [];
            const pagination = response?.data?.pagination ?? {};

            // Map users to dropdown format
            const userOptions = users.map((user: any) => ({
                value: user.id,
                label: user.displayName || user.email,
            }));

            // Always include "All" option at the top
            const allOption = { value: "", label: "All" };
            const finalOptions = page === 1 ? [allOption, ...userOptions] : userOptions;

            return {
                data: finalOptions,
                hasMore: (pagination.page * pagination.limit) < pagination.total,
            };
        } catch (error) {
            console.error("Error fetching users:", error);
            return { data: [{ value: "all", label: "All" }], hasMore: false };
        }
    };



    return (
        <div>
            <div className="m-5">
                <h2 className="text-2xl font-bold mb-4">Project Issues</h2>

                {role !== ROLES.WORKER && (
                    <div className="mb-4">
                        <PaginatedDropdown
                            fetchData={fetchUsers}
                            renderItem={(item:any) => <span>{item.label}</span>}
                            onSelect={(item:any) => setSelectedUser(item)}
                            placeholder="Select a user"
                        />
                    </div>
                )}
            </div>
            <Board
                projectIssues={projectIssues?.data?.columns}
                refetch={refetchIssues}
                isLoading={isLoadingIssues || isIssueFetching}
            />
        </div>
    );
};

export default AllIssues;
