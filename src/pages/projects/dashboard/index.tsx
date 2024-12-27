import React from 'react';
import StatCard from "../../../components/cards/StatCard.tsx";


const Index: React.FC = () => {


    return (
        <div>
            <main className="p-4">
                <h2 className="text-2xl font-bold mb-4 text-text">
                    Welcome to Project Dashboard
                </h2>
                <section className="mb-6">
                    <h3 className="text-xl font-semibold text-text mb-4">Stats</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                title="Total Projects" value={10}
                                color={"var(--color-text)"}
                            />
                            <StatCard
                                title="Total Issues"
                                value={5}
                                color={"var(--color-text)"}
                            />
                            <StatCard
                                title="Total Completed Issues" value={3}
                                color="green"
                            />
                            <StatCard
                                title="Total Issues Todo"
                                value={2}
                                color={"orange"}
                            />
                        </div>
                </section>
            </main>
        </div>
    );
};

export default Index;
