import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../buttons/Button";
import InputField from "../form/InputField";
import DateField from "../form/DateField";
import SelectField from "../form/SelectField";
import FileUpload from "../form/FileUpload";
import { useUpdateIssueMutation } from "../../redux/features/issueApi";
import { toast } from "react-toastify";
import { useUpdateIssueLogHistoryMutation } from "../../redux/features/projectsApi";

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
    refetchFiles: () => void;
}> = ({ initialTask, onSave, refetch, refetchFiles }) => {
    const [updateIssue, { isLoading }] = useUpdateIssueMutation();
    const [updateIssueLogHistory] = useUpdateIssueLogHistoryMutation();

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
            })}
            onSubmit={async (values) => {
                // Prepare logBody to track changes
                const logBody = [];
                if (values.title !== initialTask.title) {
                    logBody.push({
                        fieldName: "title",
                        oldValue: initialTask.title || null,
                        newValue: values.title,
                    });
                }
                if (values.description !== initialTask.description) {
                    logBody.push({
                        fieldName: "description",
                        oldValue: initialTask.description || null,
                        newValue: values.description,
                    });
                }
                if (values.status !== initialTask.status) {
                    logBody.push({
                        fieldName: "status",
                        oldValue: initialTask.status || null,
                        newValue: values.status,
                    });
                }
                if (
                    values.startDate?.toISOString() !==
                    initialTask.startDate
                ) {
                    logBody.push({
                        fieldName: "startDate",
                        oldValue: initialTask.startDate || null,
                        newValue: values.startDate?.toISOString() || null,
                    });
                }
                if (
                    values.endDate?.toISOString() !==
                    initialTask.endDate
                ) {
                    logBody.push({
                        fieldName: "endDate",
                        oldValue: initialTask.endDate || null,
                        newValue: values.endDate?.toISOString() || null,
                    });
                }

                const formData = new FormData();
                formData.append("title", values.title);
                formData.append("description", values.description);
                formData.append("status", values.status);
                formData.append("startDate", values.startDate?.toISOString() || "");
                formData.append("endDate", values.endDate?.toISOString() || "");

                values.files.forEach((file: File) => {
                    formData.append("files", file);
                });

                try {
                    // Update the issue
                    await updateIssue({ issueId: initialTask.id, formData }).unwrap();
                    refetch();
                    refetchFiles();
                    toast.success("Issue updated successfully");

                    // Log history if there are changes
                    if (logBody.length > 0) {
                        await updateIssueLogHistory({ issueId: initialTask.id, body: logBody }).unwrap();
                    }
                } catch (error: any) {
                    toast.error(error?.data?.error?.message || "Unable to update issue, please try again!");
                    console.error("Error updating issue or log history:", error);
                }

                onSave(values);
            }}
        >
            {({ setFieldValue, values }) => (
                <Form className="space-y-6 px-5">
                    <InputField
                        label="Title"
                        name="title"
                        type="text"
                        value={values.title}
                        onChange={(e) => setFieldValue("title", e.target.value)}
                    />
                    <InputField
                        label="Description"
                        name="description"
                        type="textarea"
                        value={values.description}
                        onChange={(e) => setFieldValue("description", e.target.value)}
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
                        accept="application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        className="w-full"
                    />
                    <div className="flex justify-end space-x-4 sticky bottom-0 py-4">
                        <Button text="Save Changes" type="submit" fullWidth={false} isSubmitting={isLoading} />
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default TaskEditForm;
