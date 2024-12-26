import React from "react";

interface TableProps {
    columns: { id: string; label: string; render: (row: any) => React.ReactNode }[];
    data: any[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-backgroundShade1 border border-border rounded-md">
                <thead>
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column.id}
                            className="text-left px-4 py-2 border-b border-border text-text font-semibold"
                            style={{ minWidth: "120px" }} // Set minimum width for table columns
                        >
                            {column.label}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr
                        key={row.id || rowIndex}
                        className="hover:bg-backgroundShade2 transition-colors"
                    >
                        {columns.map((column) => (
                            <td
                                key={column.id}
                                className="px-4 py-2 border-b border-border text-text"
                                style={{ minWidth: "150px" }} // Ensure minimum width consistency for table cells
                            >
                                {column.render(row)}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
