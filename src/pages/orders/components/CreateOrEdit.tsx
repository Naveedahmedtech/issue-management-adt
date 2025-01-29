import React, { useState, useEffect } from "react";
import InputField from "../../../components/form/InputField.tsx";
import SelectField from "../../../components/form/SelectField.tsx";
import FileUpload from "../../../components/form/FileUpload.tsx";
import Button from "../../../components/buttons/Button.tsx";
import { validateOrderForm, ValidationError } from "../../../utils/validation.ts";
import { CreateOrEditOrderProps, OrderFormData } from "../../../types/types.ts";
import DateField from "../../../components/form/DateField.tsx";

const CreateOrEdit: React.FC<CreateOrEditOrderProps> = ({ initialData, mode, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<OrderFormData>({
        name: "",
        description: "",
        location: "",
        price: undefined,
        companyName: "",
        status: { label: "Pending", value: "Pending" },
        startDate: null,
        endDate: null,
        files: [],
        ...initialData,
    });

    const [errors, setErrors] = useState<ValidationError[]>([]);

    useEffect(() => {
        if (initialData) {
            setFormData({ ...formData, ...initialData }); // Merge initialData to ensure proper prefill
        }
    }, [initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        // Handle price as a number
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) || 0 : value,
        }));
    };

    const handleFileUpload = (uploadedFiles: File[]) => {
        setFormData((prev) => ({
            ...prev,
            files: uploadedFiles,
        }));
    };

    const handleSelectChange = (option: { label: string; value: string } | null) => {
        setFormData((prev) => ({ ...prev, status: option ?? { label: "", value: "" } }));
    };

    const handleDateChange = (date: Date | null, field: keyof OrderFormData) => {
        setFormData({ ...formData, [field]: date });
    };

    const resetFormData = () => {
        setFormData({
            name: "",
            description: "",
            location: "",
            price: undefined,
            status: { label: "Pending", value: "Pending" },
            startDate: null,
            endDate: null,
            files: [],
            companyName: '',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form data
        const validationErrors = validateOrderForm(formData);

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
                {mode === "create" ? "Create New Order" : "Edit Order"}
            </h2>

            <div>
                <InputField
                    label="Order Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full"
                />
                {getError("name") && <p className="text-red-500 text-sm mt-1">{getError("name")}</p>}
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

            <div>
                <InputField
                    label="Location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full"
                />
                {getError("location") && <p className="text-red-500 text-sm mt-1">{getError("location")}</p>}
            </div>

            <div>
                <InputField
                    label="Price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full"
                />
                {getError("price") && <p className="text-red-500 text-sm mt-1">{getError("price")}</p>}
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
                    text={mode === "create" ? "Create Order" : "Update Order"}
                    type="submit"
                    isSubmitting={isLoading}
                />
            </div>
        </form>
    );
};

export default CreateOrEdit;
