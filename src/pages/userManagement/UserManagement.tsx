import React, { useState } from 'react';
import { useGetAllUserQuery, useAssignManagerMutation } from '../../redux/features/userApi';
import AssignButton from '../../components/buttons/AssignButton';
import UserTable from '../../components/Table/UserTable';
import PaginationControls from '../components/userManagement/PaginationControls';
import ManagerSelect from '../components/userManagement/ManagerSelect';
import RoleFilter from '../components/userManagement/RoleFilter';


const UserManagement: React.FC = () => {
    const [role, setRole] = useState('manager');
    const [selectedManager, setSelectedManager] = useState<string | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const limit = 10;

    // Fetch users based on selected role and pagination
    const { data, error, isLoading } = useGetAllUserQuery({ page, limit, role });
    const { data: managersData, isLoading: loadingManagers } = useGetAllUserQuery({ role: 'manager' });
    const [assignManager] = useAssignManagerMutation();

    const handleAssign = async () => {
        if (selectedManager && selectedUsers.length > 0) {
            try {
                await assignManager({
                    managerId: selectedManager,
                    userIds: selectedUsers
                }).unwrap();
                alert('Users assigned to manager successfully!');
                setSelectedUsers([]); // Reset selected users after assigning
            } catch (error) {
                console.error("Failed to assign manager:", error);
                alert('Failed to assign users. Please try again.');
            }
        } else {
            alert("Please select a manager and at least one user to assign.");
        }
    };

    return (
        <div className="p-4 bg-background rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-text">User Management</h2>

            <RoleFilter role={role} onChange={setRole} />

            {role === 'user' && (
                <ManagerSelect
                    selectedManager={selectedManager}
                    onChange={setSelectedManager}
                    managersData={managersData}
                    loadingManagers={loadingManagers}
                />
            )}

            {role === 'user' && selectedManager && selectedUsers.length > 0 && (
                <AssignButton onClick={handleAssign} />
            )}

            {isLoading ? (
                <p className="text-text">Loading users...</p>
            ) : error ? (
                <p className="text-red-500">Failed to load users.</p>
            ) : (
                <UserTable
                    users={data?.result?.users}
                    role={role}
                    selectedUsers={selectedUsers}
                    onUserSelect={setSelectedUsers}
                />
            )}

            <PaginationControls page={page} setPage={setPage} hasMore={data?.result?.hasMore} />
        </div>
    );
};

export default UserManagement;
