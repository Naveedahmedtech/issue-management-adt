import React, { useEffect, useState } from "react";
import Table from "../Table";
import SelectField from "../SelectField";
import ModalContainer from "../modal/ModalContainer";
import { format } from "date-fns";
import { fetchMockProject } from "../../mock/mockAPI";
import { AiOutlineEye } from "react-icons/ai";
import {ITask} from "../../types/types.ts";



const TaskTable: React.FC<{ projectId: string | undefined }> = () => {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

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
                <ModalContainer
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Task Details"
                >
                    <div>
                        <p><strong>Title:</strong> {selectedTask.title}</p>
                        <p><strong>Description:</strong> {selectedTask.description}</p>
                        <p><strong>Status:</strong> {selectedTask.status}</p>
                        <p><strong>Start Date:</strong> {format(new Date(selectedTask.startDate), "MMM dd, yyyy")}</p>
                        <p><strong>End Date:</strong> {format(new Date(selectedTask.endDate), "MMM dd, yyyy")}</p>
                    </div>
                </ModalContainer>
            )}
        </>
    );
};

export default TaskTable;
