import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../../../components/buttons/Button";
import InputField from "../../../components/InputField";
import FormikSelect from "../../../components/dropdown/Dropdown";
import {PERMISSIONS, ROLES} from "../../../constant/ROLES.ts";

const rolesOptions = Object.values(ROLES).map((role) => ({
    label: role.replace("_", " ").replace(/\b\w/g, (char) => char.toUpperCase()), // Formats 'SUPER_ADMIN' to 'Super Admin'
    value: role,
}));

const permissionsOptions = Object.values(PERMISSIONS).map((permission) => ({
    label: permission
        .toLowerCase()
        .replace(/_/g, " ") // Replaces underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()), // Capitalizes each word
    value: permission,
}));

const CreateUser: React.FC = () => {
    const handleSubmit = (values: any) => {
        console.log("User Created:", values);
        // Navigate back to User Management or trigger a success message
    };

    return (
        <div className="p-10 bg-backgroundShade1 rounded-lg shadow-lg mx-auto max-w-4xl grid grid-cols-1 gap-6">
            <h1 className="text-3xl font-bold text-center text-text mb-6">Create User</h1>
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                    role: "",
                    permissions: [],
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
                onSubmit={handleSubmit}
            >
                <Form>
                    <InputField label="Email" name="email" type="email" />
                    <InputField label="Password" name="password" type="password" />
                    <FormikSelect
                        name="role"
                        options={rolesOptions}
                        placeholder="Select Role"
                        className="my-4"
                    />
                    <FormikSelect
                        name="permissions"
                        options={permissionsOptions}
                        placeholder="Select Permissions"
                        className="my-4"
                        isMulti
                    />
                    <div className="flex justify-end space-x-4 mt-4">
                        <Button text="Create" type="submit"  />
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default CreateUser;
