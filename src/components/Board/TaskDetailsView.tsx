import React, { useEffect, useState } from "react";
import Button from "../buttons/Button.tsx";
import ModalContainer from "../modal/ModalContainer.tsx";
import { formatDate, renderFileIcon } from "../../utils/TaskUtils.tsx";
import { useAssignIssuesMutation, useDeleteIssueMutation, useRemoveAssignedUserMutation, useUpdateIssueMutation } from "../../redux/features/issueApi.ts";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth.ts";
import { ROLES } from "../../constant/ROLES.ts";
import { BASE_URL } from "../../constant/BASE_URL.ts";
import { ITask } from "../../types/types.ts";
import { useGetProjectActiveLogsQuery, useUpdateIssueLogHistoryMutation } from "../../redux/features/projectsApi.ts";
import { PROJECT_STATUS } from "../../constant/index.ts";
import { useLazyGetAllUsersQuery } from "../../redux/features/authApi.ts";
import PaginatedDropdown from "../dropdown/PaginatedDropdown.tsx";
import { FiX } from "react-icons/fi";

const statusOptions = [
  { label: PROJECT_STATUS.ACTIVE, value: PROJECT_STATUS.ACTIVE.toUpperCase() },
  { label: PROJECT_STATUS.ON_GOING, value: PROJECT_STATUS.ON_GOING.toUpperCase() },
  { label: PROJECT_STATUS.COMPLETED, value: PROJECT_STATUS.COMPLETED.toUpperCase() },
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
}> = ({ task, onEdit, onDelete, component, refetch, isArchived, projectId, refetchFiles, onClose }) => {
  console.log("task:", task);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState<{ value: string; label: string }[]>([]);

  // API hooks
  const [triggerGetUsers, { isFetching }] = useLazyGetAllUsersQuery();
  const [assignIssues] = useAssignIssuesMutation();
  const [removeAssignedUser] = useRemoveAssignedUserMutation();

  useEffect(() => {
    if (task.assignedUsers?.length > 0) {
      setSelectedUsers(
        task.assignedUsers.map((assignedUser) => ({
          value: assignedUser.user.id,
          label: assignedUser.user.displayName,
        }))
      );
    }
  }, [task.assignedUsers]);

  // Fetch users dynamically when the dropdown opens or paginates
  const fetchUsers = async (page: number) => {
    try {
      const response = await triggerGetUsers({ page, limit: 10, roleName: ROLES.WORKER }).unwrap();
      return {
        data: response?.data?.users.map((user: any) => ({
          value: user.id,
          label: user.displayName || user.name || user.email,
        })),
        hasMore: (response?.data?.pagination?.page * response?.data?.pagination?.limit) < response?.data?.pagination?.total,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { data: [], hasMore: false };
    }
  };

  // Handle user selection (multiple users)
  const handleUserSelect = async (selected: { value: string; label: string }) => {
    if (selectedUsers.some((user) => user.value === selected.value)) {
      console.log("User is already assigned.");
      return;
    }

    const updatedUsers = [...selectedUsers, selected];
    setSelectedUsers(updatedUsers);

    try {
      await assignIssues({ issueId: task.id, body: { userIds: updatedUsers.map((user) => user.value) } }).unwrap();
      console.log("Users assigned successfully:", updatedUsers);
      refetch();
    } catch (error) {
      console.error("Error assigning user:", error);
    }
  };

  // Handle user removal
  const handleRemoveUser = async (userId: string) => {
    setSelectedUsers((prevUsers) => prevUsers.filter((user) => user.value !== userId));

    try {
      await removeAssignedUser({ issueId: task.id, userId }).unwrap();
      console.log("User removed successfully:", userId);
      refetch();
    } catch (error) {
      console.error("Error removing assigned user:", error);
      refetch();
    }
  };


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
      if (refetchFiles) {
        refetchFiles();
      }
      toast.success("Issue deleted successfully!");
    } catch (err) {
      console.error("Failed to delete issue:", err);
      toast.error("Unable to delete issue, please try again!");
    }
  };

  const updateStatus = async (newStatus: string, prev: boolean) => {
    if (task.status?.toUpperCase() === PROJECT_STATUS.ACTIVE.toUpperCase() && !prev) return;
    if (task.status?.toUpperCase() === PROJECT_STATUS.COMPLETED.toUpperCase() && prev) return;
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

    console.log("Formdata", formData.get("status"));
    console.log("logbody", logBody)

    try {
      await updateIssue({ issueId: task.id, formData }).unwrap();
      refetch();
      if (refetchFiles) {
        refetchFiles();
      }
      onClose();
      toast.success(`Status updated to "${newStatus}"`);
    } catch (error: any) {
      console.log("error", error)
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

  const filteroutWhoCreatedIssue = latestActivity?.data?.history?.find((activity: any) => activity?.fieldName === "Issue Created");


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
            <div className="flex items-center mt-2">
              {isMovingStatus ? (
                <span className="text-gray-500 italic">Moving...</span>
              ) : (
                <>
                  <button
                    onClick={() => updateStatus(getPreviousStatus(task.status), false)}
                    className="py-2 text-sm font-medium text-gray-700 underline rounded-md transition hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isMovingStatus}
                    aria-label="Move task to the previous status"
                  >
                    Move Back
                  </button>

                  <button
                    onClick={() => updateStatus(getNextStatus(task.status), true)}
                    className="p-2 text-sm font-medium text-gray-700 underline rounded-md transition hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isMovingStatus}
                    aria-label="Move task to the next status"
                  >
                    Move Forward
                  </button>
                </>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-primary mb-2">Created At</h4>
            <p>
              {task?.createdAt ? formatDate(task?.createdAt) : "--"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
          {
            filteroutWhoCreatedIssue && (
              <div>
                <h4 className="text-lg font-bold text-primary mb-2">Created By</h4>
                <p>{filteroutWhoCreatedIssue?.user?.displayName}</p>
              </div>
            )
          }
        </div>
        <div>
            <h4 className="text-lg font-bold text-primary mb-2">Project Name</h4>
            <p>
              {task?.project?.title}
            </p>
          </div>
        <div className="grid grid-cols-2 gap-4">
          {/* User Assignment Dropdown */}
          <div className="mb-4">
            <label className="text-lg font-bold text-primary mb-2">Assign Issue to users:</label>
            <PaginatedDropdown
              fetchData={fetchUsers}
              renderItem={(item) => <span>{item.label}</span>}
              onSelect={handleUserSelect}
              placeholder={isFetching ? "Loading users..." : "Select a user"}
            />
          </div>

          {/* Assigned Users Section */}
          {selectedUsers.length > 0 && (
            <div>
              <p className="text-sm font-medium text-text mb-2">Assigned Users:</p>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.value}
                    className="flex items-center  px-3 py-1 rounded-full text-sm text-text border border-text transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveUser(user.value);
                    }}
                  >
                    {user.label}
                    <FiX
                      className="ml-2 text-red-500 cursor-pointer hover:text-red-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
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
        {/*<div className="mt-4">*/}
        {/*  <span className="underline cursor-pointer" onClick={() => {*/}
        {/*    if(setActiveTab && setIssueId) {*/}
        {/*    setActiveTab('activity');*/}
        {/*    setIssueId(task.id);*/}
        {/*    }*/}

        {/*  }}>See all</span>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default TaskDetailsView;
