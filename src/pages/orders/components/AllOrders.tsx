import React from "react";
import { Link } from "react-router-dom";
import Table from "../../../components/Table";
import { format } from "date-fns";
import { APP_ROUTES } from "../../../constant/APP_ROUTES";

const AllOrderTable: React.FC<any> = ({ orders, error, isLoading, totalPages,
    currentPage,
    onPageChange }) => {

    const getStatusBadge = (status: string) => {
        let color = "bg-gray-500";

        switch (status?.toLocaleLowerCase()) {
            case "completed":
                color = "bg-success text-white";
                break;
            case "in progress":
                color = "bg-todo text-white";
                break;
            case "pending":
                color = "bg-pending text-white";
                break;
            default:
                color = "bg-gray-500 text-white";
        }

        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>{status}</span>;
    };

    const columns = [
        {
            id: "title",
            label: "Order Name",
            render: (row: any) => <span>{row.name}</span>,
        },
        {
            id: "status",
            label: "Status",
            render: (row: any) => getStatusBadge(row.status),
        },
        {
            id: "startDate",
            label: "Start Date",
            render: (row: any) => <span>{row.startDate ? format(new Date(row.startDate), 'PP') : "N/A"}</span>,
        },
        {
            id: "endDate",
            label: "End Date",
            render: (row: any) => <span>{row.endDate ? format(new Date(row.endDate), 'PP') : "N/A"}</span>,
        },
        {
            id: "action",
            label: "Action",
            render: (row: any) => (
                <Link
                    to={APP_ROUTES.APP.ORDERS.DETAILS.replace(":orderId", row.id)}
                    className="text-primary underline hover:text-primary-dark"
                >
                    View Order
                </Link>
            ),
        },
    ];

    return (
        <div>
            <main className="p-4">
                <section className="mb-6">
                    {isLoading && <p className="text-text">Loading...</p>}
                    {error && <p className="text-red-500">Failed to load recent orders.</p>}
                    {orders && (
                        <Table
                            columns={columns}
                            data={orders}
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={onPageChange}
                        />
                    )}
                </section>
            </main>
        </div>
    );
};

export default AllOrderTable;
