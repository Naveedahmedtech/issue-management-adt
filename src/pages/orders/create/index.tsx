import React from "react";
import CreateOrEdit from "../components/CreateOrEdit.tsx";
import { useCreateOrderMutation } from "../../../redux/features/orderApi.ts";
import { OrderFormData } from "../../../types/types.ts";
import { format } from "date-fns";
import { toast } from "react-toastify";


const CreateOrder: React.FC = () => {
    // Get the mutation function from the hook
    const [createProject, { isLoading, isSuccess }] = useCreateOrderMutation();
  
    const handleSubmit = async (formData: OrderFormData, resetFormData: () => void) => {
        // Create a FormData object
        const formDataToSend = new FormData();
    
        // Append the fields
        formDataToSend.append("name", formData.name);
        formDataToSend.append("price", formData.price?.toString() || ""); // Convert price to string
        formDataToSend.append("location", formData.location);
        formDataToSend.append("description", formData.description);
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
            toast.success("Order created successfully!");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create project. Please try again.");
            console.error("Failed to create project:", error);
        }
    };
    
    
    return (
      <CreateOrEdit
        mode="create"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isSuccess={isSuccess}
      />
    );
  };
  
  export default CreateOrder;
