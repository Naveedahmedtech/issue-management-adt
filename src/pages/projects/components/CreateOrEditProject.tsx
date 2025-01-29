import React, { useState, useEffect } from "react";
import InputField from "../../../components/form/InputField.tsx";
import DateField from "../../../components/form/DateField.tsx";
import SelectField from "../../../components/form/SelectField.tsx";
import FileUpload from "../../../components/form/FileUpload.tsx";
import Button from "../../../components/buttons/Button.tsx";
import { validateProjectForm, ValidationError } from "../../../utils/validation.ts";
import { CreateOrEditProjectProps, ProjectFormData } from "../../../types/types.ts";

const CreateOrEditProject: React.FC<CreateOrEditProjectProps> = ({ initialData, mode, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<ProjectFormData>({
        title: "",
        description: "",
        startDate: null,
        endDate: null,
        companyName: "",
        status: { label: "Pending", value: "Pending" },
        files: [],
        ...initialData, // initial data if provided
    });

    const [errors, setErrors] = useState<ValidationError[]>([]);

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

    const handleDateChange = (date: Date | null, field: keyof ProjectFormData) => {
        setFormData({ ...formData, [field]: date });
    };

    const handleFileUpload = (uploadedFiles: File[]) => {
        setFormData((prev) => ({
            ...prev,
            files: uploadedFiles,
        }));
    };

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
            companyName: "",
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


            <div>
                <InputField
                    label="Company Name"
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full"
                />
                {getError("companyName") && <p className="text-red-500 text-sm mt-1">{getError("companyName")}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <DateField
                        label="Start Date"
                        selected={formData.startDate}
                        onChange={(date) => handleDateChange(date, "startDate")}
                        className="w-full"
                    />
                    {getError("startDate") && <p className="text-red-500 text-sm mt-1">{getError("startDate")}</p>}
                </div>

                <div>
                    <DateField
                        label="End Date"
                        selected={formData.endDate}
                        onChange={(date) => handleDateChange(date, "endDate")}
                        className="w-full"
                    />
                    {getError("endDate") && <p className="text-red-500 text-sm mt-1">{getError("endDate")}</p>}
                </div>
            </div>

            <div>
                <SelectField
                    label="Status"
                    options={[
                        { label: "Pending", value: "Pending" },
                        { label: "In Progress", value: "In Progress" },
                        { label: "Completed", value: "Completed" },
                    ]}
                    value={formData.status}
                    onChange={handleSelectChange}
                    className="w-full"
                />
                {getError("status") && <p className="text-red-500 text-sm mt-1">{getError("status")}</p>}
            </div>

            <div>
                <FileUpload
                    label="Upload Files (PDFs or Excel)"
                    onChange={handleFileUpload}
                    accept="application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="w-full"
                    
                />
                {getError("files") && <p className="text-red-500 text-sm mt-1">{getError("files")}</p>}
            </div>

            <div className="flex justify-center">
                <Button
                    text={mode === "create" ? "Create Project" : "Update Project"}
                    type="submit"
                    isSubmitting={isLoading}
                />
            </div>
        </form>
    );
};

export default CreateOrEditProject;
