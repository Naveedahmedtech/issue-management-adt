import React from "react";
import { ITask } from "../../types/types.ts";
import { format } from "date-fns";
import { AiOutlineEye } from "react-icons/ai";

interface TaskCardProps {
  task: ITask;
  onView: (task: ITask) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onView }) => {
  const truncateHTML = (html: string, maxLength: number) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.innerText;
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="p-4 bg-backgroundShade2 text-textDark rounded-md shadow-md">
      <h4 className="text-lg font-bold mb-2">{task.title}</h4>

      {/* Rich text description rendering */}
      <div
        className="text-sm mb-2"
        dangerouslySetInnerHTML={{
          __html: truncateHTML(task.description, 80),
        }}
      />

      <p className="text-sm">
        <strong>Status:</strong> {task.status}
      </p>
      <p className="text-sm">
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
