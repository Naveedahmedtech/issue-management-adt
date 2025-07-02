import React from "react";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center mt-6 text-textDark">
            <button
                className="px-4 py-2 mx-1 bg-primary text-text rounded-full shadow-md hover:bg-hover transition"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Prev
            </button>
            <span className="px-4 py-2  font-semibold ">Page {currentPage} of {totalPages}</span>
            <button
                className="px-4 py-2 mx-1 bg-primary text-text rounded-full shadow-md hover:bg-hover transition"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
