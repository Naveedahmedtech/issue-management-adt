import React from "react";
import { FaTimes } from "react-icons/fa";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    width?: string; // Optional: Custom width (default is 300px)
    title: string; 
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children, width = "500px", title }) => {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                className={`fixed top-0 right-0 h-full bg-backgroundShade1 shadow-lg transform transition-transform z-50 overflow-auto ${isOpen ? "translate-x-0" : "translate-x-full"
                    } border-l border-border w-[${width}]`}
            >
                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b border-border bg-backgroundShade2">
                    <h3 className="text-lg font-bold text-primary">{title}</h3>
                    <button onClick={onClose} className="text-textSecondary hover:text-primary">
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Drawer Content */}
                <div className="p-4 overflow-auto text-text">{children}</div>
            </div>
        </>
    );
};

export default Drawer;
