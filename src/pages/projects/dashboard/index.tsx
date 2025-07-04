import React from 'react';
import StatCard from "../../../components/cards/StatCard.tsx";
import {useGetProjectStatsQuery, useGetRecentProjectsQuery} from '../../../redux/features/projectsApi.ts';
import AllProjectsCards from '../components/AllProjects.tsx';

const Index: React.FC = () => {
    const { data, error, isLoading } = useGetProjectStatsQuery({});
    const { data: recentProjects, error: recentProjectError, isLoading: isRecentProjectLoading } = useGetRecentProjectsQuery({limit: 5});


    return (
        <div>
            <main className="p-4 text-textDark">
                <h2 className="text-2xl font-bold mb-4">
                    Welcome to Project Dashboard
                </h2>
                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">Overview</h3>
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                            Failed to load project statistics. Please try again later.
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {isLoading ? (
                            [1, 2, 3, 4].map((index) => (
                                <div key={index} className="p-4 bg-backgroundShade2 rounded shadow animate-pulse">
                                    <div className="h-6 bg-backgroundShade2 mb-4 rounded"></div>
                                    <div className="h-4 bg-backgroundShade2 w-1/2 rounded"></div>
                                </div>
                            ))
                        ) : (
                            <>
                                <StatCard
                                    title="Total Projects"
                                    value={data?.data?.totalProjects || 0}
                                    color={"var(--color-text-dark)"}
                                />
                                <StatCard
                                    title="Total Issues"
                                    value={data?.data?.totalIssues || 0}
                                    color={"var(--color-text-dark)"}
                                />
                                <StatCard
                                    title="Total Issues Completed"
                                    value={data?.data?.totalCompletedIssues || 0}
                                    color="green"
                                />
                                <StatCard
                                    title="Total Issues Active"
                                    value={data?.data?.totalToDoIssues || 0}
                                    color="orange"
                                />
                            </>
                        )}
                    </div>
                </section>


                <section className='mb-6'>
                <h3 className="text-xl font-semibold text-textDark mb-4">Recent Projects</h3>
                    <AllProjectsCards
                        projects={recentProjects?.data?.projects}
                        error={recentProjectError}
                        isLoading={isRecentProjectLoading}
                        totalPages={1}
                        currentPage={1}
                    />
                </section>
            </main>
        </div>
    );
};

export default Index;
