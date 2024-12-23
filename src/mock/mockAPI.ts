type Task = { id: string; title: string; description: string; status: string };
type Column = { id: string; name: string; tasks: Task[] };
type Project = { title: string; description: string; status: string; columns: Column[] };

export const fetchMockProject = (): Promise<Project> => {
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve({
                title: "Website Redesign",
                description: "A project to revamp the company's main website.",
                status: "In Progress",
                columns: [
                    {
                        id: "column-1",
                        name: "To Do",
                        tasks: [
                            {
                                id: "task-1",
                                title: "Research competitor websites",
                                description: "Analyze competitors' designs for inspiration.",
                                status: "To Do",
                            },
                            {
                                id: "task-2",
                                title: "Create wireframes",
                                description: "Design wireframes for homepage and dashboard.",
                                status: "To Do",
                            },
                        ],
                    },
                    {
                        id: "column-2",
                        name: "In Progress",
                        tasks: [
                            {
                                id: "task-3",
                                title: "Develop homepage UI",
                                description: "Implement responsive UI for homepage.",
                                status: "In Progress",
                            },
                        ],
                    },
                    {
                        id: "column-3",
                        name: "Done",
                        tasks: [
                            {
                                id: "task-4",
                                title: "Finalize branding guidelines",
                                description: "Confirm fonts, colors, and logo usage.",
                                status: "Done",
                            },
                        ],
                    },
                ],
            });
        }, 500)
    );
};
