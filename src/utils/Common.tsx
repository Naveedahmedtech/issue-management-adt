import { APP_NAME, BASE_URL } from "../constant/BASE_URL";
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
                  {(row.extension && row.extension.toLowerCase() === "pdf") ? "View" : (row.extension && row.extension.toLowerCase() == "xlsx") ? "View" : ""}
                </button>
                {/* {
                  (row.extension && row.extension.toLowerCase() != "xlsx") && (
                    <button
                      className="text-primary hover:underline"
                      onClick={() => handleSignFile("")}
                    >
                      Signing
                    </button>
                  )
                } */}
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
  handleSignFile: (file: DocumentDataRow) => void,
  isArchived: boolean,
  handleViewFile: (file: string | undefined) => void,
) => [
    { id: "fileName", label: "File Name", render: (row: DocumentDataRow) => row.fileName },
    { id: "date", label: "Created At", render: (row: DocumentDataRow) => row.date },
    { id: "type", label: "Type", render: (row: DocumentDataRow) => row.type },
    {
      id: "signature",
      label: "Signature",
      render: (row: DocumentDataRow) =>
        row.signaturePath ? (
          <div style={{
            display: "inline-block",
            padding: "5px",
            backgroundColor: "#f8f8f8", // ✅ Light gray background for contrast
            borderRadius: "5px",
            border: "1px solid #ccc", // ✅ Border for clarity
            cursor: "pointer"
          }}
            onClick={() => handleViewFile(row.signaturePath)}
          >
            <img src={`${BASE_URL}/${row.signaturePath}`} alt="Signature" width="50" height="50" />
          </div>
        ) : "No Signature"
    },
    {
      id: "initial",
      label: "Initial",
      render: (row: DocumentDataRow) =>
        row.initialPath ? (
          <div style={{
            display: "inline-block",
            padding: "5px",
            backgroundColor: "#f8f8f8", // ✅ Light gray background for contrast
            borderRadius: "5px",
            border: "1px solid #ccc",
            cursor: "pointer"
          }}
            onClick={() => handleViewFile(row.initialPath)}
          >
            <img src={`${BASE_URL}/${row.initialPath}`} alt="Initial" />
          </div>
        ) : "No Initial"
    },
    {
      id: "actions",
      label: "Actions",
      render: (row: DocumentDataRow) => (
        <>
          {!isArchived && (
            <div className="flex space-x-2">
              {
                row.initialPath ? <button
                  className="text-primary hover:underline"
                  onClick={() => handleViewFile(row?.filePath)}
                >
                  View
                </button> : <button
                  className="text-primary hover:underline"
                  onClick={() => handleSignFile(row)}
                >
                  Signing
                </button>
              }

            </div>
          )}
        </>
      )
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
