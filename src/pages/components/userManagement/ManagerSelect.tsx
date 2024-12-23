import React from 'react';

interface ManagerSelectProps {
    selectedManager: string | null;
    onChange: (managerId: string) => void;
    managersData: any;
    loadingManagers: boolean;
}

const ManagerSelect: React.FC<ManagerSelectProps> = ({ selectedManager, onChange, managersData, loadingManagers }) => (
    <div className="mb-4">
        <label className="block font-medium mb-2 text-text">Select Manager to Assign:</label>
        <select
            value={selectedManager || ''}
            onChange={(e) => onChange(e.target.value)}
            className="p-2 border border-border rounded w-full bg-backgroundShade1 text-text"
        >
            <option value="" disabled>Select a Manager</option>
            {loadingManagers ? (
                <option>Loading managers...</option>
            ) : (
                managersData?.result?.users.map((manager: any) => (
                    <option key={manager.id} value={manager.id}>
                        {manager.email}
                    </option>
                ))
            )}
        </select>
    </div>
);

export default ManagerSelect;
