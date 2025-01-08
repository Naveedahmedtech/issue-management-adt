import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { fetchMockProject } from "../../mock/mockAPI";
import Column from "./Column";

const Board: React.FC<any> = ({ projectIssues }) => {
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

        const sourceColumnIndex = projectIssues?.findIndex((col: any) => col.id === source.droppableId);
        const destinationColumnIndex = projectIssues?.findIndex((col: any) => col.id === destination.droppableId);

        const sourceColumn = projectIssues?.[sourceColumnIndex];
        const destinationColumn = projectIssues?.[destinationColumnIndex];

        const sourceTasks = Array.from(sourceColumn.tasks);
        const [movedTask] = sourceTasks.splice(source.index, 1);

        if (sourceColumn.id === destinationColumn.id) {
            sourceTasks.splice(destination.index, 0, movedTask);
            const updatedColumns = [...projectIssues];
            updatedColumns[sourceColumnIndex].tasks = sourceTasks;
            setProject({ ...project, columns: updatedColumns });
        } else {
            const destinationTasks = Array.from(destinationColumn.tasks);
            destinationTasks.splice(destination.index, 0, movedTask);

            const updatedColumns = [...projectIssues];
            updatedColumns[sourceColumnIndex].tasks = sourceTasks;
            updatedColumns[destinationColumnIndex].tasks = destinationTasks;
            setProject({ ...project, columns: updatedColumns });
        }
    };

    if (!project) return <div className="text-text">Loading...</div>;

    return (
        <div className="p-6 bg-background min-h-screen">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4">
                    {projectIssues?.map((column: any) => (
                        <Column key={column.id} column={column} />
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Board;
