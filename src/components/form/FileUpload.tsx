import React, { useState, useRef } from "react";
import clsx from "clsx";
import {FaTrashAlt} from "react-icons/fa";
import { toast } from "react-toastify";

interface FileUploadProps {
    label: string;
    onChange: (files: File[]) => void;
    accept: string;
    className: string;
    labelColor?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onChange, accept, className, labelColor = "text-text" }) => {
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const allowedTypes = accept.split(",");
            const selectedFiles = Array.from(e.target.files).filter((file) =>
                allowedTypes.includes(file.type)
            );

            if (selectedFiles.length !== e.target.files.length) {
                toast.info("Some files were not allowed and were excluded.");
            }

            const updatedFiles = [...files, ...selectedFiles];
            setFiles(updatedFiles);
            onChange(updatedFiles);

            // Reset the input field so the same files can be re-selected if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onChange(updatedFiles);

        // Reset the file input field when no files are left
        if (updatedFiles.length === 0 && fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className={clsx("mb-4", className)}>
            <label className={`block ${labelColor} mb-2 font-medium`}>{label}</label>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple
                onChange={handleFileChange}
                className="hidden"
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-border bg-hover text-text rounded-md hover:bg-backgroundShade1"
            >
                Choose Files
            </button>
            {files.length > 0 && (
                <ul className="mt-4 space-y-2">
                    {files.map((file, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center bg-hover p-3 rounded-md shadow-sm"
                        >
                            <span className="truncate text-text font-medium">{file.name}</span>
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 transition-all"
                                aria-label="Remove file"
                            >
                                <FaTrashAlt />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FileUpload;
