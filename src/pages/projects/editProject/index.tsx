import React from "react";
import CreateOrEditProject from "../components/CreateOrEditProject.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useGetProjectByIdQuery, useUpdateProjectMutation} from "../../../redux/features/projectsApi.ts";
import {toast} from "react-toastify";
import {format} from "date-fns";
import {ProjectFormData} from "../../../types/types.ts";
import {APP_ROUTES} from "../../../constant/APP_ROUTES.ts";

const EditProject: React.FC = () => {
    const params = useParams();
    const navigate = useNavigate();

    const {projectId} = params;

    // ✅ Fetch the project details by ID
    const {data: projectData, isLoading: isLoadingProject} = useGetProjectByIdQuery(projectId);

    // ✅ Use the updateProject mutation
    const [updateProject, {isLoading: isUpdating}] = useUpdateProjectMutation();

    // ✅ Handle form submission for updating the project
    const handleSubmit = async (formData: ProjectFormData) => {
        const formDataToSend = new FormData();

        // Append form fields
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("companyId", formData.companyId || "");
        formDataToSend.append("isOrder", String(formData.isOrder ?? false));

        formDataToSend.append(
            "startDate",
            formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : ""
        );
        formDataToSend.append(
            "endDate",
            formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : ""
        );
        formDataToSend.append("status", formData.status?.value || "");
        formDataToSend.append("userIds", JSON.stringify(formData?.userIds || []));

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
            await updateProject({projectId, formData: formDataToSend}).unwrap();
            if (projectId) {
                navigate(APP_ROUTES.APP.PROJECTS.DETAILS.replace(":projectId", projectId));
            }
        } catch (error: any) {
            console.log('err', error)
            toast.error(error?.data?.error?.message || "Failed to update project. Please try again.");
        }
    };


    // ✅ Show loading state while fetching project data
    if (isLoadingProject) {
        return <p>Loading project data...</p>;
    }

    return (
        <CreateOrEditProject
            mode="edit"
            initialData={{
                title: projectData?.data?.title,
                description: projectData?.data?.description,
                startDate: projectData?.data?.startDate,
                endDate: projectData?.data?.endDate,
                companyId: projectData?.data?.company?.id || "",
                status: {label: projectData?.data?.status, value: projectData?.data?.status},
                files: projectData?.data?.files || [],
                isOrder: projectData?.data?.isOrder || false,
                userIds: projectData?.data?.assignedUsers?.map((assignUsers: {
                    user: {
                        id: string;
                        displayName: string
                    }
                }) => assignUsers.user.id) || [],
            }}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
        />
    );
};

export default EditProject;
