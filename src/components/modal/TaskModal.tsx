import React, { useState } from "react";
import ModalContainer from "./ModalContainer.tsx";
import TaskDetailsView from "../Board/TaskDetailsView.tsx";
import TaskEditForm from "../Board/TaskEditForm.tsx";

const TaskModal: React.FC<{
    task: any;
    isEditMode: boolean;
    setIsEditMode: (value: boolean) => void;
    onSave: (updatedTask: any) => void;
    onClose: () => void;
}> = ({ task, isEditMode, setIsEditMode, onClose }) => {
    const [editableTask] = useState(task);
    //
    const handleSave = () => {
        // onSave(editableTask);
        setIsEditMode(false);
    };

    return (
        <ModalContainer
            isOpen={!!task}
            onClose={onClose}
            title={isEditMode ? "Edit Issue" : "Task Details"}
        >
            {isEditMode ? (
                <TaskEditForm
                    initialTask={editableTask}
                    // setTask={setEditableTask}
                    onSave={handleSave}
                    onCancel={onClose}
                />
            ) : (
                <TaskDetailsView
                    task={task}
                    onEdit={() => setIsEditMode(true)}
                    onClose={onClose}
                />
            )}
        </ModalContainer>
    );
};

export default TaskModal;
