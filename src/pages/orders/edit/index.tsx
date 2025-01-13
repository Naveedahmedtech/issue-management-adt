import React from "react";
import CreateOrEdit from "../components/CreateOrEdit.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderByIdQuery, useUpdateOrderMutation } from "../../../redux/features/orderApi.ts";
import { toast } from "react-toastify";
import { OrderFormData } from "../../../types/types.ts";
import { format } from "date-fns";


const EditOrder: React.FC = () => {

    const params = useParams();
    const navigate= useNavigate();

    const { orderId } = params;

    const { data: orderData, isLoading: isOrderDataLoading } = useGetOrderByIdQuery(orderId);
  // ✅ Use the updateProject mutation
  const [updateProject, { isLoading: isUpdating }] = useUpdateOrderMutation();

  // ✅ Handle form submission for updating the project
  const handleSubmit = async (formData: OrderFormData) => {
    const formDataToSend = new FormData();
  
    // Append form fields
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("price", formData.price?.toString() ||  "");
    formDataToSend.append(
      "startDate",
      formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : ""
    );
    formDataToSend.append(
      "endDate",
      formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : ""
    );
    formDataToSend.append("status", formData.status?.value || "");
  
    // ✅ Check if new files are uploaded
    if (formData.files && formData.files.length > 0) {
      const hasNewFiles = formData.files.some((file) => file instanceof File);
      if (hasNewFiles) {
        formData.files.forEach((file: File) => {
          formDataToSend.append("files", file);
        });
      }
    }
  
    try {
      // ✅ Call the updateProject mutation
      await updateProject({ orderId, formData: formDataToSend }).unwrap();
      toast.success("Order updated successfully!");
      navigate(`/orders/${orderId}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update order. Please try again.");
    }
  };
  
  

  // ✅ Show loading state while fetching project data
  if (isOrderDataLoading) {
    return <p>Loading order data...</p>;
  }

    return (
        <CreateOrEdit
            mode="edit"
            initialData={{
                name: orderData?.data?.name,
                description: orderData?.data?.description,
                location: orderData?.data?.location,
                status: { label: orderData?.data?.status, value: orderData?.data?.status },
                price: orderData?.data?.price,
                files: orderData?.data?.files || [],
                startDate: orderData?.data?.startDate,
                endDate: orderData?.data?.endDate,
            }}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
        />
    )
};

export default EditOrder;
