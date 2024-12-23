import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import Task from "./Task";
import { FiFolder } from "react-icons/fi";

interface ColumnProps {
    column: {
        id: string;
        name: string;
        tasks: { id: string; content: string }[];
    };
}

const Column: React.FC<ColumnProps> = ({ column }:any) => {
    return (
        <div className="bg-white rounded-md shadow-md p-4 w-80">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{column.name}</h3>
                <FiFolder className="text-gray-500" />
            </div>
            <Droppable droppableId={column.id}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-[200px] bg-gray-50 p-2 rounded-md"
                    >
                        {column.tasks.map((task:any, index:any) => (
                            <Task key={task.id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Column;
