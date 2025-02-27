import React from "react";
import TaskDetailsView from "../Board/TaskDetailsView.tsx";
import TaskEditForm from "../Board/TaskEditForm.tsx";
import LargeModal from "./LargeModal.tsx";

const TaskModal: React.FC<{
    task: any;
    isEditMode: boolean;
    setIsEditMode: (value: boolean) => void;
    onSave: (updatedTask: any) => void;
    onClose: () => void;
    component?: string;
    refetch: () => void;
    isArchived: boolean;
    projectId: string;
    setActiveTab: (tab: string) => void;    
    setIssueId: (id: string) => void;    
    refetchFiles: () => void;
}> = ({ task, isEditMode, setIsEditMode, onClose, component, refetch, isArchived, projectId, setActiveTab, setIssueId, refetchFiles }) => {
    const handleSave = () => {
        onClose();
        setIsEditMode(false);
    };

    console.log("task", task)

    return (
        <LargeModal
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
                    refetchFiles={refetchFiles}
                />
            ) : (
                <TaskDetailsView
                    task={task}
                    onEdit={() => setIsEditMode(true)}
                    onClose={onClose}
                    onDelete={onClose}
                    component={component}
                    refetch={refetch}
                    isArchived={isArchived || task.project?.archived}
                    projectId={projectId || task.project.id}
                    setActiveTab={setActiveTab}
                    setIssueId={setIssueId}
                    refetchFiles={refetchFiles}
                />
            )}
        </LargeModal>
    );
};

export default TaskModal;
