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
    component?: string;
}> = ({ task, isEditMode, setIsEditMode, onClose, component }) => {
    const [editableTask] = useState(task);
    console.log("task", task, editableTask);
    const handleSave = () => {
        // onSave(editableTask);
        setIsEditMode(false);
    };

    return (
        <ModalContainer
            isOpen={!!task}
            onClose={onClose}
            title={isEditMode ? `Edit ${component === "order" ? "Order" : "Issue"}` : `${component === "order" ? "Order" : "Issue"} Details`}
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
                    onDelete={onClose}
                    component={component}
                />
            )}
        </ModalContainer>
    );
};

export default TaskModal;
