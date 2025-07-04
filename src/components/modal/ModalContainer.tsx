import React, { useEffect, useRef } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

interface ModalContainerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
    width?: string;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
                                                           isOpen,
                                                           onClose,
                                                           children,
                                                           title,
                                                           width = 'max-w-lg',
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
        <div className="fixed inset-0 flex justify-center items-center z-50">
            {/* Background with blur */}
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>
            <div
                ref={modalRef}
                className={`relative bg-backgroundShade1 p-6 rounded-lg shadow-xl w-full ${width} transition-all transform duration-300 scale-95`}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-text text-xl font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-text hover:text-error transition-all duration-300 ease-in-out focus:outline-none"
                    >
                        <AiOutlineCloseCircle className="w-8 h-8" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="overflow-auto max-h-[70vh] text-text px-4 py-2 space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModalContainer;
