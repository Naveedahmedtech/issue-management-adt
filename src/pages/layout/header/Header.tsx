import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import LeftSidebar from "./components/LeftSidebar";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import ScrollToTop from "../../../components/ScrollToTop";
// import ThemeToggle from "../../../components/ThemeToggle.tsx";

const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768); // Open on larger screens by default
    const scrollRef = useRef<HTMLDivElement>(null);
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
                className={`flex items-center space-x-2 p-2 text-text fixed top-4  bg-backgroundShade1 rounded-full shadow-md  z-[10000]  transition-all duration-500
                 ${isSidebarOpen ? "left-[230px]" : "left-4"
                    }`}
            >
                {isSidebarOpen ? <FaChevronLeft size={20} /> : <FaChevronRight size={20} />}
            </button>

            {/* Sidebar Container with Smooth Animation */}
            {isSidebarOpen && (
                <div
                    className="w-[270px] transition-transform duration-500 ease-in-out absolute md:relative z-[1000]"
                >
                    <LeftSidebar toggleSidebar={toggleSidebar} />
                </div>
            )}

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col overflow-auto mt-10 ${isSidebarOpen ? "ml-6" : "ml-0"} transition-all duration-500`}>
                <div ref={scrollRef} className="custom-scrollbar">
                    <ScrollToTop refEl={scrollRef} />
                    <Outlet />
                </div>
            </div>
            {/* <ThemeToggle /> */}
        </div>
    );
};

export default Header;
