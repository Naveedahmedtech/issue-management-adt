import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../../../components/buttons/Button";
import InputField from "../../../components/InputField";
import FormikSelect from "../../../components/dropdown/Dropdown";
import { useCreateAzureUserMutation, usePermissionsQuery, useRolesQuery } from "../../../redux/features/authApi.ts";
import { toast } from "react-toastify";

const CreateUser: React.FC = () => {
  // States for roles and permissions options
  const [rolesOptions, setRolesOptions] = useState<{ label: string; value: string }[]>([]);
  const [permissionsOptions, setPermissionsOptions] = useState<{ label: string; value: string }[]>([]);

  // API mutation to create user
  const [createAzureUser, { isLoading: isCreating }] = useCreateAzureUserMutation();

  // Fetch roles and permissions from the API
  const { data: rolesData, isLoading: rolesLoading, isError: rolesError } = useRolesQuery({});
  const { data: permissionsData, isLoading: permissionsLoading, isError: permissionsError } = usePermissionsQuery({});

  // Set roles and permissions options when API data is available
  useEffect(() => {
    if (rolesData) {
      setRolesOptions(
        rolesData?.data?.map((role: { id: string; name: string }) => ({
          label: role?.name.replace("_", " ").replace(/\b\w/g, (char: string) => char.toUpperCase()),
          value: role.id, // Use ID as value
        }))
      );
    }

    if (permissionsData) {
      setPermissionsOptions(
        permissionsData?.data?.map((permission: { id: string; action: string }) => ({
          label: permission?.action
            ?.toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char: string) => char.toUpperCase()),
          value: permission.id, // Use ID as value
        }))
      );
    }
  }, [rolesData, permissionsData]);

  // Handle form submission
  const handleSubmit = async (values: any, { resetForm }: { resetForm: () => void }) => {
    try {
      // Create user with selected IDs for role and permissions
      const response = await createAzureUser({
        email: values.email,
        password: values.password,
        displayName: values.displayName,
        roleId: values.role, // Pass role ID
        permissions: values.permissions, // Pass array of permission IDs
        accountEnabled: true,
      }).unwrap();
  
      toast.success(`User created successfully!`);
      console.log("User Created:", response);
  
      // Reset form after successful submission
      resetForm();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user. Please try again.");
    }
  };
  

  return (
    <div className="p-10 bg-backgroundShade1 rounded-lg shadow-lg mx-auto max-w-4xl grid grid-cols-1 gap-6">
      <h1 className="text-3xl font-bold text-center text-text mb-6">Create User</h1>
      <Formik
        initialValues={{
          email: "",
          password: "",
          displayName: "",
          role: "",
          permissions: [],
        }}
        validationSchema={Yup.object({
          email: Yup.string().email("Invalid email address").required("Required"),
          password: Yup.string().min(6, "Must be 6 characters or more").required("Required"),
          displayName: Yup.string().required("Required"),
          role: Yup.string().required("Required"),
          permissions: Yup.array().of(Yup.string()).required("Required"),
        })}
        onSubmit={handleSubmit}
      >
        <Form>
          <InputField label="Email" name="email" type="email" />
          <InputField label="Password" name="password" type="password" />
          <InputField label="Display Name" name="displayName" type="text" />

          {rolesLoading ? (
            <p>Loading roles...</p>
          ) : rolesError ? (
            <p>Error loading roles.</p>
          ) : (
            <FormikSelect name="role" options={rolesOptions} placeholder="Select Role" className="my-4" />
          )}

          {permissionsLoading ? (
            <p>Loading permissions...</p>
          ) : permissionsError ? (
            <p>Error loading permissions.</p>
          ) : (
            <FormikSelect
              name="permissions"
              options={permissionsOptions}
              placeholder="Select Permissions"
              className="my-4"
              isMulti
            />
          )}

          <div className="flex justify-end space-x-4 mt-4">
            <Button text={isCreating ? "Creating..." : "Create"} type="submit" isSubmitting={isCreating} />
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default CreateUser;


// waji@viewsoftweb.onmicrosoft.com
// password$$33
// Yo7p14E0Iv0uRyi
