import React from "react";
import CreateOrEditProject from "../components/CreateOrEditProject.tsx";
import { ProjectFormData } from "../../../types/types.ts";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useCreateProjectMutation } from "../../../redux/features/projectsApi.ts";

const CreateProject: React.FC = () => {
  // Get the mutation function from the hook
  const [createProject, { isLoading, isSuccess }] = useCreateProjectMutation();

  const handleSubmit = async (formData: ProjectFormData, resetFormData: () => void) => {
    // Create a FormData object
    const formDataToSend = new FormData();
  
    // Append the fields
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("companyName", formData.companyName || "");
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
      await createProject(formDataToSend).unwrap();
      resetFormData();
      toast.success("Project created successfully!");
      console.log("Project created successfully!");
    } catch (error:any) {
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
