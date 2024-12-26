import React from "react";
import CreateOrEdit from "../components/CreateOrEdit.tsx";

const CreateProject: React.FC = () => {

    return (
        <CreateOrEdit
            mode="edit"
            initialData={{
                name: "Existing Project",
                description: "This is an existing project",
                location: "street 34, block 2 norway",
                status: { label: "In Progress", value: "In Progress" },
                files: [],
            }}
            onSubmit={(formData) => console.log("Update:", formData)}
        />
    )
};

export default CreateProject;
