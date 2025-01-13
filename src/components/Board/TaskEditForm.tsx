import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Button from "../buttons/Button";
import InputField from "../form/InputField";
import DateField from "../form/DateField";
import SelectField from "../form/SelectField";
import FileUpload from "../form/FileUpload";
import { useUpdateIssueMutation } from "../../redux/features/issueApi";
import { toast } from "react-toastify";

const statusOptions = [
    { label: "To Do", value: "TO DO" },
    { label: "In Progress", value: "IN PROGRESS" },
    { label: "Completed", value: "COMPLETED" },
];

const TaskEditForm: React.FC<{
    initialTask: any;
    onSave: (task: any) => void;
    onCancel: () => void;
    refetch: () => void;
}> = ({ initialTask, onSave, refetch }) => {
    const [updateIssue, {isLoading}] = useUpdateIssueMutation();

    return (
        <Formik
            enableReinitialize
            initialValues={{
                title: initialTask?.title || "",
                description: initialTask?.description || "",
                status: initialTask?.status || "To Do",
                startDate: initialTask?.startDate ? new Date(initialTask.startDate) : null,
                endDate: initialTask?.endDate ? new Date(initialTask.endDate) : null,
                files: initialTask?.files || [],
            }}
            validationSchema={Yup.object({
                title: Yup.string().required("Title is required"),
                description: Yup.string().required("Description is required"),
                status: Yup.string().required("Status is required"),
                startDate: Yup.date().required("Start date is required"),
                endDate: Yup.date()
                    .min(Yup.ref("startDate"), "End date cannot be before start date")
                    .required("End date is required"),
            })}
            onSubmit={async (values) => {
                // Convert form values to FormData
                const formData = new FormData();
                formData.append("title", values.title);
                formData.append("description", values.description);
                formData.append("status", values.status);
                formData.append("startDate", values.startDate?.toISOString() || "");
                formData.append("endDate", values.endDate?.toISOString() || "");

                // Append each file to FormData
                values.files.forEach((file: File) => {
                    formData.append("files", file);
                });
                try {
                    await updateIssue({ issueId: initialTask.id, formData }).unwrap();
                    refetch();
                    toast.success("Issue updated successfully");
                } catch (error: any) {
                    toast.error(error?.data?.error?.message || "Unable to update issue, please try again!");
                    console.error(error?.data?.error?.message);
                }

                onSave(values);
            }}
        >
            {({ setFieldValue, values }) => (
                <Form className="space-y-6">
                    <Field
                        name="title"
                        component={InputField}
                        label="Title"
                        type="text"
                    />
                    <Field
                        name="description"
                        component={InputField}
                        label="Description"
                        type="textarea"
                    />
                    <div className="grid grid-cols-2 gap-6">
                        <SelectField
                            label="Status"
                            options={statusOptions}
                            value={statusOptions.find((option) => option.value === values.status) || null}
                            onChange={(option) => setFieldValue("status", option?.value || "")}
                        />
                        <DateField
                            label="Start Date"
                            selected={values.startDate}
                            onChange={(date) => setFieldValue("startDate", date)}
                        />
                        <DateField
                            label="End Date"
                            selected={values.endDate}
                            onChange={(date) => setFieldValue("endDate", date)}
                        />
                    </div>
                    <FileUpload
                        label="Attachments"
                        onChange={(files) => setFieldValue("files", files)}
                        accept="application/pdf, application/vnd.ms-excel"
                        className="w-full"
                    />
                    <div className="flex justify-end space-x-4 sticky bottom-0 py-4">
                        <Button text="Save Changes" type="submit" fullWidth isSubmitting={isLoading} />
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default TaskEditForm;
