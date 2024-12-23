import React, { useState } from 'react';

interface Permission {
    [permission: string]: boolean;
}

interface RolePermissions {
    [role: string]: Permission;
}

const ManageRoles: React.FC = () => {
    // Roles and their specific permissions
    const roles = ['Admin', 'Manager', 'User'];
    const permissionsStructure: { [role: string]: string[] } = {
        Admin: [
            'Manage Users',
            'Manage Roles',
            'Manage Permissions',
            'Full Task Access',
        ],
        Manager: [
            'View Assigned Users',
            'Manage Own Tasks',
            'Manage Assigned User Tasks',
        ],
        User: [
            'Manage Own Tasks',
        ],
    };

    // Initialize state with permissions for each role
    const [rolePermissions, setRolePermissions] = useState<RolePermissions>(() =>
        roles.reduce((acc, role) => {
            acc[role] = permissionsStructure[role].reduce((permAcc, perm) => {
                permAcc[perm] = false;
                return permAcc;
            }, {} as Permission);
            return acc;
        }, {} as RolePermissions)
    );

    const handlePermissionChange = (role: string, permission: string) => {
        setRolePermissions((prev) => ({
            ...prev,
            [role]: {
                ...prev[role],
                [permission]: !prev[role][permission],
            },
        }));
    };

    const handleSaveChanges = () => {
        console.log('Updated Role Permissions:', rolePermissions);
        // Save logic here (e.g., API call to persist changes)
    };

    return (
        <div>
            <h4 className="text-lg font-semibold mb-4">Roles & Permissions</h4>
            {roles.map((role) => (
                <div key={role} className="mb-6">
                    <h5 className="text-xl font-semibold mb-2">{role} Capabilities</h5>
                    <table className="w-full border-collapse border border-gray-300 mb-4">
                        <thead>
                            <tr>
                                <th className="border p-2">Permission</th>
                                <th className="border p-2">Granted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(rolePermissions[role]).map((permission) => (
                                <tr key={permission}>
                                    <td className="border p-2 font-semibold">{permission}</td>
                                    <td className="border p-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={rolePermissions[role][permission]}
                                            onChange={() => handlePermissionChange(role, permission)}
                                            className="mr-2"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
            <button
                onClick={handleSaveChanges}
                className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-all duration-300"
            >
                Save Changes
            </button>
        </div>
    );
};

export default ManageRoles;
