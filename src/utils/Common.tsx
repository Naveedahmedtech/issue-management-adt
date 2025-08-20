import { APP_NAME } from "../constant/BASE_URL";
import Text from "../components/Text";
import { Company, DocumentDataRow, FileType, ITitleText, User, } from "../types/types";
import { FaFileAlt, FaFileExcel, FaFilePdf, FaFileWord, } from "react-icons/fa";
import React from "react";
import { PERMISSIONS, ROLES } from "../constant/ROLES.ts";

const Hello = () => {
    return (
        <>Hello</>
    )
}

export default Hello;

export const TitleText: React.FC<ITitleText> = ({ text }) => (
    <Text className="text-text text-4xl font-semibold mb-5 ">
        {text} {APP_NAME}
    </Text>
);


export const getFileIcon = (type: FileType) => {
    switch (type) {
        case "PDF":
            return <FaFilePdf className="text-red-500 w-6 h-6" />;
        case "Word":
            return <FaFileWord className="text-blue-500 w-6 h-6" />;
        case "Excel":
        case "XLSX":
            return <FaFileExcel className="text-green-500 w-6 h-6" />;
        default:
            return <FaFileAlt className="text-gray-500 w-6 h-6" />;
    }
};

export const projectDocumentColumns = (
    handleAnnotateFile: (file: DocumentDataRow) => void,
    isArchived: boolean,
    handleDownloadFile: (file: DocumentDataRow) => void,
    handleDeleteFileModal: (file: DocumentDataRow) => void,
) => [
        // { id: "icon", label: "File", render: (row: DocumentDataRow) => getFileIcon(row.type) },
        {
            id: "fileName", label: "File Name", render: (row: DocumentDataRow) => (
                <div
                    className="max-w-[120px] sm:max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis"
                    title={row.fileName}
                    style={{ textOverflow: "ellipsis" }}
                >
                    {row.fileName}
                </div>)
        },
        { id: "date", label: "Date", render: (row: DocumentDataRow) => row.date },
        { id: "time", label: "Time", render: (row: DocumentDataRow) => row.time },
        { id: "type", label: "Type", render: (row: DocumentDataRow) => row.type },
        {
            id: "actions",
            label: "Actions",
            render: (row: DocumentDataRow) => {
                return (
                    <>
                        {
                            !isArchived &&
                            <div className="flex flex-wrap space-x-2">
                                <button
                                className="px-2 py-1 text-sm font-medium text-primary rounded hover:bg-primary/10 transition"

                                    onClick={() => handleAnnotateFile(row)}
                                >
                                    View
                                </button>
                                <button
                                className="px-2 py-1 text-sm font-medium text-primary rounded hover:bg-primary/10 transition"

                                    onClick={() => handleDownloadFile(row)}
                                >
                                    Download
                                </button>
                                <button
                                className="px-2 py-1 text-sm font-medium text-red-600 rounded hover:bg-red-50 transition"
                                    onClick={() => handleDeleteFileModal(row)}
                                >
                                    Delete
                                </button>
                            </div>
                        }
                    </>
                )
            }
        },
    ];

export const orderDocumentColumns = (
    handleSignFile: (file: DocumentDataRow) => void,
    isArchived: boolean,
    handleDownloadFile: (file: DocumentDataRow) => void,
    handleDeleteFileModal: (file: DocumentDataRow) => void,
) => [
        {
            id: "fileName", label: "File Name", render: (row: DocumentDataRow) => (
                <div
                    className="max-w-[120px] sm:max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis"
                    title={row.fileName}
                    style={{ textOverflow: "ellipsis" }}
                >
                    {row.fileName}
                </div>)
        },
        { id: "date", label: "Created At", render: (row: DocumentDataRow) => row.date },
        { id: "time", label: "Time", render: (row: DocumentDataRow) => row.time },
        {
            id: "signature",
            label: "Signature",
            render: (row: DocumentDataRow) =>
                row.isSigned ? (
                    <span className={`px-3 py-1 rounded-full text-text text-xs font-semibold bg-success`}>
                        Signed
                    </span>
                ) : <span className={`px-3 py-1 rounded-full text-textDark text-xs font-semibold bg-background`}>
                    Unsigned
                </span>
        },
        {
            id: "actions",
            label: "Actions",
            render: (row: DocumentDataRow) => (
                <>
                    {!isArchived && (
                        <div className="flex flex-wrap gap-2">
                            <button
                                className="px-2 py-1 text-sm font-medium text-primary rounded hover:bg-primary/10 transition"
                                onClick={() => handleSignFile(row)}
                            >
                                {row.isSigned ? "View" : "Sign"}
                            </button>
                            <button
                                className="px-2 py-1 text-sm font-medium text-primary rounded hover:bg-primary/10 transition"
                                onClick={() => handleDownloadFile(row)}
                            >
                                Download
                            </button>
                            <button
                                className="px-2 py-1 text-sm font-medium text-red-600 rounded hover:bg-red-50 transition"
                                onClick={() => handleDeleteFileModal(row)}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </>
            )
        }

    ];


export const getUserManagementColumns = (
    handleEditUser: (user: User) => void,
    handleDeleteUser: (userId: string) => void,
    openAccessModal: (user: User) => void,
) => [
        {
            id: "email",
            label: "Email",
            render: (row: User) => <span>{row.email}</span>,
        },
        {
            id: "name",
            label: "Name",
            render: (row: User) => <span>{row.displayName || '---'}</span>,
        },
        {
            id: "role",
            label: "Role",
            render: (row: User) => (
                <span
                    className={`
        inline-flex px-2 py-0.5 rounded-full text-xs font-medium
        ${row.role === "SUPER_ADMIN"
                            ? "bg-red-100 text-red-700"
                            : row.role === "ADMIN"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"}
      `}
                >
                    {row.role.replace("_", " ")}
                </span>
            ),
        },
        {
            id: "permissions",
            label: "Permissions",
            render: (row: User) =>
                row.permissions && row.permissions.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {row.permissions.map((perm, idx) => (
                            <span
                                key={idx}
                                className="inline-flex px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
                            >
                                {perm.replace(/_/g, " ")}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-gray-400">---</span>
                ),
        },

        {
            id: "actions",
            label: "Actions",
            render: (row: User) => (
<div className="flex gap-3">
    <button
        className="px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition"
        onClick={() => openAccessModal(row)}
    >
        Manage Access
    </button>
    <button
        className="px-2 py-1 text-sm font-medium text-green-600 hover:bg-green-50 rounded transition"
        onClick={() => handleEditUser(row)}
    >
        Edit
    </button>
    <button
        className="px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition"
        onClick={() => handleDeleteUser(row.id)}
    >
        Delete
    </button>
</div>

            ),
        },
    ];


export const getCompanyColumns = (
    handleEditCompany: (company: Company) => void,
    handleDeleteCompany: (companyId: string) => void
) => [
        {
            id: "name",
            label: "Name",
            render: (row: Company) => <span>{row.name}</span>,
        },
        {
            id: "actions",
            label: "Actions",
            render: (row: Company) => (
                <div className="flex space-x-2">
                    <button className="text-primary" onClick={() => handleEditCompany(row)}>Edit</button>
                    <button className="text-error" onClick={() => handleDeleteCompany(row.id)}>Delete</button>
                </div>
            ),
        },
    ];


export const rolesOptions = Object.values(ROLES).map((role) => ({
    label: role.replace("_", " ").replace(/\b\w/g, (char) => char.toUpperCase()), // Formats 'SUPER_ADMIN' to 'Super Admin'
    value: role,
}));

export const permissionsOptions = Object.values(PERMISSIONS).map((permission) => ({
    label: permission
        .toLowerCase()
        .replace(/_/g, " ") // Replaces underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()), // Capitalizes each word
    value: permission,
}));


export const getStatusBadge = (status: string) => {
    const badgeColor =
        {
            completed: "bg-success",
            "in progress": "bg-todo",
            pending: "bg-pending",
        }[status?.toLowerCase()] || "bg-yellow-500";

    return (
        <span
            className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${badgeColor}`}
        >
            {status}
        </span>
    );
};
