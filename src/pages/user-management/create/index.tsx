import React, {useEffect, useState} from "react";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import Button from "../../../components/buttons/Button";
import InputField from "../../../components/InputField";
import FormikSelect from "../../../components/dropdown/Dropdown";
import {useCreateAzureUserMutation, usePermissionsQuery, useRolesQuery} from "../../../redux/features/authApi.ts";
import {toast} from "react-toastify";

const CreateUser: React.FC = () => {
  const [rolesOptions, setRolesOptions] = useState<{ label: string; value: string }[]>([]);
  const [permissionsOptions, setPermissionsOptions] = useState<{ label: string; value: string }[]>([]);

  const [createAzureUser, { isLoading: isCreating }] = useCreateAzureUserMutation();

  const { data: rolesData, isLoading: rolesLoading, isError: rolesError } = useRolesQuery({});
  const { data: permissionsData, isLoading: permissionsLoading, isError: permissionsError } = usePermissionsQuery({});

  useEffect(() => {
    if (rolesData) {
      setRolesOptions(
        rolesData?.data?.map((role: { id: string; name: string }) => ({
          label: role?.name.replace("_", " ").replace(/\b\w/g, (char: string) => char.toUpperCase()),
          value: role.id,
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
          value: permission.id,
        }))
      );
    }
  }, [rolesData, permissionsData]);

  const handleRoleChange = (role: string, setFieldValue: (field: string, value: any) => void) => {
    if (rolesData && permissionsData) {
      const permissionsMap: Record<string, string[]> = {
        WORKER: [
          "READ_PROJECT",
          "READ_ORDER",
          "CREATE_ISSUE",
          "EDIT_ISSUE",
          "READ_ISSUE"
        ].map((action) =>
          permissionsData.data.find((perm:any) => perm.action === action)?.id
        ).filter(Boolean) as string[],
        ADMIN: permissionsData.data
          .filter(
            (perm:any) =>
              !["MANAGE_USERS", "MANAGE_ROLES", "MANAGE_PERMISSIONS"].includes(perm.action)
          )
          .map((perm:any) => perm.id),
        SUPER_ADMIN: permissionsData.data.map((perm:any) => perm.id),
      };

      const selectedRole = rolesOptions.find((r) => r.value === role)?.label;
      if (selectedRole === "SUPER ADMIN") {

        setFieldValue("permissions", permissionsMap["SUPER_ADMIN"]);

      } else {
        const selectedRole = rolesOptions.find((r) => r.value === role)?.label;
        if (selectedRole && permissionsMap[selectedRole]) {
          setFieldValue("permissions", permissionsMap[selectedRole]);
        }
      }
    }
  };

  const handleSubmit = async (values: any, { resetForm }: { resetForm: () => void }) => {
    try {
      const response = await createAzureUser({
        email: values.email,
        password: values.password,
        displayName: values.displayName,
        roleId: values.role,
        permissions: values.permissions,
        accountEnabled: true,
      }).unwrap();

      toast.success(`User created successfully!`);
      console.log("User Created:", response);
      resetForm();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user. Please try again.");
    }
  };

  return (
    <div className="p-10 bg-backgroundShade2 text-textDark rounded-lg shadow-lg mx-auto max-w-4xl grid grid-cols-1 gap-6">
      <h1 className="text-3xl font-bold text-center mb-6">Create User</h1>
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
          // password: Yup.string()
          // .min(8, "Password must be at least 8 characters long")
          // .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
          // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
          // .matches(/[0-9]/, "Password must contain at least one number")
          // .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
          // .required("Password is required"),
        
          displayName: Yup.string().required("Required"),
          role: Yup.string().required("Required"),
          permissions: Yup.array().of(Yup.string()).required("Required"),
        })}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <InputField label="Email" name="email" type="email" />
            {/*<InputField label="Password" name="password" type="password" />*/}
            <InputField label="Display Name" name="displayName" type="text" />

            {rolesLoading ? (
              <p>Loading roles...</p>
            ) : rolesError ? (
              <p>Error loading roles.</p>
            ) : (
              <FormikSelect
                name="role"
                options={rolesOptions}
                placeholder="Select Role"
                className="my-4"
                onChange={(option: any) => {
                  setFieldValue("role", option.value);
                  handleRoleChange(option.value, setFieldValue);
                }}
                label="Role"
              />
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
                label="Permissions"
              />
            )}

            <div className="flex justify-end space-x-4 mt-4">
              <Button text={isCreating ? "Creating..." : "Create"} type="submit" isSubmitting={isCreating} />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateUser;
