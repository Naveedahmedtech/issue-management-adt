import React from "react";
import CreateOrEdit from "../components/CreateOrEdit.tsx";

const CreateProject: React.FC = () => {

    return (
        <CreateOrEdit
            mode="create"
            onSubmit={(formData) => console.log("Created:", formData)}
        />
    )
};

export default CreateProject;
