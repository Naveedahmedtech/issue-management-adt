import React, { useEffect, useRef } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

interface LargeModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const LargeModal: React.FC<LargeModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close modal when clicking outside of the modal content
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50  flex justify-center items-center">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm"></div>

            {/* Modal content */}
            <div
                ref={modalRef}
                className="relative bg-backgroundShade1 p-6 rounded-lg shadow-lg w-full max-w-screen-xl max-h-screen overflow-auto transform scale-100"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-text">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-text hover:text-red-600 transition-all"
                    >
                        <AiOutlineCloseCircle className="w-8 h-8" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="overflow-auto max-h-[80vh]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default LargeModal;
