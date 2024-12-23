import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetManagerTasksQuery } from '../../redux/features/userApi';
import TasksTable from '../../components/Table/TaskTable';

const ManagerTasks: React.FC = () => {
    const { managerId } = useParams<{ managerId: string }>();
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 10; 

    const { data, error, isLoading } = useGetManagerTasksQuery({ managerId, page: currentPage, limit: tasksPerPage });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Users Assigned to Manager</h2>
            {isLoading ? (
                <p>Loading tasks...</p>
            ) : error ? (
                <p className="text-red-500">Failed to load tasks.</p>
            ) : (
                <>
                    <TasksTable
                        tasks={data?.result?.tasks || []}
                        showActions={false}
                        showAssignedUser={true}
                        showDescription={true}
                    />

                    {/* Pagination */}
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: data?.result?.pagination?.totalPages || 1 }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-primary text-text' : 'bg-gray-200 text-black'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ManagerTasks;
