import React, { useState } from 'react';
import ArchiveOrders from '../components/ArchiveOrders.tsx';
import { useGetArchivedOrdersQuery } from '../../../redux/features/orderApi.ts';

const Index: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const { data: archivedOrders, error: archivedOrderError, isLoading: isArchivedOrderLoading } = useGetArchivedOrdersQuery({ page: currentPage, limit: 20 });

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            <section className='mb-6'>
                <ArchiveOrders
                    orders={archivedOrders?.data?.orders}
                    error={archivedOrderError}
                    isLoading={isArchivedOrderLoading}
                    currentPage={currentPage}
                    totalPages={Math.ceil(archivedOrders?.data?.total / archivedOrders?.data?.limit)}
                    handlePageChange={handlePageChange}
                />
            </section>
        </div>
    );
};

export default Index;
