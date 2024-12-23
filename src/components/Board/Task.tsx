import React from "react";
import { Draggable } from "@hello-pangea/dnd";

interface TaskProps {
    task: {
        id: string;
        title: string;
        description: string;
        status: string;
    };
    index: number;
}

const Task: React.FC<TaskProps> = ({ task, index }) => {
    const getStatusStyle = (status: string) => {
        switch (status) {
            case "To Do":
                return "bg-gray-200 text-gray-800";
            case "In Progress":
                return "bg-yellow-200 text-yellow-800";
            case "Done":
                return "bg-green-200 text-green-800";
            default:
                return "bg-gray-200 text-gray-800";
        }
    };

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white p-4 rounded-md shadow-md mb-3 hover:shadow-lg transition-all"
                >
                    <h4 className="font-bold text-gray-800">{task.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                    <span
                        className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            task.status
                        )}`}
                    >
            {task.status}
          </span>
                </div>
            )}
        </Draggable>
    );
};

export default Task;
