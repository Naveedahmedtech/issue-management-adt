import { useGetAllCompaniesQuery } from "../../redux/features/companyApi";
import { useEffect, useState } from "react";
import { getCompanyColumns } from "../../utils/Common";
import Table from "../../components/Table";
import Button from "../../components/buttons/Button";
import { Company as CompanyType } from "../../types/types";
import ModalContainer from "../../components/modal/ModalContainer";
import { useDeleteCompanyMutation } from "../../redux/features/companyApi";
import EditCompanyForm from "./components/EditCompanyForm";
import DeleteCompanyForm from "./components/DeleteCompanyForm";
import CreateCompanyForm from "./components/CreateCompanyForm";

const Company = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const limit = 20;
    const [deleteCompany, { isLoading: isDeleting, isSuccess: isDeleteSuccess }] = useDeleteCompanyMutation();
    const { data: allCompanies, isLoading, refetch } = useGetAllCompaniesQuery({ page: currentPage, limit });

    useEffect(() => {
        if (allCompanies?.data?.companies) {
            setTotalPages(Math.ceil(allCompanies?.data?.total / limit));
        }
    }, [allCompanies]);

    useEffect(() => {
        if (isDeleteSuccess) {
            setDeleteModalOpen(false);
            setSelectedCompanyId(null);
        }
    }, [isDeleteSuccess]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    const handleEditCompany = (company: CompanyType) => {
        setSelectedCompany(company);
        setEditModalOpen(true);
    }

    const handleDeleteCompany = (companyId: string) => {
        setSelectedCompanyId(companyId);
        setDeleteModalOpen(true);
    }

    const handleDeleteConfirm = async () => {
        if (selectedCompanyId) {
            await deleteCompany(selectedCompanyId);
        }
    }

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedCompany(null);
    }

    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
    }

    const columns = getCompanyColumns(handleEditCompany, handleDeleteCompany);

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[200px]">
            <div className="text-primary text-lg font-semibold">Loading companies...</div>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-text">All Companies</h1>
                <Button text="Create Company" fullWidth={false} onClick={() => setCreateModalOpen(true)} />
            </div>
            {allCompanies && <Table
                columns={columns}
                data={allCompanies?.data?.companies}
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />}

            {editModalOpen && <ModalContainer
                isOpen={editModalOpen}
                onClose={handleCloseEditModal}
                title="Edit Company"
            >
                <EditCompanyForm selectedCompany={selectedCompany} onClose={handleCloseEditModal} refetch={refetch} />
            </ModalContainer>}
            {deleteModalOpen && <ModalContainer
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete Company"
            >
                <DeleteCompanyForm handleDeleteConfirm={handleDeleteConfirm} isDeleting={isDeleting} onClose={() => setDeleteModalOpen(false)} refetch={refetch} />
            </ModalContainer>}
            {createModalOpen && <ModalContainer
                isOpen={createModalOpen}
                onClose={handleCloseCreateModal}
                title="Create Company"
            >
                <CreateCompanyForm onClose={handleCloseCreateModal} refetch={refetch} />
            </ModalContainer>}
        </div>
    );
};

export default Company;

