import { FaFilePdf, FaFileExcel } from "react-icons/fa";

export const renderFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
        case "pdf":
            return <FaFilePdf className="text-red-600 text-lg mr-2" />;
        case "excel":
        case "xlsx":
        case "xls":
            return <FaFileExcel className="text-green-600 text-lg mr-2" />;
        default:
            return null;
    }
};

export const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
};
