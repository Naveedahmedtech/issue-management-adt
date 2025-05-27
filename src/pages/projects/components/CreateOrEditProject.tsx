import React, { useEffect, useState } from "react";
import InputField from "../../../components/form/InputField.tsx";
import SelectField from "../../../components/form/SelectField.tsx";
// import FileUpload from "../../../components/form/FileUpload.tsx";
import Button from "../../../components/buttons/Button.tsx";
import { validateProjectForm, ValidationError } from "../../../utils/validation.ts";
import { CreateOrEditProjectProps, ProjectFormData } from "../../../types/types.ts";
import { PROJECT_STATUS } from "../../../constant/index.ts";
import { useLazyGetAllCompaniesQuery } from "../../../redux/features/companyApi.ts";
import PaginatedDropdown from "../../../components/dropdown/PaginatedDropdown.tsx";
import ModalContainer from "../../../components/modal/ModalContainer.tsx";
import CreateCompanyForm from "../../company/components/CreateCompanyForm.tsx";
import PaginatedUserSelect from "../../../components/dropdown/PaginatedUserSelect.tsx";
import { ROLES } from "../../../constant/ROLES.ts";
import CheckboxField from "../../../components/form/CheckboxField.tsx";
import DateRangePicker from "../../../components/DateRangePicker.tsx";

const CreateOrEditProject: React.FC<CreateOrEditProjectProps> = ({ initialData, mode, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<ProjectFormData>({
        title: "",
        description: "",
        startDate: null,
        endDate: null,
        companyId: "",
        status: { label: PROJECT_STATUS.ACTIVE, value: PROJECT_STATUS.ACTIVE.toUpperCase() },
        files: [],
        userIds: [],
        isOrder: false,
        ...initialData, // initial data if provided
    });

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [errors, setErrors] = useState<ValidationError[]>([]);

    // fetch companies
    const [selectedCompany, setSelectedCompany] = useState<{ label: string; value: string } | null>(null);

    const [triggerAllCompanies] = useLazyGetAllCompaniesQuery();
    useEffect(() => {
        if (initialData) {
            setFormData(initialData); // Prefill form data for edit mode

            if (initialData.companyId) {
                // Fetch companies and set the selected company
                (async () => {
                    const response = await triggerAllCompanies({ page: 1, limit: 20 }).unwrap();
                    const companies = response?.data?.companies ?? [];

                    const matchedCompany = companies.find((company: any) => company.id === initialData.companyId);
                    if (matchedCompany) {
                        setSelectedCompany({ label: matchedCompany.name, value: matchedCompany.id });
                    }
                })();
            }
        }
    }, [initialData, triggerAllCompanies]);
    const fetchAllCompanies = async (page: number) => {
        try {
            const response = await triggerAllCompanies({ page, limit: 20 }).unwrap();
            const companies = response?.data?.companies ?? [];
            const pagination = response?.data ?? {};

            // Map users to dropdown format
            const companyOptions = companies.map((company: any) => ({
                value: company.id,
                label: company.name,
            }));

            return {
                data: companyOptions,
                hasMore: (pagination.page * pagination.limit) < pagination.total,
            };
        } catch (error) {
            console.error("Error fetching companies:", error);
            return { data: [{ value: "all", label: "All" }], hasMore: false };
        }
    };
    useEffect(() => {
        if (initialData) {
            setFormData(initialData); // Prefill data for edit mode
        }
    }, [initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // const handleDateChange = (date: Date | null, field: keyof ProjectFormData) => {
    //     setFormData({ ...formData, [field]: date });
    // };

    // const handleFileUpload = (uploadedFiles: File[]) => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         files: uploadedFiles,
    //     }));
    // };

    const handleSelectChange = (option: { label: string; value: string } | null) => {
        setFormData({ ...formData, status: option });
    };


    const resetFormData = () => {
        setFormData({
            title: "",
            description: "",
            status: { label: "", value: "" },
            startDate: null,
            endDate: null,
            files: [],
            companyId: "",
            isOrder: false,
            userIds: [],
        });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form data
        const validationErrors = validateProjectForm(formData);

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors([]);
            onSubmit(formData, resetFormData); // Pass form data to parent for create/update logic
        }
    };

    const getError = (field: string) => {
        return errors.find((error) => error.field === field)?.message || "";
    };

    return (
        <>
            <form
                className="p-10 bg-backgroundShade1 rounded-lg shadow-lg mx-auto max-w-4xl grid grid-cols-1 gap-6"
                onSubmit={handleSubmit}
            >
                <h2 className="text-3xl font-bold text-center text-text mb-6">
                    {mode === "create" ? "Create New Project" : "Edit Project"}
                </h2>

                <div>
                    <InputField
                        label="Project Name"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full"
                    />
                    {getError("title") && <p className="text-red-500 text-sm mt-1">{getError("title")}</p>}
                </div>

                <div>
                    <InputField
                        label="Description"
                        type="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full"
                    />
                    {getError("description") && <p className="text-red-500 text-sm mt-1">{getError("description")}</p>}
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <PaginatedDropdown
                            fetchData={fetchAllCompanies}
                            renderItem={(item: any) => <span>{item.label}</span>}
                            onSelect={(item: any) => {
                                setFormData({ ...formData, companyId: item.value });
                                setSelectedCompany(item);
                            }}
                            selectedItem={selectedCompany}
                            placeholder="Select a company"
                        />
                        {getError("companyId") && <p className="text-red-500 text-sm mt-1">{getError("companyId")}</p>}
                    </div>
                    <div>
                        <Button text="Create Company" fullWidth={false} onClick={() => setCreateModalOpen(true)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="mb-2">Choose Planning Weeks</p>
                        <DateRangePicker
                            startDate={formData.startDate}
                            endDate={formData.endDate}
                            onChange={(start, end) => {
                                setFormData(prev => ({
                                    ...prev,
                                    startDate: start,
                                    endDate: end,
                                }));
                            }}
                        />
                    </div>
                </div>
                <div>
                    <p>Assign to users</p>
                    <PaginatedUserSelect
                        name="userIds"
                        roleName={ROLES.WORKER}
                        value={formData.userIds}
                        onChange={(userIds) => setFormData({ ...formData, userIds })}
                    />
                </div>
                <div>
                    <SelectField
                        label="Status"
                        options={[
                            { label: PROJECT_STATUS.ACTIVE, value: PROJECT_STATUS.ACTIVE.toUpperCase() },
                            { label: PROJECT_STATUS.ON_GOING, value: PROJECT_STATUS.ON_GOING.toUpperCase() },
                            { label: PROJECT_STATUS.COMPLETED, value: PROJECT_STATUS.COMPLETED.toUpperCase() },
                        ]}
                        value={formData.status}
                        onChange={handleSelectChange}
                        className="w-full"
                    />
                    {getError("status") && <p className="text-red-500 text-sm mt-1">{getError("status")}</p>}
                </div>

                {/* <div>
                    <FileUpload
                        label="Upload Files (PDFs or Excel)"
                        onChange={handleFileUpload}
                        accept="application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        className="w-full"

                    />
                    {getError("files") && <p className="text-red-500 text-sm mt-1">{getError("files")}</p>}
                </div> */}
                <div>
                    <CheckboxField
                        label="Mark as order type"
                        name="isOrder"
                        checked={formData.isOrder}
                        onChange={e => setFormData({ ...formData, isOrder: e.target.checked })}
                    />
                    {getError("isOrder") && (
                        <p className="text-red-500 text-sm mt-1">{getError("isOrder")}</p>
                    )}
                </div>

                <div className="flex justify-center">
                    <Button
                        text={mode === "create" ? "Create Project" : "Update Project"}
                        type="submit"
                        isSubmitting={isLoading}
                    />
                </div>
            </form>
            {
                createModalOpen && <ModalContainer
                    isOpen={createModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    title="Create Company"
                >
                    <CreateCompanyForm onClose={() => setCreateModalOpen(false)} />
                </ModalContainer>
            }
        </>
    );
};

export default CreateOrEditProject;
