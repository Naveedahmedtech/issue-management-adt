import React from "react";
import { generatePagination } from "../../utils/pagination";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  maxVisible = 1,
}) => {
  const pagination = generatePagination(totalPages, currentPage, maxVisible);

  return (
    <div className="flex justify-center mt-4 space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 border border-border rounded-md ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-backgroundShade1 text-text"
        }`}
      >
        Prev
      </button>

      {/* Pagination Buttons */}
      {pagination.map((item, index) =>
        typeof item === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(item)}
            className={`px-4 py-2 border border-border rounded-md ${
              item === currentPage
                ? "bg-primary text-white"
                : "bg-backgroundShade1 text-text"
            }`}
          >
            {item}
          </button>
        ) : (
          <span key={index} className="px-2 py-2 text-gray-500">
            ...
          </span>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 border border-border rounded-md ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-backgroundShade1 text-text"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
