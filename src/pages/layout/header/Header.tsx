import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LeftSidebar from "./components/LeftSidebar";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import ScrollToTop from "../../../components/ScrollToTop";

const Header = () => {
  const location = useLocation();

  // ✅ routes where sidebar should start closed
  const hideSidebarRoutes = ["/projects/pdf-viewer"];

  const shouldStartClosed = hideSidebarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(
    shouldStartClosed ? false : window.innerWidth >= 768
  );

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔑 when route changes, reset sidebar according to rules
  useEffect(() => {
    if (shouldStartClosed) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, shouldStartClosed]);

  return (
    <div className="flex h-screen bg-background relative">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`flex items-center space-x-2 p-2 text-text fixed top-4 bg-backgroundShade1 rounded-full shadow-md z-[100005] transition-all duration-500
          ${isSidebarOpen ? "left-[230px]" : "left-4"}`}
      >
        {isSidebarOpen ? <FaChevronLeft size={20} /> : <FaChevronRight size={20} />}
      </button>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-[270px] transition-transform duration-500 ease-in-out absolute md:relative z-[100001]">
          <LeftSidebar toggleSidebar={toggleSidebar} />
        </div>
      )}

      {/* Main Content */}
      <div
        id="scroll-container"
        className={`flex-1 flex flex-col overflow-auto mt-10 ${
          isSidebarOpen ? "ml-6" : "ml-0"
        } transition-all duration-500`}
      >
        <div className="custom-scrollbar">
          <ScrollToTop />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Header;
