import React, { useState } from 'react';
import { useGetArchivedProjectsQuery } from '../../../redux/features/projectsApi.ts';
import ArchivedProjects from '../components/ArchiveProjects.tsx';

const Index: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const { data: archivedProjects, error: archivedProjectError, isLoading: isArchivedProjectLoading } = useGetArchivedProjectsQuery({ page: currentPage, limit: 20 });

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            <section className='mb-6'>
                <ArchivedProjects
                    projects={archivedProjects?.data?.projects}
                    error={archivedProjectError}
                    isLoading={isArchivedProjectLoading}
                    currentPage={currentPage}
                    totalPages={Math.ceil(archivedProjects?.data?.total / archivedProjects?.data?.limit)}
                    handlePageChange={handlePageChange}
                />
            </section>
        </div>
    );
};

export default Index;
