import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { APP_NAME } from "../../../../constant/BASE_URL";
import Text from "../../../../components/Text";
import { links as staticLinks } from "../utils/navLinks";
import { FaChevronDown, FaChevronRight, FaSignOutAlt, FaClipboard } from "react-icons/fa";
import { APP_ROUTES } from "../../../../constant/APP_ROUTES";
import ModalContainer from "../../../../components/modal/ModalContainer.tsx";
import Button from "../../../../components/buttons/Button.tsx";
import { updateUserData } from "../../../../redux/features/authSlice.ts";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../../../../redux/features/authApi.ts";
import { useAuth } from "../../../../hooks/useAuth.ts";
import { useGetProjectListQuery } from "../../../../redux/features/projectsApi.ts";
import { useGetOrderListQuery } from "../../../../redux/features/orderApi.ts";

interface LeftSidebarProps {
  toggleSidebar: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ toggleSidebar }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(true);
  const [currentProjectPage, setCurrentProjectPage] = useState<number>(1);
  const [currentOrderPage, setCurrentOrderPage] = useState<number>(1);
  const [projectLinks, setProjectLinks] = useState<any[]>([]);
  const [orderLinks, setOrderLinks] = useState<any[]>([]);

  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const {
    data: projectList,
    isFetching: isProjectsFetching,
    refetch: refetchProjects
  } = useGetProjectListQuery({ page: currentProjectPage, limit: 5 });

  const {
    data: orderList,
    isFetching: isOrdersFetching,
    refetch: refetchOrders
  } = useGetOrderListQuery({ page: currentOrderPage, limit: 5 });

  // Filter links based on role
  const { userData: { role } } = userData;
  const filteredLinks = staticLinks.filter((link) => link.roles.includes(role));

  // Add unique projects to the state
  useEffect(() => {
    if (projectList?.data?.projects) {
      const updatedProjects = projectList.data.projects.map((project: any) => ({
        url: APP_ROUTES.APP.PROJECTS.DETAILS.replace(":projectId", project.id),
        text: project.title,
        Icon: FaClipboard,
      }));
      setProjectLinks(updatedProjects);
    }
  }, [projectList]);

  // Add unique orders to the state
  useEffect(() => {
    if (orderList?.data?.orders) {
      const updatedOrders = orderList.data.orders.map((order: any) => ({
        url: APP_ROUTES.APP.ORDERS.DETAILS.replace(":orderId", order.id),
        text: order.name,
        Icon: FaClipboard,
      }));
      setOrderLinks(updatedOrders);
    }
  }, [orderList]);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout({}).unwrap().catch((logoutError) => {
        console.error("Error during logout:", logoutError);
      });
      dispatch(updateUserData({ isLoggedIn: false, data: [] }));
      navigate(APP_ROUTES.AUTH.SIGN_IN);
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const toggleDropdown = (url: string) => {
    setOpenDropdown(openDropdown === url ? null : url);
  };

  const loadMoreProjects = () => {
    navigate(APP_ROUTES.APP.PROJECTS.ALL)
  };

  const loadMoreOrders = () => {
    navigate(APP_ROUTES.APP.ORDERS.ALL)
  };

  const showLessProjects = () => {
    setCurrentProjectPage(1);
    setProjectLinks((prevProjects) => prevProjects.slice(0, 5));
    refetchProjects();
  };

  const showLessOrders = () => {
    setCurrentOrderPage(1);
    setOrderLinks((prevOrders) => prevOrders.slice(0, 5));
    refetchOrders();
  };

  return (
    <div className="flex flex-col justify-between h-screen overflow-auto bg-backgroundShade1 p-4 z-50">
      <Link
        to={APP_ROUTES.APP.HOME_ALIAS}
        className="flex items-center justify-between mb-6 cursor-pointer"
        onClick={() => {
          if (!isLargeScreen) toggleSidebar();
        }}
      >
        <div className="w-full">
          <Text className="text-2xl lg:text-xl text-text font-normal">{APP_NAME}</Text>
        </div>
      </Link>

      <div className="flex flex-col flex-grow space-y-2">
        {filteredLinks.map((link, index) => (
          <div key={index} className="w-full">
            <div
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                location.pathname === link.url ? "bg-backgroundShade2" : "hover:bg-backgroundShade2"
              }`}
              onClick={() => {
                if (link.isDropdown) toggleDropdown(link.url);
                if (!link.isDropdown && !isLargeScreen) toggleSidebar();
              }}
            >
              <Link
                to={link.isDropdown ? "#" : link.url}
                className="flex items-center space-x-2 w-full"
              >
                {link.Icon && <link.Icon className="text-lg" />}
                <span className="text-text text-lg">{link.text}</span>
              </Link>
              {link.isDropdown && (
                <div>
                  {openDropdown === link.url ? (
                    <FaChevronDown className="text-sm" />
                  ) : (
                    <FaChevronRight className="text-sm" />
                  )}
                </div>
              )}
            </div>

            {link.isDropdown && openDropdown === link.url && (
              <div className="ml-6 mt-2 space-y-2 max-h-64 overflow-y-auto">
                {link.text === "Projects" && projectLinks.map((project, projectIndex) => (
                  <Link
                    key={projectIndex}
                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
                      location.pathname === project.url ? "bg-backgroundShade2" : "hover:bg-backgroundShade2"
                    }`}
                    to={project.url}
                    onClick={() => {
                      if (!isLargeScreen) toggleSidebar();
                    }}
                  >
                    {project.Icon && <project.Icon className="text-base" />}
                    <span className="text-sm text-text">{project.text}</span>
                  </Link>
                ))}

                {link.text === "Orders" && orderLinks.map((order, orderIndex) => (
                  <Link
                    key={orderIndex}
                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
                      location.pathname === order.url ? "bg-backgroundShade2" : "hover:bg-backgroundShade2"
                    }`}
                    to={order.url}
                    onClick={() => {
                      if (!isLargeScreen) toggleSidebar();
                    }}
                  >
                    {order.Icon && <order.Icon className="text-base" />}
                    <span className="text-sm text-text">{order.text}</span>
                  </Link>
                ))}

                {currentProjectPage < projectList?.data?.totalPages && link.text === "Projects" && (
                  <button
                    onClick={loadMoreProjects}
                    className="text-sm text-primary mt-2 hover:underline"
                  >
                    Load More Projects
                  </button>
                )}

                {currentOrderPage < orderList?.data?.totalPages && link.text === "Orders" && (
                  <button
                    onClick={loadMoreOrders}
                    className="text-sm text-primary mt-2 hover:underline"
                  >
                    Load More Orders
                  </button>
                )}

                {currentProjectPage > 1 && link.text === "Projects" && (
                  <button
                    onClick={showLessProjects}
                    className="text-sm text-primary mt-2 hover:underline"
                  >
                    Show Less Projects
                  </button>
                )}

                {currentOrderPage > 1 && link.text === "Orders" && (
                  <button
                    onClick={showLessOrders}
                    className="text-sm text-primary mt-2 hover:underline"
                  >
                    Show Less Orders
                  </button>
                )}

                {isProjectsFetching && link.text === "Projects" && <p className="text-sm text-text">Loading more projects...</p>}
                {isOrdersFetching && link.text === "Orders" && <p className="text-sm text-text">Loading more orders...</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center space-x-2 mt-auto p-2 rounded-lg transition-all duration-300 text-text hover:bg-backgroundShade2`}
      >
        <FaSignOutAlt className="text-2xl" />
        <span className="hidden lg:block">Logout</span>
      </button>

      <ModalContainer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Logout"
      >
        <p className="text-text">Are you sure you want to log out? You will need to sign in again to access your account.</p>
        <div className="flex justify-end mt-4 space-x-4">
          <Button text={"Logout"} onClick={handleLogout} preview={"danger"} fullWidth={false} />
        </div>
      </ModalContainer>
    </div>
  );
};

export default LeftSidebar;
