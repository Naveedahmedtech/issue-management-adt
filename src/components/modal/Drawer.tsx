import React from "react";
import { FaTimes } from "react-icons/fa";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children, title }) => {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                className={`fixed top-0 right-0 h-full bg-backgroundShade2 shadow-lg transform transition-transform duration-300 z-50 overflow-auto border-l border-border
                    ${isOpen ? "translate-x-0" : "translate-x-full"}
                    w-full lg:w-[30vw] min-w-[250px] max-w-[100vw]
                `}
            >
                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b border-border bg-backgroundShade2">
                    <h3 className="text-lg font-bold text-textDark">{title}</h3>
                    <button onClick={onClose} className="text-textDark hover:text-primary">
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
