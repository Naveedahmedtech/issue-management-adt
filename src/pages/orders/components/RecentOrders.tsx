import React from "react";
import { Link } from "react-router-dom";
import Table from "../../../components/Table";
import { format } from "date-fns";
import { APP_ROUTES } from "../../../constant/APP_ROUTES";

const RecentOrders: React.FC<any> = ({ recentOrders, error, isLoading }) => {

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
            id: "name",
            label: "Name",
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
            render: (row: any) => <span>{format(new Date(row.startDate), 'PP')}</span>,
        },
        {
            id: "endDate",
            label: "End Date",
            render: (row: any) => <span>{format(new Date(row.endDate), 'PP')}</span>,
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
                    <h3 className="text-xl font-semibold text-text mb-4">Recent Orders</h3>
                    {isLoading && <p className="text-text">Loading...</p>}
                    {error && <p className="text-red-500">Failed to load recent orders.</p>}
                    {recentOrders && recentOrders.data && (
                        <Table columns={columns} data={recentOrders.data.orders} />
                    )}
                </section>
            </main>
        </div>
    );
};

export default RecentOrders;
