import React from "react";
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
    refetch: () => void;
}> = ({ task, isEditMode, setIsEditMode, onClose, component, refetch }) => {
    const handleSave = () => {
        onClose();
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
                    initialTask={task}
                    // setTask={setEditableTask}
                    onSave={handleSave}
                    onCancel={onClose}
                    refetch={refetch}
                />
            ) : (
                <TaskDetailsView
                    task={task}
                    onEdit={() => setIsEditMode(true)}
                    onClose={onClose}
                    onDelete={onClose}
                    component={component}
                    refetch={refetch}
                />
            )}
        </ModalContainer>
    );
};

export default TaskModal;
