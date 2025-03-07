import { APP_NAME } from "../constant/BASE_URL";
import Text from "../components/Text";
import { DocumentDataRow, FileType, ITitleText, User, } from "../types/types";
import {
  FaFileAlt,
  FaFileExcel,
  FaFilePdf,
  FaFileWord,
} from "react-icons/fa";
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
  handleSignFile: (userId: string) => void,
  handleDownloadFile: (file: DocumentDataRow) => void,
  isArchived: boolean
) => [
    // { id: "icon", label: "File", render: (row: DocumentDataRow) => getFileIcon(row.type) },
    { id: "fileName", label: "File Name", render: (row: DocumentDataRow) => row.fileName },
    { id: "date", label: "Date", render: (row: DocumentDataRow) => row.date },
    { id: "type", label: "Type", render: (row: DocumentDataRow) => row.type },
    {
      id: "actions",
      label: "Actions",
      render: (row: DocumentDataRow) => {
        return (
          <>
            {
              !isArchived &&
              <div className="flex space-x-2" >
                <button
                  className="text-primary hover:underline"
                  onClick={() => handleAnnotateFile(row)}
                >
                  {(row.extension && row.extension.toLowerCase() === "pdf") ? "Annotate" : (row.extension && row.extension.toLowerCase() == "xlsx") ? "View" : ""}
                </button>
                {
                  (row.extension && row.extension.toLowerCase() != "xlsx") && (
                    <button
                      className="text-primary hover:underline"
                      onClick={() => handleSignFile("")}
                    >
                      Signing
                    </button>
                  )
                }
                <button
                  className="text-primary hover:underline"
                  onClick={() => handleDownloadFile(row)}
                >
                  Download
                </button>
              </div>
            }
          </>
        )
      }
    },
  ];

export const orderDocumentColumns = (
  handleSignFile: (user: DocumentDataRow) => void,
  isArchived: boolean
) => [
    { id: "icon", label: "File", render: (row: DocumentDataRow) => getFileIcon(row.type) },
    { id: "fileName", label: "File Name", render: (row: DocumentDataRow) => row.fileName },
    { id: "date", label: "Last Modified", render: (row: DocumentDataRow) => row.date },
    { id: "type", label: "Type", render: (row: DocumentDataRow) => row.type },
    {
      id: "actions",
      label: "Actions",
      render: (row: DocumentDataRow) => {

        return (
          <>
            {
              !isArchived &&
              <div className="flex space-x-2">
                <button
                  className="text-primary hover:underline"
                  onClick={() => handleSignFile(row)}
                >
                  Signing
                </button>
              </div>
            }
          </>
        )
      }
    },
  ];


export const getUserManagementColumns = (
  handleEditUser: (user: User) => void,
  handleDeleteUser: (userId: string) => void
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
      render: (row: User) => <span>{row.role}</span>,
    },
    {
      id: "permissions",
      label: "Permissions",
      render: (row: User) => <span>{row.permissions.join(", ") || "---"}</span>,
    },
    {
      id: "actions",
      label: "Actions",
      render: (row: User) => (
        <div className="flex space-x-2">
          <button className="text-primary" onClick={() => handleEditUser(row)}>
            Edit
          </button>
          <button className="text-error" onClick={() => handleDeleteUser(row.id)}>
            Delete
          </button>
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
