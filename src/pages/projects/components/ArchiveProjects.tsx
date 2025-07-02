import React from "react";
import { Link } from "react-router-dom";
import Table from "../../../components/Table";
import { APP_ROUTES } from "../../../constant/APP_ROUTES";

const ArchivedProjects: React.FC<any> = ({
    projects,
    error,
    isLoading,
    currentPage,
    totalPages,
    handlePageChange
}) => {

    // const getStatusBadge = (status: string) => {
    //     let color = "bg-gray-500";

    //     switch (status?.toLocaleLowerCase()) {
    //         case "completed":
    //             color = "bg-success text-white";
    //             break;
    //         case "in progress":
    //             color = "bg-todo text-white";
    //             break;
    //         case "pending":
    //             color = "bg-pending text-white";
    //             break;
    //         default:
    //             color = "bg-gray-500 text-white";
    //     }

    //     return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>{status}</span>;
    // };

    const columns = [
        {
            id: "title",
            label: "Project Title",
            render: (row: any) => <span>{row.title}</span>,
        },
        // {
        //     id: "description",
        //     label: "Project Description",
        //     render: (row: any) => <span>{row?.description?.slice(0, 20)}</span>,
        // },
        // {
        //     id: "status",
        //     label: "Status",
        //     render: (row: any) => getStatusBadge(row.status),
        // },
        {
            id: "action",
            label: "Action",
            render: (row: any) => (
                <Link
                    to={APP_ROUTES.APP.PROJECTS.DETAILS.replace(":projectId", row.id)}
                    className="text-primary underline hover:text-primary-dark"
                    state={
                        { archive: true }
                    }
                >
                    View Project
                </Link>
            ),
        },
    ];

    return (
        <div>
            <main className="p-4 text-textDark">
                <section className="mb-6">
                    <h3 className="text-xl font-semibold  mb-4">Archived Projects</h3>
                    {isLoading && <p className="">Loading...</p>}
                    {error && <p className="text-red-500">Failed to load archived projects.</p>}
                    {projects && (
                        <Table
                            columns={columns}
                            data={projects}
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    )}
                </section>
            </main>
        </div>
    );
};

export default ArchivedProjects;
