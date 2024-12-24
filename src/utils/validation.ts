export interface ValidationError {
    field: string;
    message: string;
}

export const validateProjectForm = (formData: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!formData.name.trim()) {
        errors.push({ field: "name", message: "Project Name is required." });
    }

    if (!formData.description.trim()) {
        errors.push({ field: "description", message: "Description is required." });
    }

    if (!formData.startDate) {
        errors.push({ field: "startDate", message: "Start Date is required." });
    }

    if (!formData.endDate) {
        errors.push({ field: "endDate", message: "End Date is required." });
    }

    if (!formData.status) {
        errors.push({ field: "status", message: "Status is required." });
    }

    if (formData.files.length === 0) {
        errors.push({ field: "files", message: "At least one file must be uploaded." });
    }

    return errors;
};
