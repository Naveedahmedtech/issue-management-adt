import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/cards/StatCard';
import TasksTable from '../../components/Table/TaskTable';
import { useAuth } from '../../hooks/useAuth';
import { APP_ROUTES } from '../../constant/APP_ROUTES';
import { useGetTasksQuery, useGetUserTaskCountsQuery } from '../../redux/features/tasksApi';
import { useGetDashboardCountQuery } from '../../redux/features/userApi';

const Dashboard: React.FC = () => {
    const { userData } = useAuth();

    // Fetch recent tasks and user-specific stats with refetching capability
    const { data, isLoading: tasksLoading, refetch: refetchTasks } = useGetTasksQuery(
        { page: 1, limit: 5 },
        { refetchOnMountOrArgChange: true }
    );
    const { data: userTaskCounts, isLoading: userStatsLoading, refetch: refetchUserStats } = useGetUserTaskCountsQuery({});
    const { data: dashboardCounts, isLoading: dashboardLoading, refetch: refetchDashboardCounts } = useGetDashboardCountQuery({});

    // Refetch data when userData changes
    useEffect(() => {
        if (userData) {
            refetchTasks();
            refetchUserStats();
            refetchDashboardCounts();
        }
    }, [userData, refetchTasks, refetchUserStats, refetchDashboardCounts]);

    return (
        <div>
            <main className="p-4">
                <h2 className="text-2xl font-bold mb-4 text-text">
                    Welcome, {userData?.userData?.role === 'ADMIN' ? 'Admin User' : 'Regular User'}
                </h2>

                {/* Admin Overall Stats Section */}
                {userData?.userData?.role === 'ADMIN' && (
                    <section className="mb-6">
                        <h3 className="text-xl font-semibold text-text mb-4">Overall Stats</h3>
                        {dashboardLoading ? (
                            <p>Loading overall stats...</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard title="Total Users" value={dashboardCounts?.result?.totalUsers || 0} color="purple" />
                                <StatCard title="Total Managers" value={dashboardCounts?.result?.totalManagers || 0} color="teal" />
                                <StatCard title="Total Tasks" value={dashboardCounts?.result?.totalTasks || 0} color="var(--color-primary)" />
                                <StatCard
                                    title="Total Completed"
                                    value={dashboardCounts?.result?.totalCompleted || 0}
                                    color="green"
                                    progress={(dashboardCounts?.result?.totalCompleted / dashboardCounts?.result?.totalTasks) * 100 || 0}
                                />
                                <StatCard
                                    title="Total Pending"
                                    value={dashboardCounts?.result?.totalPending || 0}
                                    color="orange"
                                    progress={(dashboardCounts?.result?.totalPending / dashboardCounts?.result?.totalTasks) * 100 || 0}
                                />
                            </div>
                        )}
                    </section>
                )}

                {/* User-specific Stats Section */}
                <section className="mb-6">
                    <h3 className="text-xl font-semibold text-text mb-4">Your Stats</h3>
                    {userStatsLoading ? (
                        <p>Loading your stats...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                title="Total Tasks"
                                value={userTaskCounts?.result?.totalTasks || 0}
                                color="var(--color-primary)"
                            />
                            <StatCard
                                title="Completed"
                                value={userTaskCounts?.result?.completedTasks || 0}
                                color="green"
                                progress={(userTaskCounts?.result?.completedTasks / userTaskCounts?.result?.totalTasks) * 100 || 0}
                            />
                            <StatCard
                                title="Pending"
                                value={userTaskCounts?.result?.pendingTasks || 0}
                                color="orange"
                                progress={(userTaskCounts?.result?.pendingTasks / userTaskCounts?.result?.totalTasks) * 100 || 0}
                            />
                            <StatCard
                                title="In Progress"
                                value={userTaskCounts?.result?.inProgressTasks || 0}
                                color="blue"
                                progress={(userTaskCounts?.result?.inProgressTasks / userTaskCounts?.result?.totalTasks) * 100 || 0}
                            />
                        </div>
                    )}
                </section>

                <section className="space-y-6 mt-5">
                    <div className="p-4 bg-backgroundShade1 rounded-md shadow-md">
                        <h3 className="text-lg font-semibold text-text">Your Recent Tasks</h3>
                        {tasksLoading ? (
                            <p>Loading tasks...</p>
                        ) : (
                            <TasksTable tasks={data?.result?.tasks} />
                        )}
                        <div className="mt-4 text-right">
                            <Link to={APP_ROUTES.APP.MY_TASKS} className="text-primary hover:underline">
                                View All Tasks
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
