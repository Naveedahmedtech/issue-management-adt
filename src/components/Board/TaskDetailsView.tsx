import React, { useState } from "react";
import Button from "../buttons/Button.tsx";
import ModalContainer from "../modal/ModalContainer.tsx";
import { renderFileIcon, formatDate } from "../../utils/TaskUtils.tsx";
import { useDeleteIssueMutation, useUpdateIssueMutation } from "../../redux/features/issueApi.ts";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth.ts";
import { ROLES } from "../../constant/ROLES.ts";
import { BASE_URL } from "../../constant/BASE_URL.ts";
import { ITask } from "../../types/types.ts";
import { useGetProjectActiveLogsQuery, useUpdateIssueLogHistoryMutation } from "../../redux/features/projectsApi.ts";

const statusOptions = [
  { label: "To Do", value: "TO DO" },
  { label: "In Progress", value: "IN PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
];

const getNextStatus = (currentStatus: any) => {
  const currentIndex = statusOptions.findIndex((status) => status.value === currentStatus);
  return statusOptions[currentIndex + 1]?.value || currentStatus;
};

const getPreviousStatus = (currentStatus: any) => {
  const currentIndex = statusOptions.findIndex((status) => status.value === currentStatus);
  return statusOptions[currentIndex - 1]?.value || currentStatus;
};

const TaskDetailsView: React.FC<{
  task: ITask;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  refetch: () => void;
  component?: string;
  isArchived: boolean;
  projectId: string;
  setActiveTab: (tab: string) => void;
  setIssueId: (id: string) => void;
  refetchFiles: () => void;
}> = ({ task, onEdit, onDelete, component, refetch, isArchived, projectId, setActiveTab, setIssueId, refetchFiles, onClose }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { data: latestActivity, isLoading: isActivityLoading } = useGetProjectActiveLogsQuery({
    projectId,
    page: 1,
    limit: 5,
    issueId: task?.id ? task?.id : undefined,
  });

  const { userData } = useAuth();
  const {
    userData: { role },
  } = userData;

  const [deleteIssue, { isLoading: isDeleting }] = useDeleteIssueMutation();
  const [updateIssue, { isLoading: isMovingStatus }] = useUpdateIssueMutation();
  const [updateIssueLogHistory] = useUpdateIssueLogHistoryMutation();


  const handleDelete = async () => {
    try {
      await deleteIssue(task.id).unwrap();
      onDelete();
      setIsDeleteModalOpen(false);
      refetch();
      refetchFiles();
      toast.success("Issue deleted successfully!");
    } catch (err) {
      console.error("Failed to delete issue:", err);
      toast.error("Unable to delete issue, please try again!");
    }
  };

  const updateStatus = async (newStatus: string, prev: boolean) => {
    if (task.status?.toLowerCase() === "to do" && !prev) return;
    if (task.status?.toLowerCase() === "completed" && prev) return;
    const formData = new FormData();
    formData.append("title", task.title);
    formData.append("description", task.description);
    formData.append("status", newStatus);
    formData.append("startDate", task.startDate || "");
    formData.append("endDate", task.endDate || "");
    const logBody = [
      {
        fieldName: "status",
        oldValue: task.status,
        newValue: newStatus,
      }
    ]

    try {
      await updateIssue({ issueId: task.id, formData }).unwrap();
      refetch();
      refetchFiles();
      onClose();
      toast.success(`Status updated to "${newStatus}"`);
    } catch (error: any) {
      toast.error(
        error?.data?.error?.message || "Unable to update status, please try again!"
      );
    }
    try {
      await updateIssueLogHistory({ issueId: task.id, body: logBody }).unwrap();
    } catch (error) {
      console.error("Failed to update issue log history", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Main Task Details */}
      <div className="col-span-2 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-lg font-bold text-primary mb-2">Title</h4>
            <p className="text-text">{task.title}</p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-primary mb-2">Description</h4>
            <p className="text-text">{task.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-lg font-bold text-primary mb-2">Status</h4>
            <span className="px-4 py-2 bg-primary text-text rounded">
              {task.status}
            </span>
            <div className="flex items-center gap-2">
              {
                isMovingStatus ? "moving..." : (
                  <>
                    <button
                      onClick={() => updateStatus(getPreviousStatus(task.status), false)}
                      className="py-2 text-text underline"
                    >
                      Move to Previous
                    </button>
                    <button
                      onClick={() => updateStatus(getNextStatus(task.status), true)}
                      className="py-2 text-text underline"
                    >
                      Move to Next
                    </button>
                  </>
                )
              }
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-primary mb-2">Dates</h4>
            <p>
              <strong>Start:</strong> {formatDate(task.startDate)}
            </p>
            <p>
              <strong>End:</strong> {formatDate(task.endDate)}
            </p>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-bold text-primary mb-2">Attachments</h4>
          <ul className="space-y-2">
            {task.files?.map((file: { name: string; type: string; url: string }, index: number) => (
              <li key={index} className="flex items-center space-x-2">
                {renderFileIcon(file.type)}
                <a
                  className="text-text hover:underline"
                  href={`${BASE_URL}/${file?.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          {!isArchived && (
            <Button
              text="Edit"
              onClick={onEdit}
              fullWidth={false}
              className="bg-primary text-white"
            />
          )}
          {role !== ROLES.WORKER && !isArchived && (
            <Button
              text="Delete"
              onClick={() => setIsDeleteModalOpen(true)}
              fullWidth={false}
              preview={"danger"}
            />
          )}
        </div>

        {isDeleteModalOpen && (
          <ModalContainer
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title={`Delete ${component === "order" ? "Order" : "Issue"} Confirmation`}
          >
            <p className="text-text">
              Are you sure you want to delete this {component === "order" ? "Order" : "Issue"}? This
              action cannot be undone.
            </p>
            <div className="flex justify-end mt-6 space-x-4">
              <Button
                text={"Delete"}
                onClick={handleDelete}
                fullWidth={false}
                preview={"danger"}
                isSubmitting={isDeleting}
              />
            </div>
          </ModalContainer>
        )}
      </div>

      {/* Compact Latest Activity */}
      <div className="col-span-1">
        <h4 className="text-lg font-bold text-primary mb-4">Latest Activity</h4>
        {isActivityLoading ? (
          <p className="text-text">Loading latest activity...</p>
        ) : latestActivity?.data?.history?.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-auto">
            {latestActivity.data.history.map((activity: any) => (
              <div key={activity.id} className="bg-backgroundShade1 p-2 rounded-md">
                <p className="text-xs text-text font-semibold truncate">
                  {activity.user.displayName}
                </p>
                <p className="text-xs text-text truncate">
                  {activity.fieldName === "Issue Created"
                    ? "Created this issue"
                    : `Updated ${activity.fieldName}`}
                </p>
                {activity.fieldName !== "Issue Created" && (
                  <p className="text-xs text-text truncate">
                    From: {activity.oldValue || "N/A"} → To: {activity.newValue || "N/A"}
                  </p>
                )}
                <p className="text-xs text-textHover truncate">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text">No recent activity.</p>
        )}
        <div className="mt-4">
          <span className="underline cursor-pointer" onClick={() => {
            setActiveTab('activity');
            setIssueId(task.id);
          }}>See all</span>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsView;
