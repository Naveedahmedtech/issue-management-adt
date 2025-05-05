import React from 'react';
import {DocumentDataRow} from "../../types/types";

interface ColumnConfig {
    id: string;
    label: string;
    render: (row: DocumentDataRow) => React.ReactNode;
}

interface DocumentsCardListProps {
    data: DocumentDataRow[];
    columns: ColumnConfig[];
}

const DocumentsCardList: React.FC<DocumentsCardListProps> = ({ data, columns }) => {
    if (!data.length) {
        return (
            <div className="flex justify-center items-center min-h-[200px] text-textSecondary text-lg">
                No documents available.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {data.map((row, idx) => (
                <div
                    key={row.id || idx}
                    className="bg-backgroundShade2 border border-border rounded-xl shadow-sm p-5 space-y-2"
                >
                    {columns.map((col, index) => {
                        const isLast = index === columns.length - 1;
                        return (
                            <div
                                key={col.id}
                                className={`flex justify-between items-start ${
                                    isLast ? 'pt-2' : ''
                                }`}
                            >
                                <div
                                    className={`text-sm ${
                                         'text-textSecondary font-medium'
                                    }`}
                                >
                                    {col.label}
                                </div>
                                <div
                                    className={`text-sm text-right ${
                                        index === 0 ? 'text-primary font-bold text-base' : 'text-text'
                                    }`}
                                >
                                    {col.render(row)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default DocumentsCardList;
