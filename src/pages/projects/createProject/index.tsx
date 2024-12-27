import React from "react";
import CreateOrEditProject from "../components/CreateOrEditProject.tsx";

const CreateProject: React.FC = () => {

    return (
        <CreateOrEditProject
            mode="create"
            onSubmit={(formData) => console.log("Created:", formData)}
        />
    )
};

export default CreateProject;
