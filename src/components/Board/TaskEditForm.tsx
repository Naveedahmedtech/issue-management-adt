import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../buttons/Button";
import InputField from "../form/InputField";
import SelectField from "../form/SelectField";
import FileUpload from "../form/FileUpload";
import { useUpdateIssueMutation } from "../../redux/features/issueApi";
import { toast } from "react-toastify";
import { useUpdateIssueLogHistoryMutation } from "../../redux/features/projectsApi";
import { PROJECT_STATUS } from "../../constant";
import { ErrorMessage } from "formik";

// Keep the UI simple and consistent across devices.
// - Stacked fields with tight spacing
// - Sticky action bar that stays visible inside scrollable modals
// - Extra bottom padding so fields never hide behind the footer
// - Hard length clamps on change to avoid 504/500 type counters

const statusOptions = [
  { label: PROJECT_STATUS.ACTIVE, value: PROJECT_STATUS.ACTIVE.toUpperCase() },
  { label: PROJECT_STATUS.ON_GOING, value: PROJECT_STATUS.ON_GOING.toUpperCase() },
  { label: PROJECT_STATUS.COMPLETED, value: PROJECT_STATUS.COMPLETED.toUpperCase() },
];

const TaskEditForm: React.FC<{
  initialTask: any;
  onSave: (task: any) => void;
  onCancel?: () => void;
  refetch: () => void;
  refetchFiles: () => void;
}> = ({ initialTask, onSave, onCancel, refetch, refetchFiles }) => {
  const [updateIssue, { isLoading }] = useUpdateIssueMutation();
  const [updateIssueLogHistory] = useUpdateIssueLogHistoryMutation();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        title: initialTask?.title || "",
        description: initialTask?.description || "",
        status: initialTask?.status || PROJECT_STATUS.ACTIVE.toUpperCase(),
        startDate: initialTask?.startDate ? new Date(initialTask.startDate) : null,
        endDate: initialTask?.endDate ? new Date(initialTask.endDate) : null,
        files: initialTask?.files || [],
      }}
      validationSchema={Yup.object({
        title: Yup.string().trim().max(100, "Max 100 characters").required("Title is required"),
        description: Yup.string().max(500, "Max 500 characters"),
        status: Yup.string().required("Status is required"),
      })}
      onSubmit={async (values) => {
        const logBody: any[] = [];
        const norm = (v: any) => (v === undefined ? null : v);

        if ((values.title || "") !== (initialTask.title || "")) {
          logBody.push({ fieldName: "title", oldValue: norm(initialTask.title), newValue: values.title });
        }
        if ((values.description || "") !== (initialTask.description || "")) {
          logBody.push({ fieldName: "description", oldValue: norm(initialTask.description), newValue: values.description });
        }
        if ((values.status || "") !== (initialTask.status || "")) {
          logBody.push({ fieldName: "status", oldValue: norm(initialTask.status), newValue: values.status });
        }
        if (values.startDate?.toISOString() !== initialTask.startDate) {
          logBody.push({ fieldName: "startDate", oldValue: norm(initialTask.startDate), newValue: values.startDate?.toISOString() || null });
        }
        if (values.endDate?.toISOString() !== initialTask.endDate) {
          logBody.push({ fieldName: "endDate", oldValue: norm(initialTask.endDate), newValue: values.endDate?.toISOString() || null });
        }

        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description || "");
        formData.append("status", values.status);
        formData.append("startDate", values.startDate?.toISOString() || "");
        formData.append("endDate", values.endDate?.toISOString() || "");
        values.files.forEach((file: File) => formData.append("files", file));

        try {
          await updateIssue({ issueId: initialTask.id, formData }).unwrap();
          refetch();
          if (refetchFiles) refetchFiles();
          toast.success("Issue updated successfully");
        } catch (error: any) {
          toast.error(error?.data?.error?.message || "Unable to update issue, please try again!");
          console.error("Error updating issue or log history:", error);
        }

        try {
          if (logBody.length > 0) {
            await updateIssueLogHistory({ issueId: initialTask.id, body: logBody }).unwrap();
          }
        } catch (e) {
          console.error("Error updating issue or log history:", e);
        }

        onSave(values);
      }}
    >
      {({ setFieldValue, values }) => (
        // Max width keeps it tidy on desktop; full width on mobile.
        <Form className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-2 space-y-5 pb-24">
          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
            <InputField
              label=""
              name="title"
              type="text"
              value={values.title}
              onChange={(e) => setFieldValue("title", (e.target.value || "").slice(0, 100))}
              inputClassName="text-slate-800"
              maxLength={100}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
            <InputField
              label=""
              name="description"
              type="textarea"
              value={values.description}
              onChange={(e) => setFieldValue("description", (e.target.value || "").slice(0, 500))}
              inputClassName="text-slate-800 min-h-36 resize-y"
              maxLength={500}
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <SelectField
              label=""
              options={statusOptions}
              value={statusOptions.find((o) => o.value === values.status) || null}
              onChange={(option) => setFieldValue("status", option?.value || "")}
            />
            <ErrorMessage name="status" component="div" className="text-red-500 text-xs" />
          </div>

          {/* Attachments */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Attachments</label>
            <FileUpload
              label="Choose files"
              onChange={(files) => setFieldValue("files", files)}
              accept="application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="w-full"
              labelColor="text-slate-600"
            />
          </div>

          {/* Sticky actions inside the scroll area (works on mobile + desktop) */}
          <div
            className="sticky bottom-0 z-10 -mx-4 sm:-mx-6 border-t border-slate-200 bg-white/95 backdrop-blur px-4 sm:px-6 pt-2 pb-3"
            style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
          >
            <div className="flex items-center justify-end gap-3">
              {onCancel && (
                <Button text="Cancel" type="button" onClick={onCancel} fullWidth={false} />
              )}
              <Button text="Save Changes" type="submit" fullWidth={false} isSubmitting={isLoading} />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TaskEditForm;
