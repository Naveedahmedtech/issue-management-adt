import React, { useState } from 'react';
import { useGetTasksQuery, useCreateTasksMutation } from '../../../redux/features/tasksApi';
import TasksTable from '../../../components/Table/TaskTable';
import SelectField from '../../../components/SelectField';
import TaskForm from '../../../components/form/TaskForm';
import ModalContainer from '../../../components/modal/ModalContainer';
import { TaskFormValues } from '../../../types/types';

const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "PENDING", label: "Pending" },
    { value: "COMPLETED", label: "Completed" },
];

const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "HIGH", label: "High" },
    { value: "MEDIUM", label: "Medium" },
    { value: "LOW", label: "Low" },
];

const MyTasks: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 10;

    const { data, error, isLoading, refetch } = useGetTasksQuery({
        page: currentPage,
        limit: tasksPerPage,
        status: statusFilter,
        priority: priorityFilter,
        search,

    }, { refetchOnMountOrArgChange: true });
    const [createTask] = useCreateTasksMutation();

    // Handle search, status, and priority filtering
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (option: { value: string; label: string } | null) => {
        setStatusFilter(option?.value || null);
        setCurrentPage(1);
    };

    const handlePriorityFilter = (option: { value: string; label: string } | null) => {
        setPriorityFilter(option?.value || null);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleAddTask = async (newTask: TaskFormValues) => {
        try {
            await createTask(newTask).unwrap();
            refetch(); // Refetch the tasks after a new task is created
            setIsModalOpen(false); // Close the modal after adding the task
        } catch (error) {
            console.error("Failed to create task:", error);
        }
    };

    // Render loading, error, or data
    if (!data && isLoading) return <p>Loading tasks...</p>;
    if (error) return <p>Failed to load tasks.</p>;
    console.log(data?.result.tasks)
    const tasks = data?.result.tasks || [];
    const pagination = data?.result?.pagination;

    return (
        <div>
            <h2 className="text-lg font-semibold">All Tasks</h2>

            <div className="flex flex-wrap justify-between items-center mb-4">
                <div className="flex flex-wrap gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={handleSearch}
                        className="p-2 border border-gray-500 bg-backgroundShade2 text-text rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition ease-in-out duration-150"
                    />
                    <SelectField
                        label="Status"
                        options={statusOptions}
                        name="statusFilter"
                        value={statusOptions.find(option => option.value === statusFilter) || statusOptions[0]}
                        onChange={handleStatusFilter}
                    />
                    <SelectField
                        label="Priority"
                        options={priorityOptions}
                        name="priorityFilter"
                        value={priorityOptions.find(option => option.value === priorityFilter) || priorityOptions[0]}
                        onChange={handlePriorityFilter}
                    />
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-primary text-text rounded-md hover:bg-primary-dark transition"
                >
                    Create Task
                </button>
            </div>

            <TasksTable tasks={tasks} onUpdate={refetch} />

            <div className="flex justify-center mt-4">
                {Array.from({ length: pagination?.totalPages || 1 }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-primary text-text' : 'bg-gray-200 text-black'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Task Form Modal */}
            {isModalOpen && (
                <ModalContainer isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Task">
                    <TaskForm task={{ title: '', description: '', status: '', priority: '', dueDate: null }} onSubmit={handleAddTask} />
                </ModalContainer>
            )}
        </div>
    );
};

export default MyTasks;
