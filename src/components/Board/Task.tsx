import React, {useEffect, useState} from "react";
import {Draggable, DraggableProvided} from "@hello-pangea/dnd";
import {TaskProps} from "../../types/types.ts";
import {useLazyGetAllUsersQuery} from "../../redux/features/authApi.ts";
import {useAssignIssuesMutation, useRemoveAssignedUserMutation} from "../../redux/features/issueApi.ts";
import {ROLES} from "../../constant/ROLES.ts";
import {FiX} from "react-icons/fi";
import PaginatedDropdown from "../dropdown/PaginatedDropdown";

const STATUS_COLORS: Record<string, string> = {
  "ACTIVE": "bg-todo text-text",
  "ON GOING": "bg-pending text-text",
  "COMPLETED": "bg-success text-text",
  Default: "bg-todo text-text",
};

const Task: React.FC<TaskProps> = ({ task, index, onClick, refetch }) => {
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

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-backgroundShade2 p-5 my-2 text-textDark rounded-md shadow hover:shadow-lg transition-all cursor-pointer"
          onClick={() => onClick(task)}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-lg truncate">{task.title}</h4>
            <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${STATUS_COLORS[task.status] || STATUS_COLORS.Default}`}>
              {task.status}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm mb-3 line-clamp-2">{task.description || "No description available."}</p>

          {/* Task Details */}
          <div className="text-xs text-text-muted border-t border-gray-300 pt-3 mb-3 space-y-1">
            {/* <p><strong>Start Date:</strong> {task.startDate ? format(new Date(task.startDate), "MMM dd, yyyy") : "Not set"}</p>
            <p><strong>End Date:</strong> {task.endDate ? format(new Date(task.endDate), "MMM dd, yyyy") : "Not set"}</p> */}
            <p><strong>Created by:</strong> {task.user.displayName}</p>
          </div>

          {/* User Assignment Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Assign User:</label>
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
              <p className="text-sm font-medium mb-2">Assigned Users:</p>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.value}
                    className="flex items-center  px-3 py-1 rounded-full text-sm border border-text transition"
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
      )}
    </Draggable>
  );
};

export default Task;
