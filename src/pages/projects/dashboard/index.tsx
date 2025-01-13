import React from 'react';
import StatCard from "../../../components/cards/StatCard.tsx";
import { useGetProjectStatsQuery, useGetRecentProjectsQuery } from '../../../redux/features/projectsApi.ts';
import RecentProjects from '../components/RecentProjects.tsx';

const Index: React.FC = () => {
    const { data, error, isLoading } = useGetProjectStatsQuery({});
    const { data: recentProjects, error: recentProjectError, isLoading: isRecentProjectLoading } = useGetRecentProjectsQuery({});


    return (
        <div>
            <main className="p-4">
                <h2 className="text-2xl font-bold mb-4 text-text">
                    Welcome to Project Dashboard
                </h2>
                <section className="mb-6">
                    <h3 className="text-xl font-semibold text-text mb-4">Stats</h3>
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                            Failed to load project statistics. Please try again later.
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {isLoading ? (
                            [1, 2, 3, 4].map((index) => (
                                <div key={index} className="p-4 bg-backgroundShade2 rounded shadow animate-pulse">
                                    <div className="h-6 bg-background mb-4 rounded"></div>
                                    <div className="h-4 bg-background w-1/2 rounded"></div>
                                </div>
                            ))
                        ) : (
                            <>
                                <StatCard
                                    title="Total Projects"
                                    value={data?.data?.totalProjects || 0}
                                    color={"var(--color-text)"}
                                />
                                <StatCard
                                    title="Total Issues"
                                    value={data?.data?.totalIssues || 0}
                                    color={"var(--color-text)"}
                                />
                                <StatCard
                                    title="Total Issues Completed"
                                    value={data?.data?.totalCompletedIssues || 0}
                                    color="green"
                                />
                                <StatCard
                                    title="Total Issues Todo"
                                    value={data?.data?.totalToDoIssues || 0}
                                    color="orange"
                                />
                            </>
                        )}
                    </div>
                </section>


                <section className='mb-6'>
                    <RecentProjects 
                    recentProjects={recentProjects} 
                    error={recentProjectError} 
                    isLoading={isRecentProjectLoading}
                     />
                </section>
            </main>
        </div>
    );
};

export default Index;
