import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { fetchMockProject } from "../../mock/mockAPI";
import Column from "./Column";

const Board: React.FC = () => {
    const [project, setProject] = useState<any | null>(null);

    useEffect(() => {
        const loadProject = async () => {
            const data = await fetchMockProject();
            setProject(data);
        };
        loadProject();
    }, []);

    const onDragEnd = (result: DropResult) => {
        if (!project) return;

        const { source, destination } = result;
        if (!destination) return;

        const sourceColumnIndex = project.columns.findIndex((col:any) => col.id === source.droppableId);
        const destinationColumnIndex = project.columns.findIndex((col:any) => col.id === destination.droppableId);

        const sourceColumn = project.columns[sourceColumnIndex];
        const destinationColumn = project.columns[destinationColumnIndex];

        const sourceTasks = Array.from(sourceColumn.tasks);
        const [movedTask] = sourceTasks.splice(source.index, 1);

        if (sourceColumn.id === destinationColumn.id) {
            sourceTasks.splice(destination.index, 0, movedTask);
            const updatedColumns = [...project.columns];
            updatedColumns[sourceColumnIndex].tasks = sourceTasks;
            setProject({ ...project, columns: updatedColumns });
        } else {
            const destinationTasks = Array.from(destinationColumn.tasks);
            destinationTasks.splice(destination.index, 0, movedTask);

            const updatedColumns = [...project.columns];
            updatedColumns[sourceColumnIndex].tasks = sourceTasks;
            updatedColumns[destinationColumnIndex].tasks = destinationTasks;
            setProject({ ...project, columns: updatedColumns });
        }
    };

    if (!project) return <div>Loading...</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="mb-6 bg-white shadow-md rounded-md p-6">
                <h1 className="text-2xl font-bold text-gray-800">{project.title}</h1>
                <p className="text-gray-600 mt-2">{project.description}</p>
                <span className="inline-block mt-4 px-3 py-1 rounded-full bg-yellow-200 text-yellow-800 text-sm font-medium">
          {project.status}
        </span>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4">
                    {project.columns.map((column:any) => (
                        <Column key={column.id} column={column} />
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Board;
