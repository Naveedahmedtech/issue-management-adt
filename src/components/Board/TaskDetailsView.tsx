import React, { useEffect, useMemo, useState } from "react";
import Button from "../buttons/Button.tsx";
import ModalContainer from "../modal/ModalContainer.tsx";
import { formatDate, renderFileIcon } from "../../utils/TaskUtils.tsx";
import {
  useAssignIssuesMutation,
  useDeleteIssueMutation,
  useRemoveAssignedUserMutation,
  useUpdateIssueMutation,
} from "../../redux/features/issueApi.ts";
import { toast } from "react-toastify";
import { ROLES } from "../../constant/ROLES.ts";
import { BASE_URL } from "../../constant/BASE_URL.ts";
import { ITask } from "../../types/types.ts";
import {
  useGetProjectActiveLogsQuery,
  useUpdateIssueLogHistoryMutation,
} from "../../redux/features/projectsApi.ts";
import { PROJECT_STATUS } from "../../constant/index.ts";
import { useLazyGetAllUsersQuery } from "../../redux/features/authApi.ts";
import PaginatedDropdown from "../dropdown/PaginatedDropdown.tsx";
import { FiX } from "react-icons/fi";
import { format, parseISO } from "date-fns";
import { parseNewValueToList } from "../../utils/index.ts";
import StatusDropdown from "./StatusDropdown.tsx";

/**
 * Fixes:
 * - Body scroll lock when modal open (prevents background scroll).
 * - overscroll-behavior containment on scroll areas (no scroll chaining).
 * - Removed negative z-index that caused layering issues.
 * - Stable scrollbars to avoid layout shift when modal opens.
 */

// -----------------------------
// Local UI constants
// -----------------------------
const PANEL =
  "group rounded-2xl border border-border/60 bg-gradient-to-b from-background/80 to-backgroundShade2/50 backdrop-blur-md p-5 shadow-sm hover:shadow-lg transition-all duration-200 ring-1 ring-transparent hover:ring-hover/40";

const SUBTLE = "text-xs text-textSecondary";

// -----------------------------
// Helpers
// -----------------------------
const lockBodyScroll = (lock: boolean) => {
  const body = document.body;
  if (!body) return;

  // Compute scrollbar width to avoid layout shift
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  if (lock) {
    body.dataset.scrollLock = "1";
    body.style.overflow = "hidden";
    body.style.touchAction = "none";
    if (scrollBarWidth > 0) {
      body.style.paddingRight = `${scrollBarWidth}px`;
    }
  } else {
    if (body.dataset.scrollLock) {
      delete body.dataset.scrollLock;
    }
    body.style.overflow = "";
    body.style.touchAction = "";
    body.style.paddingRight = "";
  }
};

// -----------------------------
// Inline components
// -----------------------------

// AvatarChip
const AvatarChip: React.FC<{ label: string; onRemove?: () => void }> = ({ label, onRemove }) => {
  const initials = useMemo(() => {
    const parts = label.split("").length ? label.split(" ").filter(Boolean) : [];
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : (parts[0]?.slice(0, 2) || "U").toUpperCase();
  }, [label]);
  return (
    <span className="inline-flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-border bg-backgroundShade2 text-xs">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-hover text-text font-semibold">
        {initials}
      </span>
      <span className="max-w-[12rem] truncate" title={label}>
        {label}
      </span>
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${label}`}
          className="ml-1 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <FiX />
        </button>
      )}
    </span>
  );
};

// MetaField (card wrapper)
const MetaField: React.FC<{ title: string; className?: string; children?: React.ReactNode }> = ({
  title,
  className = "",
  children,
}) => (
  <div className={`${PANEL} ${className}`}
    style={{ zIndex: "-1" }}
  
  >
    <h4 className="text-sm font-semibold mb-1">{title}</h4>
    <div className="text-sm">{children}</div>
  </div>
);

// ActivityTimeline
const ActivityTimeline: React.FC<{ isLoading: boolean; history?: any[] }> = ({ isLoading, history }) => {
  if (isLoading) return <p className="text-sm">Loading activity...</p>;
  if (!history || history.length === 0) return <p className="text-sm">No recent activity.</p>;
  return (
    <div className="space-y-3">
      {history
        .filter((log: any) => {
          if (log.fieldName === "Issue Created") return true;
          const noChange = log.oldValue == null && log.newValue == null;
          return !noChange;
        })
        .map((log: any) => {
          const isDateField = log.fieldName === "startDate" || log.fieldName === "endDate";
          const formattedOldValue =
            isDateField && log.oldValue ? format(parseISO(log.oldValue), "PPP") : log.oldValue || "Empty";
          const formattedNewValue =
            isDateField && log.newValue ? format(parseISO(log.newValue), "PPP") : log.newValue || "Empty";
          return (
            <div key={log.id} className="relative pl-6">
              <div className="absolute left-0 top-2 h-full w-px bg-border" />
              <div className="absolute -left-1 top-2 h-2 w-2 rounded-full bg-todo" />
              <div className="p-3 bg-backgroundShade2 text-textDark rounded-md border border-border">
                <p className="text-sm">
                  <strong>{log.user.displayName}</strong>{" "}
                  {log?.fieldName !== "Issue Created" ? (
                    <>
                      <span className="text-textSecondary">updated</span>{" "}
                      <strong className="text-todo">{log.fieldName}</strong>
                    </>
                  ) : (
                    <strong className="text-todo">created this issue</strong>
                  )}
                </p>
                {log?.fieldName === "Issue Created" ? (
                  <>
                    <ul className="list-disc ml-6 text-sm">
                      {parseNewValueToList(log.newValue).map(({ key, value }: any, idx: number) => (
                        <li key={idx}>
                          <strong>{key}:</strong>{" "}
                          {value === null || value === undefined || value === "" ? "Empty" : value}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs">{format(new Date(log.createdAt), "PPPpp")}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm">
                      From: <span className="italic text-pending">{formattedOldValue}</span> To:{" "}
                      <span className="italic text-success">{formattedNewValue}</span>
                    </p>
                    <p className="text-xs">{format(new Date(log.createdAt), "PPPpp")}</p>
                  </>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

// AssigneesModal (now with body scroll lock & overscroll guard)
type Assignee = { value: string; label: string };
const AssigneesModal: React.FC<{
  isOpen: boolean;
  isArchived: boolean;
  isFetching: boolean;
  assignees: Assignee[];
  onClose: () => void;
  onAdd: (u: Assignee) => void;
  onRemove: (id: string) => void;
  fetchUsers: (page: number) => Promise<{ data: Assignee[]; hasMore: boolean }>;
}> = ({ isOpen, isArchived, isFetching, assignees, onClose, onAdd, onRemove, fetchUsers }) => {
  useEffect(() => {
    lockBodyScroll(isOpen);
    return () => lockBodyScroll(false);
  }, [isOpen]);

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Assignees"
      bgClass="bg-white"
      // prevent scroll chaining into body on touch/wheel
      // @ts-ignore - allow custom props to pass to root in your ModalContainer
      className="overscroll-contain"
    >
      <div
        className="space-y-5 overscroll-contain"
        onWheelCapture={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        style={{ scrollbarGutter: "stable both-edges" }}
      >
        {/* Add/Search panel */}
        <div className="rounded-xl p-4 bg-white ring-1 ring-border/60 shadow-sm ">
          <p className="text-sm text-textSecondary mb-3">
            Search and assign team members responsible for this issue.
          </p>
          {!isArchived && (
            <PaginatedDropdown
              fetchData={fetchUsers}
              renderItem={(item) => <span>{item.label}</span>}
              onSelect={onAdd}
              placeholder={isFetching ? "Loading..." : "Add assignee"}
            />
          )}
        </div>

        {/* List / Empty state */}
        {assignees.length === 0 ? (
          <div className="py-10 text-center text-sm text-textSecondary rounded-xl bg-white ring-1 ring-border/60 shadow-sm">
            No assignees yet
          </div>
        ) : (
          <ul className="rounded-xl overflow-hidden bg-white ring-1 ring-border/60 shadow-sm divide-y divide-border/60">
            {assignees.map((u) => (
              <li
                key={u.value}
                className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-white hover:bg-gray-50 transition-colors text-textDark"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100  font-semibold shrink-0">
                    {u.label.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{u.label}</div>
                    <div className="text-xs text-textSecondary">Assignee</div>
                  </div>
                </div>

                {!isArchived && (
                  <button
                    className="px-3 py-1.5 text-xs rounded-md bg-white ring-1 ring-border/60 hover:bg-red-50 hover:ring-red-200 text-red-600 transition-all"
                    onClick={() => onRemove(u.value)}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </ModalContainer>
  );
};

// -----------------------------
// Main container export
// -----------------------------

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
  const [selectedUsers, setSelectedUsers] = useState<Assignee[]>([]);
  const [showAllAssignees, setShowAllAssignees] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  // API hooks
  const [triggerGetUsers, { isFetching }] = useLazyGetAllUsersQuery();
  const [assignIssues] = useAssignIssuesMutation();
  const [removeAssignedUser] = useRemoveAssignedUserMutation();

  const { data: latestActivity, isLoading: isActivityLoading } = useGetProjectActiveLogsQuery({
    projectId,
    page: 1,
    limit: 3,
    issueId: task?.id ? task?.id : undefined,
  });

  const [deleteIssue, { isLoading: isDeleting }] = useDeleteIssueMutation();
  const [updateIssue, { isLoading: isMovingStatus }] = useUpdateIssueMutation();
  const [updateIssueLogHistory] = useUpdateIssueLogHistoryMutation();

  useEffect(() => setLocalTask(task), [task]);
  useEffect(() => {
    if (task.assignedUsers?.length > 0) {
      setSelectedUsers(
        task.assignedUsers.map((assignedUser) => ({
          value: assignedUser.user.id,
          label: assignedUser.user.displayName || assignedUser.user.name || assignedUser.user.email,
        }))
      );
    } else {
      setSelectedUsers([]);
    }
  }, [task.assignedUsers]);

  const fetchUsers = async (page: number) => {
    try {
      const response = await triggerGetUsers({ page, limit: 10, roleName: ROLES.WORKER }).unwrap();
      return {
        data:
          response?.data?.users?.map((user: any) => ({
            value: user.id,
            label: user.displayName || user.name || user.email,
          })) ?? [],
        hasMore:
          (response?.data?.pagination?.page || 0) * (response?.data?.pagination?.limit || 0) <
          (response?.data?.pagination?.total || 0),
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Couldn't load users");
      return { data: [], hasMore: false };
    }
  };

  const handleUserSelect = async (selected: Assignee) => {
    if (!selected?.value) return;
    if (selectedUsers.some((u) => u.value === selected.value)) return;
    const optimistic = [...selectedUsers, selected];
    setSelectedUsers(optimistic);
    try {
      await assignIssues({ issueId: task.id, body: { userIds: optimistic.map((u) => u.value) } }).unwrap();
      refetch();
    } catch (error) {
      console.error("Error assigning user:", error);
      toast.error("Failed to assign user");
      setSelectedUsers(selectedUsers);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!userId) return;
    const prev = selectedUsers;
    setSelectedUsers((prevUsers) => prevUsers.filter((u) => u.value !== userId));
    try {
      await removeAssignedUser({ issueId: task.id, userId }).unwrap();
      refetch();
    } catch (error) {
      console.error("Error removing assigned user:", error);
      toast.error("Failed to remove user");
      setSelectedUsers(prev);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIssue(task.id).unwrap();
      onDelete();
      if (refetchFiles) refetchFiles();
      refetch();
      toast.success("Issue deleted successfully!");
    } catch (err) {
      console.error("Failed to delete issue:", err);
      toast.error("Unable to delete issue, please try again!");
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (newStatus?.toUpperCase() === task.status?.toUpperCase()) return;
    const formData = new FormData();
    formData.append("title", task.title || "");
    formData.append("description", task.description || "");
    formData.append("status", newStatus);
    formData.append("startDate", task.startDate || "");
    formData.append("endDate", task.endDate || "");
    const logBody = [{ fieldName: "status", oldValue: task.status, newValue: newStatus }];
    try {
      await updateIssue({ issueId: task.id, formData }).unwrap();
      setLocalTask((prev) => ({ ...prev, status: newStatus }));
      refetch();
      toast.success(`Status updated to "${newStatus}"`);
    } catch (error: any) {
      toast.error(error?.data?.error?.message || "Unable to update status, please try again!");
    }
    try {
      await updateIssueLogHistory({ issueId: task.id, body: logBody }).unwrap();
    } catch (error) {
      console.error("Failed to update issue log history", error);
    }
  };

  const visibleChips = 3;
  const overflowCount = Math.max(0, selectedUsers.length - visibleChips);
  const createdEntry = latestActivity?.data?.history?.find((a: any) => a?.fieldName === "Issue Created");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-textDark">
      {/* Left: content */}
      <div className="md:col-span-2 space-y-6">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border py-2">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <StatusDropdown
                value={localTask.status?.toUpperCase?.() || PROJECT_STATUS.ACTIVE}
                onChange={(s) => updateStatus(s)}
                disabled={isMovingStatus || isArchived}
              />
              <h1 className="font-semibold text-lg sm:text-xl truncate max-w-[48ch]" title={localTask.title}>
                {localTask.title || "Untitled Issue"}
              </h1>
            </div>
            {!isArchived && <Button text="Edit" onClick={onEdit} fullWidth={false} />}
          </div>
        </div>

        {/* FULL-WIDTH: Description */}
        <section className={PANEL}>
          <h4 className="text-sm font-semibold">Description</h4>
          <div className="mt-2 text-sm leading-relaxed break-words whitespace-pre-wrap">
            {localTask.description ? (
              <p className={descExpanded ? "" : "line-clamp-6"}>{localTask.description}</p>
            ) : (
              <p className="text-textSecondary italic">No description provided.</p>
            )}
          </div>
        </section>

        {/* FULL-WIDTH: Assignees */}
        <section className={PANEL} 
      style={{ zIndex: "100px" }}
        >
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold">Assignees</h4>
            {!isArchived && (
              <PaginatedDropdown
                fetchData={fetchUsers}
                renderItem={(item) => <span>{item.label}</span>}
                onSelect={handleUserSelect}
                placeholder={isFetching ? "Loading..." : "Add assignee"}
              />
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {selectedUsers.length === 0 && <span className={SUBTLE}>Unassigned</span>}

            {selectedUsers.slice(0, visibleChips).map((user) => (
              <AvatarChip
                key={user.value}
                label={user.label}
                onRemove={!isArchived ? () => handleRemoveUser(user.value) : undefined}
              />
            ))}

            {overflowCount > 0 && (
              <button
                type="button"
                className="inline-flex items-center justify-center h-[30px] px-2 text-xs rounded-full border border-border bg-backgroundShade2 hover:bg-hover"
                onClick={() => setShowAllAssignees(true)}
                aria-label={`View all ${selectedUsers.length} assignees`}
              >
                +{overflowCount}
              </button>
            )}
          </div>
        </section>

        {/* META GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        style={{ zIndex: "-1" }}
        >
          <MetaField title="Project">
            <p className="text-sm break-words whitespace-normal" title={task?.project?.title}>
              {task?.project?.title || "Untitled Project"}
            </p>
          </MetaField>

          <MetaField title="Created">
            <p className="text-sm">{task?.createdAt ? formatDate(task.createdAt) : "—"}</p>
          </MetaField>

          {createdEntry && (
            <MetaField title="Created By">
              <p className="text-sm">{createdEntry?.user?.displayName || "—"}</p>
            </MetaField>
          )}

          <MetaField title="Attachments" className="sm:col-span-2">
            <ul className="space-y-2">
              {(task.files?.length ?? 0) === 0 && (
                <li className="text-sm text-textSecondary">No attachments</li>
              )}
              {task.files?.map((file, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="pt-1 flex-shrink-0">{renderFileIcon(file.type)}</div>
                  <a
                    className="hover:underline break-words whitespace-normal max-w-full inline-block text-sm text-textDark"
                    href={file?.url ? `${BASE_URL}/${file.url}` : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={file?.name || "file"}
                    onClick={(e) => {
                      if (!file?.url) e.preventDefault();
                    }}
                  >
                    {file?.name || "Unnamed file"}
                  </a>
                </li>
              ))}
            </ul>
          </MetaField>
        </section>
      </div>

      {/* Right: activity timeline */}
      <aside className="space-y-3 md:col-span-1"
      style={{ zIndex: "-1" }}
      >
        <h4 className="text-base font-semibold">Latest Activity</h4>
        <div
          className="max-h-[70vh] pr-1"
          style={{ scrollbarGutter: "stable both-edges" }}
          onWheelCapture={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <ActivityTimeline isLoading={isActivityLoading} history={latestActivity?.data?.history} />
        </div>
      </aside>

      {/* Assignees modal */}
      <AssigneesModal
        isOpen={showAllAssignees}
        onClose={() => setShowAllAssignees(false)}
        isArchived={isArchived}
        isFetching={isFetching}
        assignees={selectedUsers}
        onAdd={handleUserSelect}
        onRemove={handleRemoveUser}
        fetchUsers={fetchUsers}
      />
    </div>
  );
};

export default TaskDetailsView;
