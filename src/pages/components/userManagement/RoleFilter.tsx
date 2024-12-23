import React from 'react';

interface RoleFilterProps {
    role: string;
    onChange: (role: string) => void;
}

const RoleFilter: React.FC<RoleFilterProps> = ({ role, onChange }) => {
    const roles = [
        { value: 'manager', label: 'Manager' },
        { value: 'user', label: 'User' }
    ];

    return (
        <div className="mb-4">
            <label className="block font-medium mb-2 text-text">Filter by Role:</label>
            <select
                value={role}
                onChange={(e) => onChange(e.target.value)}
                className="p-2 border border-border rounded w-full bg-backgroundShade1 text-text"
            >
                {roles.map(roleOption => (
                    <option key={roleOption.value} value={roleOption.value}>
                        {roleOption.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default RoleFilter;
