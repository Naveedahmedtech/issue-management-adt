import React from "react";
import { Draggable, DraggableProvided } from "@hello-pangea/dnd";
import { format } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
    "To Do": "bg-todo text-text",
    "In Progress": "bg-pending text-text",
    "Done": "bg-success text-text",
    Default: "bg-pending text-text",
};

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    startDate: string; // Assuming dates are passed as ISO strings
    endDate: string;
}

interface TaskProps {
    task: Task;
    index: number;
}

const Task: React.FC<TaskProps> = ({ task, index }) => {
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
                    className="bg-backgroundShade1 p-4 rounded-md shadow-md mb-3 hover:shadow-lg transition-all"
                >
                    <h4 className="font-bold text-text mb-2">{task.title}</h4>
                    <p className="text-text text-sm mb-3">{task.description}</p>
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