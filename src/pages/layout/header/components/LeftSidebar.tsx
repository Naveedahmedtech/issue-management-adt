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

interface LeftSidebarProps {
  toggleSidebar: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ toggleSidebar }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  // ✅ Use the project list query
  const { data: projectList, isLoading: isProjectsLoading } = useGetProjectListQuery({
    page: 1,
    limit: 10,
  });

  // ✅ Filter links based on role
  const { userData: { role } } = userData;
  const filteredLinks = staticLinks.filter((link) => link.roles.includes(role));

  // ✅ Dynamically add projects to the "Projects" dropdown
  const projectLinks = projectList?.data?.projects?.map((project:any) => ({
    url: APP_ROUTES.APP.PROJECTS.DETAILS.replace(":projectId", project.id),
    text: project.title,
    Icon: FaClipboard,
  })) || [];

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

  return (
    <div className="flex flex-col justify-between h-screen bg-backgroundShade1 p-4 z-50">
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
              <div className="ml-6 mt-2 space-y-2">
                {link.subLinks.map((subLink, subIndex) => (
                  <Link
                    key={subIndex}
                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
                      location.pathname === subLink.url ? "bg-backgroundShade2" : "hover:bg-backgroundShade2"
                    }`}
                    to={subLink.url}
                    onClick={() => {
                      if (!isLargeScreen) toggleSidebar();
                    }}
                  >
                    {subLink.Icon && <subLink.Icon className="text-base" />}
                    <span className="text-sm text-text">{subLink.text}</span>
                  </Link>
                ))}

                {/* ✅ Add dynamically loaded project links */}
                {isProjectsLoading ? (
                  <p className="text-sm text-text">Loading projects...</p>
                ) : (
                  projectLinks.map((project:any, projectIndex:any) => (
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
                  ))
                )}
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
