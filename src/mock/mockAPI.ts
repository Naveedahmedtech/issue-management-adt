import { User} from "../types/types.ts";


// type Column = { id: string; name: string; tasks: ITask[] };
// type Project = { title: string; description: string; status: string; columns: Column[] };

export const fetchMockProject = (): Promise<any> => {
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve({
                title: "Website Redesign",
                description: "A project to revamp the company's main website.",
                status: "In Progress",
                columns: [
                    {
                        id: "column-1",
                        name: "Active",
                        tasks: [
                            {
                                id: "task-1",
                                title: "Research competitor websites",
                                description: "Analyze competitors' designs for inspiration.",
                                status: "TO DO",
                                startDate: "2024-12-01T08:00:00.000Z",
                                endDate: "2024-12-03T08:00:00.000Z",
                                files: [
                                    { name: "homepage-mockup.pdf", type: "PDF", url: "/files/homepage-mockup.pdf" },
                                    { name: "ui-components.xlsx", type: "Excel", url: "/files/ui-components.xlsx" },
                                ],
                            },
                            {
                                id: "task-2",
                                title: "Create wireframes",
                                description: "Design wireframes for homepage and dashboard.",
                                status: "TO DO",
                                startDate: "2024-12-02T08:00:00.000Z",
                                endDate: "2024-12-06T08:00:00.000Z",
                                files: [
                                    { name: "homepage-mockup.pdf", type: "PDF", url: "/files/homepage-mockup.pdf" },
                                    { name: "ui-components.xlsx", type: "Excel", url: "/files/ui-components.xlsx" },
                                ],
                            },
                        ],
                    },
                    {
                        id: "column-2",
                        name: "On Going",
                        tasks: [
                            {
                                id: "task-3",
                                title: "Develop homepage UI",
                                description: "Implement responsive UI for homepage.",
                                status: "IN PROGRESS",
                                startDate: "2024-12-05T08:00:00.000Z",
                                endDate: "2024-12-10T08:00:00.000Z",
                                files: [
                                    { name: "homepage-mockup.pdf", type: "PDF", url: "/files/homepage-mockup.pdf" },
                                    { name: "ui-components.xlsx", type: "Excel", url: "/files/ui-components.xlsx" },
                                ],
                            },
                        ],
                    },
                    {
                        id: "column-3",
                        name: "Completed",
                        tasks: [
                            {
                                id: "task-4",
                                title: "Finalize branding guidelines",
                                description: "Confirm fonts, colors, and logo usage.",
                                status: "COMPLETED",
                                startDate: "2024-11-20T08:00:00.000Z",
                                endDate: "2024-11-25T08:00:00.000Z",
                                files: [
                                    { name: "homepage-mockup.pdf", type: "PDF", url: "/files/homepage-mockup.pdf" },
                                    { name: "ui-components.xlsx", type: "Excel", url: "/files/ui-components.xlsx" },
                                ],
                            },
                        ],
                    },
                ],
            });
        }, 500)
    );
};

export const mockFetchUsers = (): Promise<User[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: "1",
                    email: "admin@example.com",
                    password: "password123",
                    displayName: "password123",
                    role: "ADMIN",
                    permissions: ["CREATE_PROJECT", "EDIT_PROJECT", "DELETE_PROJECT", "READ_PROJECT"],
                },
            ]);
        }, 500);
    });
};
