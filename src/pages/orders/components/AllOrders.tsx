import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { APP_ROUTES } from "../../../constant/APP_ROUTES";
import { ORDER_STATUS } from "../../../constant";
import PaginatedCardList from "../../../components/PaginatedCardList";

interface Order {
    id: string;
    name: string;
    status: string;
    startDate?: string;
    endDate?: string;
}

const AllOrdersCards: React.FC<{ orders: any, error?: any, isLoading: boolean, totalPages: number, currentPage: number, onPageChange?: (e: number) => void; }> = ({ orders, error, isLoading, totalPages, currentPage, onPageChange }) => {

    const navigate = useNavigate();

    const getStatusBadge = (status: string) => {
        let color = "bg-gray-500";
        switch (status?.toUpperCase()) {
            case ORDER_STATUS.COMPLETED.toUpperCase():
                color = "bg-success text-white";
                break;
            case ORDER_STATUS.IN_PROGRESS.toUpperCase():
                color = "bg-todo text-white";
                break;
            case ORDER_STATUS.PENDING.toUpperCase():
                color = "bg-pending text-white";
                break;
            default:
                color = "bg-gray-500 text-white";
        }
        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{status}</span>;
    };

    const renderOrderCard = (order: Order) => (
        <div
            key={order.id}
            className="border border-border rounded-lg p-4 shadow-lg bg-background hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => navigate(APP_ROUTES.APP.ORDERS.DETAILS.replace(":orderId", order.id))}
        >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-bold text-text">{order.name}</h3>
                <div>{getStatusBadge(order.status)}</div>
            </div>

            {/* Card Content */}
            <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-textSecondary">
                    <span className="font-medium">Start Date:</span>{" "}
                    {order.startDate ? format(new Date(order.startDate), 'PP') : "N/A"}
                </p>
                <p className="text-sm text-textSecondary">
                    <span className="font-medium">End Date:</span>{" "}
                    {order.endDate ? format(new Date(order.endDate), 'PP') : "N/A"}
                </p>
            </div>

            {/* Card Footer */}
            <div className="mt-2">
                <Link
                    to={APP_ROUTES.APP.ORDERS.DETAILS.replace(":order", order.id)}
                    className="inline-flex items-center text-primary font-semibold hover:text-hover transition-colors duration-300"
                >
                    <span>View Order</span>
                    <span className="ml-2">→</span>
                </Link>
            </div>
        </div>
    );

    return (
        <div>
            <main className="">
                <section className="mb-8">
                    {error && <p className="text-error text-lg font-semibold">Failed to load recent orders.</p>}
                    {isLoading ? <p className="text-text text-lg">Loading...</p> :  orders?.length > 0 ? (
                        <PaginatedCardList
                            data={orders}
                            renderCard={renderOrderCard}
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={onPageChange}
                        />
                    )
                        : (
                            <div className="text-center p-6 bg-backgroundShade1 border border-border rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-textSecondary">No orders found</h3>
                            </div>
                        )
                    }
                </section>
            </main>
        </div>
    );
};

export default AllOrdersCards;
