import React from "react";
import CreateOrEditProject from "../components/CreateOrEditProject.tsx";

const CreateProject: React.FC = () => {

    return (
        <CreateOrEditProject
            mode="edit"
            initialData={{
                name: "Existing Project",
                description: "This is an existing project",
                startDate: new Date(),
                endDate: new Date(),
                status: { label: "In Progress", value: "In Progress" },
                files: [],
            }}
            onSubmit={(formData) => console.log("Update:", formData)}
        />
    )
};

export default CreateProject;
