import React, { useState } from "react";
import Button from "../buttons/Button.tsx";
import ModalContainer from "../modal/ModalContainer.tsx";
import { renderFileIcon, formatDate } from "../../utils/TaskUtils.tsx";

const TaskDetailsView: React.FC<{
    task: any;
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
    component?: string;
}> = ({ task, onEdit, onDelete, component }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDelete = () => {
        setIsDeleteModalOpen(false);
        onDelete();
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
                    {task.files?.map((file: any, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                            {renderFileIcon(file.type)}
                            <a
                                href={file.url}
                                rel="noopener noreferrer"
                                className="text-text hover:underline"
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
                <Button
                    text="Delete"
                    onClick={() => setIsDeleteModalOpen(true)}
                    fullWidth={false}
                    preview={'danger'}
                />
            </div>

            {isDeleteModalOpen && (
                <ModalContainer
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title={`Delete ${component === "order" ? "Order" : "Issue"} Confirmation`}
                >
                    <p className="text-text">
                        Are you sure you want to delete this {component === "order" ? "Order" : "Issue"} ? This action cannot be undone.
                    </p>
                    <div className="flex justify-end mt-6 space-x-4">
                        <Button
                            text="Delete"
                            onClick={handleDelete}
                            fullWidth={false}
                            preview={'danger'}
                        />
                    </div>
                </ModalContainer>
            )}
        </div>
    );
};

export default TaskDetailsView;
