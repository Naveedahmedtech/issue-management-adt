import React from "react";
import { ITask } from "../../types/types.ts";
import { format } from "date-fns";
import { AiOutlineEye } from "react-icons/ai";

interface TaskCardProps {
    task: ITask;
    onView: (task: ITask) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onView }) => {
    return (
        <div className="p-4 bg-backgroundShade1 rounded-md shadow-md">
            <h4 className="text-lg font-bold text-primary mb-2">{task.title}</h4>
            <p className="text-text text-sm mb-2">
                {task.description.length > 50 ? `${task.description.slice(0, 50)}...` : task.description}
            </p>
            <p className="text-sm text-gray-500">
                <strong>Status:</strong> {task.status}
            </p>
            <p className="text-sm text-gray-500">
                <strong>Due:</strong> {format(new Date(task.endDate), "MMM dd, yyyy")}
            </p>
            <button
                className="mt-2 text-primary hover:underline flex items-center"
                onClick={() => onView(task)}
            >
                <AiOutlineEye className="mr-1 text-xl" /> View Details
            </button>
        </div>
    );
};

export default TaskCard;
