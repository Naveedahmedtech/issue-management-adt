import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../../components/buttons/Button";
import Table from "../../components/Table";
import ModalContainer from "../../components/modal/ModalContainer";
import InputField from "../../components/InputField";
import FormikSelect from "../../components/dropdown/Dropdown.tsx";
import { Link } from "react-router-dom";
import { User } from "../../types/types";
import {
  useGetAllUsersQuery,
  useUpdateAzureUserMutation,
  usePermissionsQuery,
  useRolesQuery,
  useDeleteAzureUserMutation,
} from "../../redux/features/authApi.ts";
import { toast } from "react-toastify";
import { getUserManagementColumns } from "../../utils/Common.tsx";
import SelectField from "../../components/SelectField.tsx";
import { buildPermissionsMap } from "../../utils/index.ts";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // NEW: Access (Role/Permissions) modals
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isConfirmAccessOpen, setIsConfirmAccessOpen] = useState(false);
  const [accessDraft, setAccessDraft] = useState<{ role: string; permissions: string[] } | null>(null);
  const [confirmText, setConfirmText] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [updateAzureUser, { isLoading: isUpdating }] = useUpdateAzureUserMutation();

  const { data, isLoading, isError, refetch } = useGetAllUsersQuery({
    page: currentPage,
    limit: 20,
    roleName: selectedRole || undefined,
  });

  const { data: rolesData } = useRolesQuery({});
  const { data: permissionsData } = usePermissionsQuery({});

  const [deleteAzureUser, { isLoading: isDeleting }] = useDeleteAzureUserMutation();

  const rolesOptions =
    rolesData?.data
      ?.filter((role: { id: string; name: string }) => role.name !== "SUPER_ADMIN")
      .map((role: { id: string; name: string }) => ({
        label: role.name.replace("_", " ").replace(/\b\w/g, (char: string) => char.toUpperCase()),
        value: role.id,
      })) || [];

  const permissionsOptions =
    permissionsData?.data?.map((permission: { id: string; action: string }) => ({
      label: permission.action
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char: string) => char.toUpperCase()),
      value: permission.id,
    })) || [];

  useEffect(() => {
    if (data?.data?.users) {
      setUsers(data.data.users);
      setFilteredUsers(data.data.users);
      setTotalPages(Math.ceil(data.data.pagination.total / data.data.pagination.limit));
    }
  }, [data]);

  const handleFilterChange = (role: string | null) => {
    if (role && role !== "All Roles") {
      const updatedRoleName = role === "SUPER ADMIN" ? "SUPER_ADMIN" : role;
      setSelectedRole(updatedRoleName);
    } else {
      setSelectedRole("");
    }
    setCurrentPage(1);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteAzureUser(userToDelete).unwrap();
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setFilteredUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      toast.success("User deleted successfully!");
      refetch();
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  // PROFILE (non-sensitive) update
  const handleModalSubmit = async (values: any) => {
    if (!selectedUser) return;
    try {
      await updateAzureUser({
        userId: selectedUser.id,
        body: {
          email: values.email,
          displayName: values.displayName,
          // role & permissions intentionally NOT here
        },
      }).unwrap();
      refetch();
      toast.success("User updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    }
  };

  // Access (sensitive) update — runs after confirmation
  const handleAccessUpdate = async () => {
    if (!selectedUser || !accessDraft) return;
    try {
      await updateAzureUser({
        userId: selectedUser.id,
        body: {
          roleId: accessDraft.role,
          permissions: accessDraft.permissions,
        },
      }).unwrap();
      refetch();
      toast.success("Access updated successfully!");
      setIsConfirmAccessOpen(false);
      setIsAccessModalOpen(false);
      setAccessDraft(null);
      setConfirmText("");
    } catch (error) {
      console.error("Error updating access:", error);
      toast.error("Failed to update access. Please try again.");
    }
  };

  // Helpers
  const toLabelCase = (raw: string) => raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());


  const handleRoleChange = (roleValue: string, setFieldValue: (field: string, value: any) => void) => {
    const roleLabel = rolesOptions.find((r: any) => r.value === roleValue)?.label;
    if (!roleLabel) return;
    if (!permissionsData?.data) return;
     const map = buildPermissionsMap(permissionsData);
    if (map[roleLabel]) setFieldValue("permissions", map[roleLabel]);
  };

  // Open Access modal with selected user's current access prefilled
  const openAccessModal = (row:any) => {
    setSelectedUser(row)
    setIsAccessModalOpen(true);
  };
  const columns = getUserManagementColumns(handleEditUser, handleDeleteClick, openAccessModal);

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);


  // Move to confirmation step
  const proceedToConfirmAccess = (values: { role: string; permissions: string[] }) => {
    setIsAccessModalOpen(false);
    setAccessDraft(values);
    setIsConfirmAccessOpen(true);
  };

  return (
    <div className="p-6 text-textDark">
      <div className="flex flex-wrap gap-x-10 justify-between items-center mb-4">
        <h1 className="text-xl font-bold">User Management</h1>
        <div className="flex justify-center items-center space-x-4">
          <SelectField
            label=""
            name="roleFilter"
            options={[{ label: "All Roles", value: "" }, ...rolesOptions]}
            value={rolesOptions.find((option: any) => option.value === selectedRole) || null}
            onChange={(option) => handleFilterChange(option?.label || null)}
          />
          <Link to="/users/create">
            <Button text="Create User" fullWidth={false} />
          </Link>
        </div>
      </div>

      {isLoading ? (
        <p>Loading users...</p>
      ) : isError ? (
        <p>Error loading users</p>
      ) : (
        <Table
          columns={columns}
          data={filteredUsers}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* === Edit (non-sensitive) modal === */}
      {isModalOpen && selectedUser && (
        <ModalContainer isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit User">
          <Formik
            initialValues={{
              email: selectedUser.email,
              displayName: selectedUser.displayName,
            }}
            validationSchema={Yup.object({
              displayName: Yup.string().required("Required"),
            })}
            onSubmit={handleModalSubmit}
          >
            {() => (
              <Form>
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  disabled
                  labelColor="text-text"
                  className="!bg-hover !text-text"
                />
                <InputField
                  label="Display Name"
                  name="displayName"
                  type="text"
                  labelColor="text-text"
                  className="!bg-hover !text-text"
                />

                <div className="flex justify-between items-center mt-6">
                  <div className="flex gap-3">
                    <Button
                      text={isUpdating ? "Updating..." : "Update"}
                      type="submit"
                      isSubmitting={isUpdating}
                      className="bg-primary hover:border-primary hover:!text-text"
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </ModalContainer>
      )}

      {/* === Access (sensitive) modal === */}
      {isAccessModalOpen && selectedUser && (
        <ModalContainer
          isOpen={isAccessModalOpen}
          onClose={() => setIsAccessModalOpen(false)}
          title={`Manage Access — ${selectedUser.displayName}`}
        >
          <Formik
            enableReinitialize
            initialValues={{
              role: (() => {
                const normalized = toLabelCase(selectedUser.role ?? "");
                return rolesOptions.find((r: any) => r.label === normalized)?.value || "";
              })(),
              permissions:
                selectedUser.permissions
                  ?.map((permission) =>
                    permissionsOptions.find(
                      (opt: any) => opt.label.toUpperCase().replace(/\s/g, "_") === permission
                    )?.value
                  )
                  .filter(Boolean) || [],
            }}
            validationSchema={Yup.object({
              role: Yup.string().required("Required"),
              permissions: Yup.array().of(Yup.string()).min(1, "Select at least one permission"),
            })}
            onSubmit={(values) => proceedToConfirmAccess(values)}
          >
            {({ setFieldValue, values, isSubmitting }) => (
              <Form>
                <FormikSelect
                  name="role"
                  options={rolesOptions}
                  placeholder="Select Role"
                  className="mb-4 !z-[1000000]"
                  light
                  label="Role"
                  onChange={(option: any) => {
                    if (!option || Array.isArray(option)) return;
                    const roleValue = option.value;
                    setFieldValue("role", roleValue);
                    handleRoleChange(roleValue, setFieldValue);
                  }}
                />

                <FormikSelect
                  name="permissions"
                  options={permissionsOptions}
                  placeholder="Select Permissions"
                  isMulti
                  className="mb-4"
                  light
                  label="Permissions"
                />

                <div className="flex justify-end gap-3 mt-4">
                  <Button text="Next" type="submit" isSubmitting={isSubmitting}
                        className="bg-primary hover:border-primary hover:!text-text"
                  
                  />
                </div>
              </Form>
            )}
          </Formik>
        </ModalContainer>
      )}

      {/* === Confirm access changes modal === */}
      {isConfirmAccessOpen && selectedUser && accessDraft && (
        <ModalContainer
          isOpen={isConfirmAccessOpen}
          onClose={() => setIsConfirmAccessOpen(false)}
          title="Confirm Change"
        >
          <div className="space-y-4 text-text">
            <ul className="list-disc pl-6 text-sm">
              <li>Role will be updated.</li>
              <li>{accessDraft.permissions.length} permission(s) will be assigned.</li>
            </ul>
            <p className="text-sm">
              To confirm, type the user’s email: <strong>{selectedUser.email}</strong>
            </p>
            <input
              className="w-full rounded-md border px-3 py-2 bg-hover"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type email to confirm"
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                text="Confirm & Apply"
                onClick={handleAccessUpdate}
                disabled={confirmText.trim().toLowerCase() !== selectedUser.email.toLowerCase()}
                preview="danger"
              />
            </div>
          </div>
        </ModalContainer>
      )}

      {/* === Delete confirmation modal === */}
      {isDeleteModalOpen && (
        <ModalContainer
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Confirmation"
        >
          <p className="text-text">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4 mt-4">
            <Button
              text="Delete"
              onClick={confirmDeleteUser}
              preview="danger"
              fullWidth={false}
              isSubmitting={isDeleting}
            />
          </div>
        </ModalContainer>
      )}
    </div>
  );
};

export default UserManagement;
