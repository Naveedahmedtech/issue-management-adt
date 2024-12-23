import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import LeftSidebar from "./components/LeftSidebar";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768); // Open on larger screens by default

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Hide sidebar initially on small screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex h-screen bg-background relative">
            {/* Sidebar Toggle Button with Label and Icon */}
            <button
                onClick={toggleSidebar}
                className={`flex items-center space-x-2 p-2 text-text fixed top-4 z-50 bg-backgroundShade1 rounded-full shadow-md transition-all duration-500 ${isSidebarOpen ? "left-40" : "left-4"
                    }`}
            >
                {isSidebarOpen ? <FaChevronLeft size={20} /> : <FaChevronRight size={20} />}
            </button>

            {/* Sidebar Container with Smooth Animation */}
            {isSidebarOpen && (
                <div
                    className="w-60 transition-transform duration-500 ease-in-out absolute md:relative z-10"
                >
                    <LeftSidebar toggleSidebar={toggleSidebar} />
                </div>
            )}

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col overflow-auto mt-10 ${isSidebarOpen ? "ml-6" : "ml-0"} transition-all duration-500`}>
                <div className="py-4 px-2 pt-24 md:pt-12 custom-scrollbar">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Header;
