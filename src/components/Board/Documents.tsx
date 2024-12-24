import Table from "../Table";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from "react-icons/fa";

type FileType = "PDF" | "Word" | "Excel" | "Text";

interface DataRow {
    id: number;
    fileName: string;
    date: string;
    type: FileType;
}

const Documents = () => {
    const getFileIcon = (type: FileType) => {
        switch (type) {
            case "PDF":
                return <FaFilePdf className="text-red-500 w-6 h-6" />;
            case "Word":
                return <FaFileWord className="text-blue-500 w-6 h-6" />;
            case "Excel":
                return <FaFileExcel className="text-green-500 w-6 h-6" />;
            default:
                return <FaFileAlt className="text-gray-500 w-6 h-6" />;
        }
    };

    const columns = [
        { id: "icon", label: "", render: (row: DataRow) => getFileIcon(row.type) },
        { id: "fileName", label: "File Name", render: (row: DataRow) => row.fileName },
        { id: "date", label: "Date", render: (row: DataRow) => row.date },
        { id: "type", label: "Type", render: (row: DataRow) => row.type },
    ];

    const data: DataRow[] = [
        { id: 1, fileName: "adobefile.pdf", date: "16/12/2024", type: "PDF" },
        { id: 2, fileName: "report.docx", date: "16/12/2024", type: "Word" },
        { id: 3, fileName: "data.xlsx", date: "16/12/2024", type: "Excel" },
        { id: 4, fileName: "notes.txt", date: "16/12/2024", type: "Text" },
        { id: 5, fileName: "adobefile.pdf", date: "16/12/2024", type: "PDF" },
        { id: 6, fileName: "report.docx", date: "16/12/2024", type: "Word" },
        { id: 7, fileName: "data.xlsx", date: "16/12/2024", type: "Excel" },
        { id: 8, fileName: "notes.txt", date: "16/12/2024", type: "Text" },
    ];

    return (
        <div className="bg-background min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-text mb-4 sm:mb-0">Project Documents</h1>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center w-full sm:w-auto">
                    <button className="px-4 py-2 bg-primary rounded-md w-full sm:w-auto">Add File</button>
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search"
                            className="px-4 py-2 pl-10 border border-border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto"
                        />
                        <span className="absolute left-2 top-2/4 transform -translate-y-2/4 text-textHover">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                                />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            <Table columns={columns} data={data} />
        </div>
    );
};

export default Documents;
