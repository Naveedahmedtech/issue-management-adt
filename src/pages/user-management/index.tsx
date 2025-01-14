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
import { useGetAllUsersQuery, useUpdateAzureUserMutation, usePermissionsQuery, useRolesQuery, useDeleteAzureUserMutation } from "../../redux/features/authApi.ts";
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

    // Mutation to update user
    const [updateAzureUser, { isLoading: isUpdating }] = useUpdateAzureUserMutation();

    // Fetch users from API
    const { data, isLoading, isError,  refetch } = useGetAllUsersQuery({ page: "1", limit: "10" });

    // Fetch roles and permissions
    const { data: rolesData } = useRolesQuery({});
    const { data: permissionsData } = usePermissionsQuery({});

    const [deleteAzureUser, { isLoading: isDeleting }] = useDeleteAzureUserMutation();


    // Prepare dropdown options for roles and permissions
    const rolesOptions = rolesData?.data?.map((role: { id: string; name: string }) => ({
        label: role.name.replace("_", " ").replace(/\b\w/g, (char: string) => char.toUpperCase()),
        value: role.id,
    })) || [];

    const permissionsOptions = permissionsData?.data?.map((permission: { id: string; action: string }) => ({
        label: permission.action.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (char: string) => char.toUpperCase()),
        value: permission.id,
    })) || [];

    // Load users when data is available
    useEffect(() => {
        if (data?.data) {
            setUsers(data.data);
            setFilteredUsers(data.data);
        }
    }, [data]);

    // Filter users by role
    const handleFilterChange = (role: string | null) => {
        if (role && role !== "All Roles") {
            const updatedRoleName = role === "SUPER ADMIN" ? "SUPER_ADMIN" : role;
            setSelectedRole(updatedRoleName);
            setFilteredUsers(users.filter((user) => user.role === updatedRoleName));
        } else {
            setFilteredUsers(users);
        }
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
            // API call to delete user
            await deleteAzureUser(userToDelete).unwrap();
    
            // Remove user from local state
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id));
            setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id));
    
            toast.success("User deleted successfully!");
            refetch();
    
            // Close modal
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
            // API call to update user
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

    const columns = getUserManagementColumns(handleEditUser, handleDeleteClick);
    return (
        <div className="p-6">
            <div className="flex flex-wrap gap-x-10 justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-text">User Management</h1>
                <div className="flex justify-center items-center space-x-4">
                    <SelectField
                        label=""
                        name="roleFilter"
                        options={[{ label: "All Roles", value: "" }, ...rolesOptions]}
                        value={rolesOptions.find((option:any) => option.value === selectedRole) || null}
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
                <Table columns={columns} data={filteredUsers} />
            )}

            {isModalOpen && selectedUser && (
                <ModalContainer
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Edit User"
                >
                    <Formik
                        initialValues={{
                            email: selectedUser.email,
                            displayName: selectedUser.displayName,
                            // Map role name to role ID
                            role: rolesOptions.find((role:any) => role.label === selectedUser.role)?.value || "",
                            // Map permissions to IDs based on matching labels
                            permissions: selectedUser.permissions
                                .map((permission) =>
                                    permissionsOptions.find(
                                        (option:any) => option.label.toUpperCase().replace(/\s/g, "_") === permission
                                    )?.value
                                )
                                .filter(Boolean), // Remove undefined values
                        }}
                        validationSchema={Yup.object({
                            displayName: Yup.string().required("Required"),
                            role: Yup.string().required("Required"),
                            permissions: Yup.array().of(Yup.string()).required("Required"),
                        })}
                        onSubmit={handleModalSubmit}
                    >

                        <Form>
                            <InputField label="Email" name="email" type="email" disabled />
                            <InputField label="Display Name" name="displayName" type="text" />
                            <FormikSelect
                                name="role"
                                options={rolesOptions}
                                placeholder="Select Role"
                                className="mb-4"
                            />
                            <FormikSelect
                                name="permissions"
                                options={permissionsOptions}
                                placeholder="Select Permissions"
                                className="mb-4"
                                isMulti
                            />
                            <div className="flex justify-end space-x-4 mt-4">
                                <Button
                                    text={isUpdating ? "Updating..." : "Update"}
                                    type="submit"
                                    isSubmitting={isUpdating}
                                />
                            </div>
                        </Form>
                    </Formik>
                </ModalContainer>
            )}
            {/* Delete Confirmation Modal */}
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
