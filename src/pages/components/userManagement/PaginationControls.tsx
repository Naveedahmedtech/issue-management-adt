import React from 'react';

interface PaginationControlsProps {
    page: number;
    setPage: (page: any) => void;
    hasMore: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ page, setPage, hasMore }) => (
    <div className="flex justify-between items-center mt-4">
        <button
            onClick={() => setPage((prev:any) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-backgroundShade2 text-text rounded hover:bg-hover transition"
            disabled={page === 1}
        >
            Previous
        </button>
        <span className="text-text">Page {page}</span>
        <button
            onClick={() => setPage((prev:any) => prev + 1)}
            className="px-4 py-2 bg-backgroundShade2 text-text rounded hover:bg-hover transition"
            disabled={!hasMore}
        >
            Next
        </button>
    </div>
);

export default PaginationControls;
