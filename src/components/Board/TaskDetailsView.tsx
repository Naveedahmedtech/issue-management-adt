import React, { useState } from "react";
import Button from "../buttons/Button.tsx";
import ModalContainer from "../modal/ModalContainer.tsx";
import { renderFileIcon, formatDate } from "../../utils/TaskUtils.tsx";
import { useDeleteIssueMutation } from "../../redux/features/issueApi.ts";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth.ts";
import { ROLES } from "../../constant/ROLES.ts";
import { BASE_URL } from "../../constant/BASE_URL.ts";

const TaskDetailsView: React.FC<{
    task: any;
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
    refetch: () => void;
    component?: string;
}> = ({ task, onEdit, onDelete, component, refetch }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


    const { userData } = useAuth();
    const { userData: { role } } = userData;

    // Using the delete issue mutation
    const [deleteIssue, { isLoading }] = useDeleteIssueMutation();

    const handleDelete = async () => {
        try {
            await deleteIssue(task.id).unwrap();
            onDelete(); // Callback to handle successful delete
            setIsDeleteModalOpen(false);
            refetch()
            toast.success("Issue deleted successfully!")
        } catch (err) {
            console.error("Failed to delete issue:", err);
            toast.error("Unable to delete issue, please try again!")
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h4 className="text-lg font-bold text-primary mb-2">Title</h4>
                <p className="text-text">{task.title}</p>
            </div>
            <div>
                <h4 className="text-lg font-bold text-primary mb-2">Description</h4>
                <p className="text-text">{task.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h4 className="text-lg font-bold text-primary mb-2">Status</h4>
                    <p className="text-text">{task.status}</p>
                </div>
                <div>
                    <h4 className="text-lg font-bold text-primary mb-2">Dates</h4>
                    <p>
                        <strong>Start:</strong> {formatDate(task.startDate)}
                    </p>
                    <p>
                        <strong>End:</strong> {formatDate(task.endDate)}
                    </p>
                </div>
            </div>
            <div>
                <h4 className="text-lg font-bold text-primary mb-2">Attachments</h4>
                <ul className="space-y-2">
                    {task.files?.map((file: {name: string, type: string, url: string}, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                            {renderFileIcon(file.type)}
                            <a
                                className="text-text hover:underline"
                                href={`${BASE_URL}/${file?.url}`}
                                target="_blank"
                            >
                                {file.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
                <Button
                    text="Edit"
                    onClick={onEdit}
                    fullWidth={false}
                    className="bg-primary text-white"
                />
                {
                    role !== ROLES.WORKER && (
                        <Button
                            text="Delete"
                            onClick={() => setIsDeleteModalOpen(true)}
                            fullWidth={false}
                            preview={"danger"}
                        />
                    )
                }
            </div>

            {isDeleteModalOpen && (
                <ModalContainer
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title={`Delete ${component === "order" ? "Order" : "Issue"} Confirmation`}
                >
                    <p className="text-text">
                        Are you sure you want to delete this {component === "order" ? "Order" : "Issue"}? This action cannot be undone.
                    </p>
                    <div className="flex justify-end mt-6 space-x-4">
                        <Button
                            text={"Delete"}
                            onClick={handleDelete}
                            fullWidth={false}
                            preview={"danger"}
                            isSubmitting={isLoading}
                        />
                    </div>
                </ModalContainer>
            )}
        </div>
    );
};

export default TaskDetailsView;
