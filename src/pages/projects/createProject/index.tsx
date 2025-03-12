import React from "react";
import CreateOrEditProject from "../components/CreateOrEditProject.tsx";
import { ProjectFormData } from "../../../types/types.ts";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useCreateProjectMutation } from "../../../redux/features/projectsApi.ts";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../../constant/APP_ROUTES.ts";

const CreateProject: React.FC = () => {
  // Get the mutation function from the hook
  const [createProject, { isLoading, isSuccess }] = useCreateProjectMutation();
  const navigate = useNavigate();

  const handleSubmit = async (formData: ProjectFormData, resetFormData: () => void) => {
    // Create a FormData object
    const formDataToSend = new FormData();

    // Append the fields
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("companyId", formData.companyId || "");
    formDataToSend.append("status", formData.status?.value || "");

    // Format and append dates
    formDataToSend.append(
      "startDate",
      formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : ""
    );
    formDataToSend.append(
      "endDate",
      formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : ""
    );

    // Append files
    if (formData.files && formData.files.length > 0) {
      formData.files.forEach((file: File) => {
        formDataToSend.append("files", file);
      });
    }

    try {
      // Call the mutation
      const response = await createProject(formDataToSend).unwrap();
      resetFormData();
      navigate(APP_ROUTES.APP.PROJECTS.DETAILS.replace(":projectId", response?.data?.id));
    } catch (error: any) {
      toast.error(error?.data?.message || error?.data?.error?.message || "Failed to create project. Please try again.");
      console.error("Failed to create project:", error);
    }
  };

  return (
    <CreateOrEditProject
      mode="create"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isSuccess={isSuccess}
    />
  );
};

export default CreateProject;
