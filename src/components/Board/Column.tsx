import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import Task from "./Task";
import { FiFolder } from "react-icons/fi";
import TaskModal from "../modal/TaskModal";
import { ITask } from "../../types/types.ts";

const Column: React.FC<any> = ({ column, refetch, isArchived, projectId, setActiveTab, setIssueId, refetchFiles }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

    const handleTaskClick = (task: ITask) => {
        setSelectedTask(task);
    };

    const handleCloseModal = () => {
        setSelectedTask(null);
        setIsEditMode(false);
    };

    const handleSave = (updatedTask: ITask) => {
        console.log("Updated Task:", updatedTask);
        setSelectedTask(updatedTask);
    };


    return (
        <div
            className="
    bg-backgroundShade2 rounded-lg shadow-md p-4
    flex-1 min-w-[250px] max-w-full
    transition-all duration-200
  "
        >

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-textDark mr-2">{column.name}</h3>
                <FiFolder className="text-textDark" />
            </div>
            <Droppable droppableId={column.id}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-[200px] bg-backgroundShade2 p-2 rounded-xl"
                    >
                        {column.tasks.map((task: any, index: number) => (
                            <Task
                                key={task.id}
                                task={task}
                                index={index}
                                onClick={handleTaskClick}
                                refetch={refetch}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            {selectedTask && (
                <TaskModal
                    task={selectedTask}
                    isEditMode={isEditMode}
                    setIsEditMode={setIsEditMode}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                    refetch={refetch}
                    isArchived={isArchived}
                    projectId={projectId}
                    setActiveTab={setActiveTab}
                    setIssueId={setIssueId}
                    refetchFiles={refetchFiles}
                />
            )}
        </div>
    );
};

export default Column;
