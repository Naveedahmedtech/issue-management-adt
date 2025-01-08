import React from "react";
import { Draggable, DraggableProvided } from "@hello-pangea/dnd";
import { format } from "date-fns";
import {TaskProps} from "../../types/types.ts";

const STATUS_COLORS: Record<string, string> = {
    "TO DO": "bg-todo text-text",
    "IN PROGRESS": "bg-pending text-text",
    "COMPLETED": "bg-success text-text",
    Default: "bg-pending text-text",
};



const Task: React.FC<TaskProps> = ({ task, index, onClick }) => {
    const getStatusStyle = (status: string): string => {
        return STATUS_COLORS[status] || STATUS_COLORS.Default;
    };

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided: DraggableProvided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-backgroundShade1 p-4 rounded-md shadow-md mb-3 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => onClick(task)} // Trigger modal on click
                >
                    <h4 className="font-bold text-text mb-2">{task.title}</h4>
                    <p className="text-text text-sm mb-3">{task.description?.slice(0,50)}</p>
                    <div className="text-xs text-text-muted mb-2">
                        <p>
                            <strong>Start Date:</strong>{" "}
                            <span>{format(new Date(task.startDate), "MMM dd, yyyy")}</span>
                        </p>
                        <p>
                            <strong>End Date:</strong>{" "}
                            <span>{format(new Date(task.endDate), "MMM dd, yyyy")}</span>
                        </p>
                    </div>
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
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
