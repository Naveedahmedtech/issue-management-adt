import React from "react";
import { FaMapMarkerAlt,  FaRegClock } from "react-icons/fa";

interface OrderInfoProps {
    orderId: string | undefined;
}

const OrderInfo: React.FC<OrderInfoProps> = ({ orderId }) => {
    const order = {
        id: orderId,
        title: "Website Redesign",
        description: "Revamping the company website with a modern design.",
        status: "In Progress",
        location: "123 Main Street, Springfield, USA",
    };

    const getStatusBadge = (status: string) => {
        let badgeColor = "bg-yellow-500"; // Default color
        if (status === "Completed") badgeColor = "bg-success";
        if (status === "In Progress") badgeColor = "bg-pending";
        if (status === "Pending") badgeColor = "bg-todo";

        return (
            <span
                className={`inline-block px-3 py-1 text-sm text-white font-semibold rounded-md ${badgeColor}`}
            >
                {status}
            </span>
        );
    };

    return (
        <div className="p-6 bg-backgroundShade1 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-primary mb-4">{order.title}</h3>
            <p className="text-text text-lg mb-6">{order.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                    <FaRegClock className="text-primary text-lg" />
                    <div>
                        <p className="text-sm text-textLight font-medium">Status</p>
                        {getStatusBadge(order.status)}
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <FaMapMarkerAlt className="text-primary text-lg" />
                    <div>
                        <p className="text-sm text-textLight font-medium">Location</p>
                        <p className="text-text font-medium">{order.location}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderInfo;
