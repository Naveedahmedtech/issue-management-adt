import React, { useEffect, useState } from "react";
import Table from "../Table";
import SelectField from "../SelectField";
import { format } from "date-fns";
import { fetchMockProject } from "../../mock/mockAPI";
import { AiOutlineEye } from "react-icons/ai";
import {ITask} from "../../types/types.ts";
import TaskModal from "../modal/TaskModal.tsx";



const TaskTable: React.FC<{ projectId: string | undefined }> = () => {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);


    const handleCloseModal = () => {
        setSelectedTask(null);
        setIsEditMode(false);
    };

    const handleSave = (updatedTask: ITask) => {
        console.log("Updated Task:", updatedTask);
        setSelectedTask(updatedTask);
    };

    useEffect(() => {
        const loadProject = async () => {
            try {
                const data = await fetchMockProject();
                if (data?.columns) {
                    const allTasks = data.columns.flatMap((column) => column.tasks || []);
                    setTasks(allTasks);
                } else {
                    console.error("Invalid data format: columns missing");
                }
            } catch (error) {
                console.error("Failed to fetch project data", error);
            }
        };
        loadProject();
    }, []);

    const statusOptions = [
        { label: "To Do", value: "To Do" },
        { label: "In Progress", value: "In Progress" },
        { label: "Done", value: "Done" },
    ];

    const handleStatusChange = (taskId: string, selectedOption: { label: string; value: string } | null) => {
        if (selectedOption) {
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId ? { ...task, status: selectedOption.value } : task
                )
            );
        }
    };

    const handleViewDetails = (task: ITask) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const columns = [
        {
            id: "title",
            label: "Title",
            render: (row: ITask) => <span>{row.title}</span>,
        },
        {
            id: "description",
            label: "Description",
            render: (row: ITask) => <span>{row.description.slice(0, 50)}...</span>,
        },
        {
            id: "status",
            label: "Status",
            render: (row: ITask) => (
                <SelectField
                    label=""
                    name={`status-${row.id}`}
                    options={statusOptions}
                    value={statusOptions.find((option) => option.value === row.status) || null}
                    onChange={(option) => handleStatusChange(row.id, option)}
                />
            ),
        },
        {
            id: "startDate",
            label: "Start Date",
            render: (row: ITask) => (
                <span>{format(new Date(row.startDate), "MMM dd, yyyy")}</span>
            ),
        },
        {
            id: "endDate",
            label: "End Date",
            render: (row: ITask) => (
                <span>{format(new Date(row.endDate), "MMM dd, yyyy")}</span>
            ),
        },
        {
            id: "action",
            label: "Actions",
            render: (row: ITask) => (
                <button
                    className="text-primary hover:underline flex items-center"
                    onClick={() => handleViewDetails(row)}
                >
                    <AiOutlineEye className="mr-2 text-2xl" />
                </button>
            ),
        },
    ];

    return (
        <>
            <Table columns={columns} data={tasks} />
            {isModalOpen && selectedTask && (
                <TaskModal
                    task={selectedTask}
                    isEditMode={isEditMode}
                    setIsEditMode={setIsEditMode}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default TaskTable;
