import React, { useEffect, useState } from "react";
import Button from "../buttons/Button.tsx";
import ModalContainer from "../modal/ModalContainer.tsx";
import { formatDate, renderFileIcon } from "../../utils/TaskUtils.tsx";
import {
  useAssignIssuesMutation,
  useDeleteIssueMutation,
  useRemoveAssignedUserMutation,
  useUpdateIssueMutation
} from "../../redux/features/issueApi.ts";
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
import { format, parseISO } from "date-fns";
import { parseNewValueToList } from "../../utils/index.ts";

const statusOptions = [
  { label: PROJECT_STATUS.ACTIVE, value: PROJECT_STATUS.ACTIVE.toUpperCase() },
  { label: PROJECT_STATUS.ON_GOING, value: PROJECT_STATUS.ON_GOING.toUpperCase() },
  { label: PROJECT_STATUS.COMPLETED, value: PROJECT_STATUS.COMPLETED.toUpperCase() },
];

const STATUS_COLORS: Record<string, string> = {
  "ACTIVE": "bg-todo text-text",
  "ON GOING": "bg-pending text-text",
  "COMPLETED": "bg-success text-text",
  Default: "bg-todo text-text",
};

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
}> = ({ task, onEdit, onDelete, component, refetch, isArchived, projectId, refetchFiles }) => {
  const [localTask, setLocalTask] = useState<ITask>(task);


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState<{ value: string; label: string }[]>([]);

  // API hooks
  const [triggerGetUsers, { isFetching }] = useLazyGetAllUsersQuery();
  const [assignIssues] = useAssignIssuesMutation();
  const [removeAssignedUser] = useRemoveAssignedUserMutation();
  useEffect(() => {
    setLocalTask(task);
  }, [task]);
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

  console.log('latestActivity', latestActivity)

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

    try {
      await updateIssue({ issueId: task.id, formData }).unwrap();
      setLocalTask((prev) => ({ ...prev, status: newStatus }));
      refetch();
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-textDark">
      {/* Task Details */}
      <div className="md:col-span-2 space-y-8">
          <div className="flex justify-end gap-3">
            {!isArchived && <Button text="Edit" onClick={onEdit} fullWidth={false}  />}
            {/* {role !== ROLES.WORKER && !isArchived && (
              <Button
                text="Delete"
                onClick={() => setIsDeleteModalOpen(true)}
                preview="danger"
                fullWidth={false}
              />
            )} */}
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-base font-semibold mb-1">Title</h4>
            <h4
              className="
    font-semibold text-base sm:text-lg
    break-words break-all
    whitespace-normal
    max-w-full
  "
              title={task.title}
            >
              {task.title}
            </h4>

          </div>
          <div>
            <h4 className="text-base font-semibold mb-1">Description</h4>
            <p
              className="
    text-sm mb-3
    break-words break-all
    whitespace-normal
    max-w-full
  "
            >
              {task.description || "No description available."}
            </p>


          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Assign Users</label>
            <PaginatedDropdown
              fetchData={fetchUsers}
              renderItem={(item) => <span>{item.label}</span>}
              onSelect={handleUserSelect}
              placeholder={isFetching ? "Loading..." : "Select a user"}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Assigned To</label>
            {selectedUsers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.value}
                    className="flex items-center px-3 py-1 rounded-full text-sm border cursor-pointer hover:bg-hover"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveUser(user.value);
                    }}
                  >
                    {user.label}
                    <FiX className="ml-2 text-red-500 hover:text-red-700" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted italic">No users assigned</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-base font-semibold mb-1">Status</h4>
            <span className={`rounded-full text-xs font-semibold ${STATUS_COLORS[localTask.status.toUpperCase()] || STATUS_COLORS.Default} px-5 py-2`}>{localTask.status}</span>
            <div className="flex gap-2 mt-3">
              {isMovingStatus ? (
                <span className="italic text-sm">Updating status...</span>
              ) : (
                <>
                  <button
                    onClick={() => updateStatus(getPreviousStatus(localTask.status), false)}
                    className="text-sm underline disabled:opacity-50"
                    disabled={isMovingStatus}
                  >
                    Previous Status
                  </button>
                  <button
                    onClick={() => updateStatus(getNextStatus(localTask.status), true)}
                    className="text-sm underline disabled:opacity-50"
                    disabled={isMovingStatus}
                  >
                    Next Status
                  </button>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-1">Created</h4>
            <p className="text-sm">{task?.createdAt ? formatDate(task.createdAt) : "—"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-base font-semibold mb-1">Attachments</h4>
            <ul className="space-y-2">
              {task.files.length === 0 && "No attachments"}
              {task.files?.map((file, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="pt-1 flex-shrink-0">
                    {renderFileIcon(file.type)}
                  </div>
                  <a
                    className="
      hover:underline
      break-words break-all
      whitespace-normal
      max-w-full inline-block
      text-sm text-textDark
    "
                    href={`${BASE_URL}/${file.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={file.name}
                  >
                    {file.name}
                  </a>
                </li>

              ))}
            </ul>
          </div>
          {filteroutWhoCreatedIssue && (
            <div>
              <h4 className="text-base font-semibold mb-1">Created By</h4>
              <p className="text-sm">{filteroutWhoCreatedIssue?.user?.displayName}</p>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-base font-semibold mb-1">Project</h4>
          <p
            className="
    text-sm
    break-words break-all
    whitespace-normal
    sm:line-clamp-1 sm:overflow-hidden
    max-w-full
  "
            title={task?.project?.title}
          >
            {task?.project?.title || "Untitled Project"}
          </p>

        </div>

        {/* <div className="flex justify-end gap-3 pt-4">
          {!isArchived && <Button text="Edit" onClick={onEdit} fullWidth={false} />}
          {role !== ROLES.WORKER && !isArchived && (
            <Button
              text="Delete"
              onClick={() => setIsDeleteModalOpen(true)}
              preview="danger"
              fullWidth={false}
            />
          )}
        </div> */}

        {isDeleteModalOpen && (
          <ModalContainer
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title={`Delete ${component === "order" ? "Order" : "Issue"} Confirmation`}
          >
            <p className="text-sm">
              Are you sure you want to delete this {component === "order" ? "Order" : "Issue"}? This action cannot be undone.
            </p>
            <div className="flex justify-end mt-4 space-x-4">
              <Button
                text="Delete"
                onClick={handleDelete}
                preview="danger"
                isSubmitting={isDeleting}
              />
            </div>
          </ModalContainer>
        )}
      </div>

      {/* Activity Feed */}
      <div className="space-y-4 md:col-span-1">
        <h4 className="text-base font-semibold mb-1">Latest Activity</h4>
        {isActivityLoading ? (
          <p className="text-sm">Loading activity...</p>
        ) : latestActivity?.data?.history?.length > 0 ? (
          <div className="space-y-2 max-h-max overflow-auto">
            {latestActivity.data.history.filter((log: any) => {
              // Always allow "Issue Created"
              if (log.fieldName === "Issue Created") return true;
              const noChange = log.oldValue == null && log.newValue == null;
              return !noChange;
            }).map((log: any) => {
              const isDateField = log.fieldName === "startDate" || log.fieldName === "endDate";

              const formattedOldValue = isDateField && log.oldValue
                ? format(parseISO(log.oldValue), "PPP")
                : log.oldValue || "N/A";
              const formattedNewValue = isDateField && log.newValue
                ? format(parseISO(log.newValue), "PPP")
                : log.newValue || "N/A";

              return (
                <div
                  key={log.id}
                  className="p-4 bg-backgroundShade2 text-textDark rounded-md border border-border"
                >
                  <p className="text-sm">
                    <strong className="">{log.user.displayName}</strong>{" "}
                    {
                      log?.fieldName !== "Issue Created" ? (
                        <>
                          <span className="text-textSecondary">updated</span> {' '}
                          <strong className="text-todo">{log.fieldName}</strong>
                        </>
                      ) : (
                        <strong className="text-todo">created this issue</strong>
                      )
                    }
                  </p>
                  {
                    log?.fieldName === "Issue Created" ? (
                      <>
                        <ul className="list-disc ml-6 text-sm">
                          {parseNewValueToList(log.newValue).map(({ key, value }, index) => (
                            <li key={index}>
                              <strong>{key}:</strong> {value === null || value === undefined || value === '' ? 'N/A' : value}
                            </li>
                          ))}
                        </ul>

                        <p className="text-xs">
                          {format(new Date(log.createdAt), "PPPpp")}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm">
                          From:{" "}
                          <span className="italic text-pending">{formattedOldValue}</span>{" "}
                          To: <span className="italic text-success">{formattedNewValue}</span>
                        </p>
                        <p className="text-xs">
                          {format(new Date(log.createdAt), "PPPpp")}
                        </p>
                      </>
                    )
                  }
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm">No recent activity.</p>
        )}
      </div>
    </div>

  );
};

export default TaskDetailsView;
