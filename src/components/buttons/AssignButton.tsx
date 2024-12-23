import React from 'react';

interface AssignButtonProps {
    onClick: () => void;
}

const AssignButton: React.FC<AssignButtonProps> = ({ onClick }) => (
    <div className="my-4">
        <button
            onClick={onClick}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-textHover transition"
        >
            Assign Selected Users to Manager
        </button>
    </div>
);

export default AssignButton;
