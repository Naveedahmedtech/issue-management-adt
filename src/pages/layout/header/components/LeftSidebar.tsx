import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {APP_NAME} from "../../../../constant/BASE_URL";
import Text from "../../../../components/Text";
import {links} from "../utils/navLinks";
import {FaChevronDown, FaChevronRight, FaSignOutAlt} from "react-icons/fa";
import {APP_ROUTES} from "../../../../constant/APP_ROUTES";
import ModalContainer from "../../../../components/modal/ModalContainer.tsx";
import Button from "../../../../components/buttons/Button.tsx";
import {updateUserData} from "../../../../redux/features/authSlice.ts";
import {useDispatch} from "react-redux";
import {useAuth} from "../../../../hooks/useAuth.ts";
import {useLogoutMutation} from "../../../../redux/features/authApi.ts";

interface LeftSidebarProps {
  toggleSidebar: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(true);
  const dispatch = useDispatch();
  const { userData } = useAuth();
  const [logout, { isLoading }] = useLogoutMutation();

  const { userData: { role } } = userData;
  const filteredLinks = links.filter((link) => link.roles.includes(role));

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
      await logout({}).unwrap();
      dispatch(updateUserData({ isLoggedIn: false }));
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
            to={APP_ROUTES.DASHBOARDS.PROJECT}
            className="flex items-center justify-between mb-6 cursor-pointer"
            onClick={() => {
              if (!isLargeScreen) toggleSidebar();
            }}
        >
          <div className="w-full">
            <Text className="text-2xl lg:text-xl text-primary font-bold">
              {APP_NAME}
            </Text>
          </div>
        </Link>

        <div className="flex flex-col flex-grow space-y-2">
          {filteredLinks.map((link, index) => (
              <div key={index} className="w-full">
                <div
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${location.pathname === link.url ? "bg-backgroundShade2" : "hover:bg-backgroundShade2"
                    }`}
                    onClick={() => {
                      if (link.isDropdown) {
                        toggleDropdown(link.url);
                      }
                    }}
                >
                  {link.isDropdown ? (
                      <div className="flex items-center space-x-2 w-full">
                        {link.Icon && <link.Icon className="text-lg" />}
                        <span className="text-text text-lg">{link.text}</span>
                      </div>
                  ) : (
                      <Link
                          to={link.url}
                          className="flex items-center space-x-2 w-full"
                          onClick={() => {
                            if (!isLargeScreen) toggleSidebar();
                          }}
                      >
                        {link.Icon && <link.Icon className="text-lg" />}
                        <span className="text-text text-lg">{link.text}</span>
                      </Link>
                  )}
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
                              className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${location.pathname === subLink.url
                                  ? "bg-backgroundShade2"
                                  : "hover:bg-backgroundShade2"
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
                    </div>
                )}
              </div>
          ))}
        </div>

        <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 mt-auto p-2 rounded-lg transition-all duration-300 text-text hover:bg-backgroundShade2"
        >
          <FaSignOutAlt className="text-2xl" />
          <span className="hidden lg:block">Logout</span>
        </button>

        <ModalContainer
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Confirm Logout"
        >
          <p className="text-text">
            Are you sure you want to log out? You will need to sign in again to access your account.
          </p>
          <div className="flex justify-end mt-4 space-x-4">
            <Button
                text="Logout"
                onClick={handleLogout}
                preview="danger"
                fullWidth={false}
                isSubmitting={isLoading}
            />
          </div>
        </ModalContainer>
      </div>
  );
};

export default LeftSidebar;
