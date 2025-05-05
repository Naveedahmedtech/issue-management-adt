import React from 'react';
import StatCard from "../../../components/cards/StatCard.tsx";
import {useGetOrderStatsQuery, useGetRecentOrdersQuery} from '../../../redux/features/orderApi.ts';
import AllOrdersCards from '../components/AllOrders.tsx';

const Index: React.FC = () => {
    const { data, error, isLoading } = useGetOrderStatsQuery({});
    const { data: recentOrders, error: recentOrderError, isLoading: recentOrderLoading } = useGetRecentOrdersQuery({});


    return (
        <div>
            <main className="p-4">
                <h2 className="text-2xl font-bold mb-4 text-text">
                    Welcome to Order Dashboard
                </h2>
                <section className="mb-6">
                    <h3 className="text-xl font-semibold text-text mb-4">Overview</h3>
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
                                    title="Total Orders"
                                    value={data?.data?.totalOrders || 0}
                                    color={"var(--color-text)"}
                                />
                                <StatCard
                                    title="Total Completed Orders"
                                    value={data?.data?.totalCompletedOrders || 0}
                                    color="green"
                                />
                                <StatCard
                                    title="Total In Progress Orders"
                                    value={data?.data?.totalInProgressOrders || 0}
                                    color={"var(--color-text)"}
                                />
                                <StatCard
                                    title="Total Pending Orders"
                                    value={data?.data?.totalPendingOrders || 0}
                                    color="orange"
                                />
                            </>
                        )}
                    </div>
                </section>


                <section className='mb-6'>
                    <h3 className="text-xl font-semibold text-text mb-4">Recent Orders</h3>
                    <AllOrdersCards
                        orders={recentOrders?.data?.orders}
                        error={recentOrderError}
                        isLoading={recentOrderLoading}
                        totalPages={1}
                        currentPage={1}
                    />
                </section>
            </main>
        </div>
    );
};

export default Index;
