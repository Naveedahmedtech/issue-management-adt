import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Button from "../buttons/Button";
import InputField from "../form/InputField";
import DateField from "../form/DateField";
import SelectField from "../form/SelectField";
import FileUpload from "../form/FileUpload";

const statusOptions = [
    { label: "To Do", value: "To Do" },
    { label: "In Progress", value: "In Progress" },
    { label: "Done", value: "Done" },
];

const TaskEditForm: React.FC<{
    initialTask: any;
    onSave: (task: any) => void;
    onCancel: () => void;
}> = ({ initialTask, onSave }) => {
    return (
        <Formik
            initialValues={{
                title: initialTask.title || "",
                description: initialTask.description || "",
                status: initialTask.status || "To Do",
                startDate: initialTask.startDate ? new Date(initialTask.startDate) : null,
                endDate: initialTask.endDate ? new Date(initialTask.endDate) : null,
                files: initialTask.files || [],
            }}
            validationSchema={Yup.object({
                title: Yup.string().required("Title is required"),
                description: Yup.string().required("Description is required"),
                status: Yup.string().required("Status is required"),
                startDate: Yup.date().required("Start date is required"),
                endDate: Yup.date().min(
                    Yup.ref("startDate"),
                    "End date cannot be before start date"
                ).required("End date is required"),
            })}
            onSubmit={(values) => {
                onSave({
                    ...values,
                    startDate: values.startDate?.toISOString(),
                    endDate: values.endDate?.toISOString(),
                });
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
                            value={statusOptions.find(
                                (option) => option.value === values.status
                            ) || null}
                            onChange={(option) =>
                                setFieldValue("status", option?.value || "")
                            }
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
                    <div className="flex justify-end space-x-4 sticky bottom-0  py-4">
                        <Button
                            text="Save Changes"
                            type="submit"
                            fullWidth
                        />
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default TaskEditForm;
