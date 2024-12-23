import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UserTableProps {
    users: any[];
    role: string;
    selectedUsers: string[];
    onUserSelect: (selectedUsers: string[]) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, role, selectedUsers, onUserSelect }) => {
    const navigate = useNavigate();

    const handleUserSelect = (userId: string) => {
        onUserSelect(
            selectedUsers.includes(userId)
                ? selectedUsers.filter(id => id !== userId)
                : [...selectedUsers, userId]
        );
    };

    return (
        <table className="min-w-full bg-backgroundShade1 text-text rounded-lg shadow-lg">
            <thead>
                <tr className="border-b border-border text-left text-sm font-semibold">
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id} className="hover:bg-hover transition-colors duration-150">
                        <td className="p-4 text-sm md:text-base whitespace-nowrap">{user.email}</td>
                        <td className="p-4 text-sm md:text-base whitespace-nowrap">
                            {role === 'manager' ? 'Manager' : 'User'}
                        </td>
                        <td className="p-4 text-sm md:text-base whitespace-nowrap">
                            {role === 'manager' ? (
                                <button
                                    onClick={() => navigate(`/manager/${user.id}/tasks`)}
                                    className="px-2 py-1 bg-primary text-text rounded  transition"
                                >
                                    View Tasks
                                </button>
                            ) : (
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleUserSelect(user.id)}
                                    className="form-checkbox text-primary"
                                />
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UserTable;
