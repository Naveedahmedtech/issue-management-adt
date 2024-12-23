import React, { useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineEdit } from 'react-icons/ai';
import { priorityColors, statusColors, truncateText } from '../../utils/universal';
import TaskModal from '../modal/TaskModal';
import { Task, TaskFormValues, TasksTableProps } from '../../types/types';
import { format } from 'date-fns';
import { useUpdateTasksMutation } from '../../redux/features/tasksApi';

interface ExtendedTasksTableProps extends TasksTableProps {
    showActions?: boolean;
    showAssignedUser?: boolean;
    showDescription?: boolean;
}

const TasksTable: React.FC<ExtendedTasksTableProps> = ({
    tasks: initialTasks,
    onUpdate,
    showActions = true,
    showAssignedUser = false,
    showDescription = true,
}) => {
    const [tasks, setTasks] = useState(initialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const handleModalOpen = (task: Task, editMode: boolean) => {
        setSelectedTask({ ...task, dueDate: task.dueDate || null });
        setIsEditing(editMode);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const [updateTask] = useUpdateTasksMutation();

    const handleUpdateTask = (updatedTask: Task) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
        setIsModalOpen(false);
    };

    const handleUpdate = async (values: TaskFormValues) => {
        try {
            if (selectedTask) {
                const result = await updateTask({ id: selectedTask.id, body: values }).unwrap();
                handleUpdateTask(result?.result);
                if (onUpdate) {
                    onUpdate();
                }
                handleCloseModal();
            }
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    return (
        <div className="overflow-x-auto p-4">
            <table className="min-w-full bg-backgroundShade1 text-text rounded-lg shadow-lg">
                <thead>
                    <tr className="border-b border-border text-left text-sm font-semibold">
                        <th className="p-4">Title</th>
                        {showDescription && <th className="p-4">Description</th>}
                        {showAssignedUser && <th className="p-4">User</th>}
                        <th className="p-4">Status</th>
                        <th className="p-4">Priority</th>
                        <th className="p-4">Due Date</th>
                        {showActions && <th className="p-4">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-backgroundShade2 transition-colors duration-150">
                            <td className="p-4 text-sm md:text-base whitespace-nowrap">{task.title}</td>
                            {showDescription && (
                                <td className="p-4 text-sm md:text-base whitespace-nowrap">
                                    {truncateText(task.description, 50)}
                                </td>
                            )}
                            {showAssignedUser && (
                                <td className="p-4 text-sm md:text-base whitespace-nowrap">
                                    {task.assignedUser?.email || "Unassigned"}
                                </td>
                            )}
                            <td className="p-4 text-sm md:text-base whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full ${statusColors[task.status.toLowerCase()]}`}>
                                    {task.status}
                                </span>
                            </td>
                            <td className="p-4 text-sm md:text-base whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full ${priorityColors[task.priority.toLowerCase()]}`}>
                                    {task.priority}
                                </span>
                            </td>
                            <td className="p-4 text-sm md:text-base whitespace-nowrap">
                                {task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : 'No Due Date'}
                            </td>
                            {showActions && (
                                <td className="p-4 flex gap-2 whitespace-nowrap">
                                    <button
                                        onClick={() => handleModalOpen(task, false)}
                                        className="p-2 rounded-full hover:bg-hover transition"
                                    >
                                        <AiOutlineEye size={18} className="text-textHover" />
                                    </button>
                                    <button
                                        onClick={() => handleModalOpen(task, true)}
                                        className="p-2 rounded-full hover:bg-hover transition"
                                    >
                                        <AiOutlineEdit size={18} className="text-textHover" />
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && selectedTask && (
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    task={selectedTask}
                    isEditing={isEditing}
                    handleUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default TasksTable;
