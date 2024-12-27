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
import { mockFetchUsers } from "../../mock/mockAPI";
import { getUserManagementColumns, permissionsOptions, rolesOptions } from "../../utils/Common.tsx";
import SelectField from "../../components/SelectField.tsx";

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null); // User to be deleted

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await mockFetchUsers();
            setUsers(data);
            setFilteredUsers(data); // Initialize filtered users
        };
        fetchUsers();
    }, []);

    const handleFilterChange = (role: string | null) => {
        setSelectedRole(role);
        if (role) {
            setFilteredUsers(users.filter((user) => user.role === role));
        } else {
            setFilteredUsers(users); // Reset to all users
        }
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (user: any) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteUser = () => {
        if (userToDelete) {
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id));
            setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id));
        }
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleModalSubmit = (user: User) => {
        if (selectedUser) {
            setUsers((prevUsers) =>
                prevUsers.map((u) => (u.id === selectedUser.id ? { ...u, ...user } : u))
            );
            setFilteredUsers((prevUsers) =>
                prevUsers.map((u) => (u.id === selectedUser.id ? { ...u, ...user } : u))
            );
        }
        setIsModalOpen(false);
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
                        value={rolesOptions.find((option) => option.value === selectedRole) || null}
                        onChange={(option) => handleFilterChange(option?.value || null)}
                    />
                    <Link to="/users/create">
                        <Button text="Create User" fullWidth={false} />
                    </Link>
                </div>
            </div>
            <Table columns={columns} data={filteredUsers} />

            {/* Edit Modal */}
            {isModalOpen && (
                <ModalContainer
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Edit User"
                >
                    <Formik
                        initialValues={{
                            email: selectedUser?.email || "",
                            password: selectedUser?.password || "",
                            role: selectedUser?.role || "",
                            permissions: selectedUser?.permissions || [],
                        }}
                        validationSchema={Yup.object({
                            email: Yup.string()
                                .email("Invalid email address")
                                .required("Required"),
                            password: Yup.string()
                                .min(6, "Must be 6 characters or more")
                                .required("Required"),
                            role: Yup.string().required("Required"),
                            permissions: Yup.array().of(Yup.string()).required("Required"),
                        })}
                        onSubmit={(values) => {
                            const userData: User = {
                                id: selectedUser?.id || "",
                                email: values.email,
                                password: values.password,
                                role: values.role,
                                permissions: values.permissions,
                            };
                            handleModalSubmit(userData);
                        }}
                    >
                        <Form>
                            <InputField label="Email" name="email" type="email" />
                            <InputField label="Password" name="password" type="password" />
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
                                    text="Update"
                                    type="submit"
                                    fullWidth
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
                        />
                    </div>
                </ModalContainer>
            )}
        </div>
    );
};

export default UserManagement;
