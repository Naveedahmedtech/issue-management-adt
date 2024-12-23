import React from 'react';
import StatCard from "../../../components/cards/StatCard.tsx";


const Index: React.FC = () => {


    return (
        <div>
            <main className="p-4">
                <h2 className="text-2xl font-bold mb-4 text-text">
                    Welcome, Regular User
                </h2>
                <section className="mb-6">
                    <h3 className="text-xl font-semibold text-text mb-4">Overall Stats</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                title="Total Tasks" value={0}
                                color="var(--color-primary)"
                            />
                            <StatCard
                                title="Total Completed"
                                value={0}
                                color="green"
                                progress={0}
                            />
                            <StatCard
                                title="Total Pending" value={0}
                                color="var(--color-primary)"
                            />
                            <StatCard
                                title="Total Todo"
                                value={0}
                                color="green"
                                progress={0}
                            />
                        </div>
                </section>
            </main>
        </div>
    );
};

export default Index;
