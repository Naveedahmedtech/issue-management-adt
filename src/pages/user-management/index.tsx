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

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Mutation to update user
    const [updateAzureUser, { isLoading: isUpdating }] = useUpdateAzureUserMutation();

    // Fetch users from API
    const { data, isLoading, isError, refetch } = useGetAllUsersQuery({
        page: currentPage,
        limit: 20,
        roleName: selectedRole || undefined,
    });

    // Fetch roles and permissions
    const { data: rolesData } = useRolesQuery({});
    const { data: permissionsData } = usePermissionsQuery({});

    const [deleteAzureUser, { isLoading: isDeleting }] = useDeleteAzureUserMutation();

    // Prepare dropdown options for roles and permissions
    const rolesOptions =
        rolesData?.data
            ?.filter((role: { id: string; name: string }) => role.name !== "SUPER_ADMIN")
            .map((role: { id: string; name: string }) => ({
                label: role.name.replace("_", " ").replace(/\b\w/g, (char: string) => char.toUpperCase()),
                value: role.id,
            })) || [];

    // const rolesOptions =["WORKER", "ADMIN"];

    const permissionsOptions =
        permissionsData?.data?.map((permission: { id: string; action: string }) => ({
            label: permission.action
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char: string) => char.toUpperCase()),
            value: permission.id,
        })) || [];

    // Load users when data is available
    useEffect(() => {
        if (data?.data?.users) {
            setUsers(data.data.users);
            setFilteredUsers(data.data.users);
            setTotalPages(Math.ceil(data.data.pagination.total / data.data.pagination.limit));
        }
    }, [data]);

    // Filter users by role (via API)
    const handleFilterChange = (role: string | null) => {
        if (role && role !== "All Roles") {
            const updatedRoleName = role === "SUPER ADMIN" ? "SUPER_ADMIN" : role;
            setSelectedRole(updatedRoleName);
        } else {
            setSelectedRole("");
        }
        setCurrentPage(1);
    };

    // Edit user
    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    // Delete user
    const handleDeleteClick = (user: any) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    // Confirm delete action
    const confirmDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await deleteAzureUser(userToDelete).unwrap();
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id));
            setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id));
            toast.success("User deleted successfully!");
            refetch();
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user. Please try again.");
        }
    };

    // Update user after edit
    const handleModalSubmit = async (values: any) => {
        if (!selectedUser) return;
        try {
            await updateAzureUser({
                userId: selectedUser.id,
                body: {
                    email: values.email,
                    displayName: values.displayName,
                    roleId: values.role,
                    permissions: values.permissions,
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

    // Normalize server role names like "SUPER_ADMIN" -> "Super Admin"
    const toLabelCase = (raw: string) =>
        raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    // Build permissions map from permissionsData (IDs) keyed by ROLE LABELS
    const buildPermissionsMap = () => {
        if (!permissionsData?.data) return {};
        const all = permissionsData.data;

        const idFor = (action: string) => all.find((p: any) => p.action === action)?.id;

        return {
            [toLabelCase("WORKER")]: [
                "READ_PROJECT",
                "READ_ORDER",
                "CREATE_ISSUE",
                "EDIT_ISSUE",
                "READ_ISSUE",
            ].map(idFor).filter(Boolean),

            [toLabelCase("ADMIN")]: all
                .filter((p: any) => !["MANAGE_USERS", "MANAGE_ROLES", "MANAGE_PERMISSIONS"].includes(p.action))
                .map((p: any) => p.id),

            [toLabelCase("SUPER_ADMIN")]: all.map((p: any) => p.id),
        } as Record<string, string[]>;
    };

    const handleRoleChange = (
        roleValue: string,
        setFieldValue: (field: string, value: any) => void
    ) => {
        // Find role label for the selected value
        const roleLabel = rolesOptions.find((r:any) => r.value === roleValue)?.label;
        if (!roleLabel) return;

        const map = buildPermissionsMap();
        if (map[roleLabel]) {
            setFieldValue("permissions", map[roleLabel]);
        }
    };


    const columns = getUserManagementColumns(handleEditUser, handleDeleteClick);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
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
                <>
                    <Table
                        columns={columns}
                        data={filteredUsers}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            {isModalOpen && selectedUser && (
                <ModalContainer isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit User">
                    <Formik
                        initialValues={{
                            email: selectedUser.email,
                            displayName: selectedUser.displayName,
                            role: (() => {
                                const normalized = toLabelCase(selectedUser.role ?? "");
                                return rolesOptions.find((r: any) => r.label === normalized)?.value || "";
                            })(),
                            permissions: selectedUser.permissions
                                .map((permission) =>
                                    permissionsOptions.find(
                                        (opt: any) => opt.label.toUpperCase().replace(/\s/g, "_") === permission
                                    )?.value
                                )
                                .filter(Boolean),
                        }}
                        validationSchema={Yup.object({
                            displayName: Yup.string().required("Required"),
                            role: Yup.string().required("Required"),
                            permissions: Yup.array().of(Yup.string()).required("Required"),
                        })}
                        onSubmit={handleModalSubmit}
                    >
                        {({ setFieldValue }) => (
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

                                {/* Role: single-arg onChange, uses setFieldValue from Formik scope */}
                                <FormikSelect
                                    name="role"
                                    options={rolesOptions}
                                    placeholder="Select Role"
                                    className="mb-4"
                                    light
                                    label="Role"
                                    // isDisabled={!permissionsData?.data}  // optional: avoid race
                                    onChange={(option: any) => {
                                        if (!option || Array.isArray(option)) return; // guard
                                        const roleValue = option.value;               // role id
                                        setFieldValue("role", roleValue);
                                        handleRoleChange(roleValue, setFieldValue);   // ⬅️ sets default permission IDs
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

                                <div className="flex justify-end space-x-4 mt-4">
                                    <Button
                                        text={isUpdating ? "Updating..." : "Update"}
                                        type="submit"
                                        isSubmitting={isUpdating}
                                        className="bg-primary hover:border-primary hover:!text-text"
                                    />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </ModalContainer>
            )}


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
