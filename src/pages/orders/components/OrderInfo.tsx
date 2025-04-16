import React from "react";
import {FaBuilding, FaCalendarAlt, FaDollarSign, FaMapMarkerAlt, FaRegClock} from "react-icons/fa";
import {format} from "date-fns"; // Importing date-fns for formatting
import {OrderInfoProps} from "../../../types/types";

const OrderInfo: React.FC<OrderInfoProps> = ({ data, isLoading }) => {

    console.log("data", data);

    const getStatusBadge = (status: string) => {
        let badgeColor = "bg-yellow-500"; // Default color
        if (status?.toLocaleLowerCase() === "completed") badgeColor = "bg-success";
        if (status?.toLocaleLowerCase() === "in progress") badgeColor = "bg-pending";
        if (status?.toLocaleLowerCase() === "pending") badgeColor = "bg-todo";

        return (
            <span
                className={`inline-block px-3 py-1 text-sm text-white font-semibold rounded-md ${badgeColor}`}
            >
                {status}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="text-primary text-lg font-semibold">Loading order...</div>
            </div>
        );
    }

    const formatDate = (date: string | undefined) => {
        return date ? format(new Date(date), "MMM dd, yyyy") : "N/A";
    };

    return (
        <div className="p-6 bg-backgroundShade1 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-primary mb-4">{data.name}</h3>
            <p className="text-text text-lg mb-6">{data.description || ''}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                    <FaRegClock className="text-primary text-lg" />
                    <div>
                        <p className="text-sm text-textLight font-medium">Status</p>
                        {getStatusBadge(data.status)}
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <FaMapMarkerAlt className="text-primary text-lg" />
                    <div>
                        <p className="text-sm text-textLight font-medium">Location</p>
                        <p className="text-text font-medium">{data?.location || ""}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <FaBuilding className="text-primary text-lg" />
                    <div>
                        <p className="text-sm text-textLight font-medium">Company</p>
                        <p className="text-text font-medium">{data?.company?.name || ""}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <FaDollarSign className="text-primary text-lg" />
                    <div>
                        <p className="text-sm text-textLight font-medium">Price</p>
                        <p className="text-text font-medium">${data?.price?.toFixed(2) || "0.00"}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <FaCalendarAlt className="text-primary text-lg" />
                    <div>
                        <p className="text-sm text-textLight font-medium">Start Date</p>
                        <p className="text-text font-medium">{data?.startDate && formatDate(data?.startDate)}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <FaCalendarAlt className="text-primary text-lg" />
                    <div>
                        <p className="text-sm text-textLight font-medium">End Date</p>
                        <p className="text-text font-medium">{data?.endDate && formatDate(data?.endDate)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderInfo;
