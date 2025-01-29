import React from "react";

interface TableProps {
    columns: { id: string; label: string; render: (row: any) => React.ReactNode }[];
    data: any[];
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

const Table: React.FC<TableProps> = ({ columns, data, currentPage = 1, totalPages = 1, onPageChange }) => {
    const renderPagination = () => {
        if (!onPageChange || totalPages <= 1) return null;

        const maxPageButtons = 2;
        const pageButtons = [];

        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        if (endPage - startPage < maxPageButtons - 1) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        if (startPage > 1) {
            pageButtons.push(
                <button
                    key="first"
                    onClick={() => onPageChange(1)}
                    className="px-3 py-2 border border-border rounded-md bg-backgroundShade1 text-text hover:bg-primary hover:text-white transition-colors duration-200"
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pageButtons.push(
                    <span
                        key="ellipsis-start"
                        className="px-3 py-2 text-textSecondary"
                    >
                        ...
                    </span>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`px-4 py-2 border border-border rounded-md mx-1 transition-colors duration-200 ${
                        i === currentPage ? "bg-primary text-white" : "bg-backgroundShade1 text-text hover:bg-primary hover:text-white"
                    }`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageButtons.push(
                    <span
                        key="ellipsis-end"
                        className="px-3 py-2 text-textSecondary"
                    >
                        ...
                    </span>
                );
            }
            pageButtons.push(
                <button
                    key="last"
                    onClick={() => onPageChange(totalPages)}
                    className="px-3 py-2 border border-border rounded-md bg-backgroundShade1 text-text hover:bg-primary hover:text-white transition-colors duration-200"
                >
                    {totalPages}
                </button>
            );
        }

        return (
            <div className="flex items-center justify-center mt-4 space-x-2">
                {currentPage > 1 && (
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        className="px-3 py-2 border border-border rounded-md bg-backgroundShade1 text-text hover:bg-primary hover:text-white transition-colors duration-200"
                    >
                        Prev
                    </button>
                )}
                {pageButtons}
                {currentPage < totalPages && (
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        className="px-3 py-2 border border-border rounded-md bg-backgroundShade1 text-text hover:bg-primary hover:text-white transition-colors duration-200"
                    >
                        Next
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="overflow-x-auto w-full">
            <table className="min-w-full bg-backgroundShade1 border border-border rounded-md">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.id}
                                className="text-left px-4 py-2 border-b border-border text-text font-semibold"
                                style={{ minWidth: "120px" }}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                className="hover:bg-backgroundShade2 transition-colors"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.id}
                                        className="px-4 py-2 border-b border-border text-text"
                                        style={{ minWidth: "150px" }}
                                    >
                                        {column.render(row)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="text-center px-4 py-6 text-textSecondary italic"
                            >
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {renderPagination()}
        </div>
    );
};

export default Table;
