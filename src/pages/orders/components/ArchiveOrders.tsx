import React from "react";
import { Link } from "react-router-dom";
import Table from "../../../components/Table";
import { APP_ROUTES } from "../../../constant/APP_ROUTES";

const ArchiveOrders: React.FC<any> = ({
    orders,
    error,
    isLoading,
    currentPage,
    totalPages,
    handlePageChange
}) => {

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
            id: "description",
            label: "Order Description",
            render: (row: any) => <span>{row?.description?.slice(0, 20)}</span>,
        },
        {
            id: "status",
            label: "Status",
            render: (row: any) => getStatusBadge(row.status),
        },
        {
            id: "action",
            label: "Action",
            render: (row: any) => (
                <Link
                    to={APP_ROUTES.APP.ORDERS.DETAILS.replace(":orderId", row.id)}
                    className="text-primary underline hover:text-primary-dark"
                    state={
                        { archive: true }
                    }
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
                    <h3 className="text-xl font-semibold text-text mb-4">Archived Orders</h3>
                    {isLoading && <p className="text-text">Loading...</p>}
                    {error && <p className="text-red-500">Failed to load archived orders.</p>}
                    {orders && (
                        <Table
                            columns={columns}
                            data={orders}
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

export default ArchiveOrders;
