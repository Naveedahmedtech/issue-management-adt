import React, {useEffect, useState} from "react";
import {DragDropContext, DropResult} from "@hello-pangea/dnd";
import {fetchMockProject} from "../../mock/mockAPI";
import Column from "./Column";
import {useUpdateIssueMutation} from "../../redux/features/issueApi";
import {toast} from "react-toastify";
import {ColumnType, Task} from "../../types/types";
import {projectApi, useUpdateIssueLogHistoryMutation} from "../../redux/features/projectsApi";
import {useAppDispatch} from "../../redux/store.ts";

const Board: React.FC<any> = ({ projectIssues, refetch, isLoading, isArchived, projectId, setActiveTab, setIssueId, refetchFiles }) => {
    const [, setProject] = useState<any | null>(null);
    const [localProjectIssues, setLocalProjectIssues] = useState<ColumnType[]>(projectIssues);

    const [updateIssue] = useUpdateIssueMutation();
    const [updateIssueLogHistory] = useUpdateIssueLogHistoryMutation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const loadProject = async () => {
            const data = await fetchMockProject();
            setProject(data);
        };
        loadProject();
    }, []);

    useEffect(() => {
        setLocalProjectIssues(projectIssues);
    }, [projectIssues]);

    const statusMapping: Record<string, string> = {
        "Active": "ACTIVE",
        "On Going": "ON GOING",
        "Completed": "COMPLETED",
    };

    const onDragEnd = async (result: DropResult) => {
        if (isArchived) return;
        if (!localProjectIssues) return;

        const { source, destination } = result;
        if (!destination) return;

        // Store the previous state to rollback if necessary
        const previousState = [...localProjectIssues];

        // Find source and destination columns
        const sourceColumnIndex = localProjectIssues.findIndex((col) => col.id === source.droppableId);
        const destinationColumnIndex = localProjectIssues.findIndex((col) => col.id === destination.droppableId);

        if (sourceColumnIndex === -1 || destinationColumnIndex === -1) return;

        const sourceColumn = { ...localProjectIssues[sourceColumnIndex] };
        const destinationColumn = { ...localProjectIssues[destinationColumnIndex] };

        // Clone tasks array to avoid direct mutation
        const sourceTasks = Array.from(sourceColumn.tasks);
        const [movedTask] = sourceTasks.splice(source.index, 1);

        if (!movedTask) return;

        // Clone the task object to update its status locally
        const updatedTask: Task = { ...movedTask };

        if (sourceColumn.id === destinationColumn.id) {
            // Moving within the same column
            sourceTasks.splice(destination.index, 0, updatedTask);
            sourceColumn.tasks = sourceTasks;

            const updatedColumns = [...localProjectIssues];
            updatedColumns[sourceColumnIndex] = sourceColumn;
            setLocalProjectIssues(updatedColumns);
        } else {
            // Moving between columns
            const destinationTasks = Array.from(destinationColumn.tasks);
            destinationTasks.splice(destination.index, 0, updatedTask);

            sourceColumn.tasks = sourceTasks;
            destinationColumn.tasks = destinationTasks;

            // Update the task's status locally
            const newStatus = statusMapping[destinationColumn.name];
            if (newStatus) {
                updatedTask.status = newStatus;

                // Optimistically update the local state
                const updatedColumns = [...localProjectIssues];
                updatedColumns[sourceColumnIndex] = sourceColumn;
                updatedColumns[destinationColumnIndex] = destinationColumn;
                setLocalProjectIssues(updatedColumns);

                // API call to update the issue's status on the backend
                const formData = new FormData();
                formData.append("status", newStatus);
                const logBody = [
                    {
                        fieldName: "status",
                        oldValue: movedTask.status,
                        newValue: newStatus,
                    }
                ]
                dispatch(projectApi.util.invalidateTags(['Stats']));
                try {
                    await updateIssue({ issueId: updatedTask.id, formData }).unwrap();
                    refetch();
                } catch (error: any) {
                    // Rollback to the previous state if API call fails
                    setLocalProjectIssues(previousState);
                    toast.error(error?.data?.error?.message || "Failed to update issue status");
                    console.error("Failed to update issue status", error);
                }
                try {
                    await updateIssueLogHistory({ issueId: updatedTask.id, body: logBody }).unwrap();
                } catch (error) {
                    console.error("Failed to update issue log history", error);
                }
            } else {
                console.error("Invalid column name for status mapping");
            }
        }
    };


    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[200px]">
            <div className="text-primary text-lg font-semibold">Loading issues...</div>
        </div>
    );

    return (
        <div className="p-6 bg-background min-h-screen">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4">
                    {localProjectIssues?.map((column) => (
                        <Column key={column.id} column={column} refetch={refetch} isArchived={isArchived} projectId={projectId} setActiveTab={setActiveTab} setIssueId={setIssueId} refetchFiles={refetchFiles} />
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Board;
