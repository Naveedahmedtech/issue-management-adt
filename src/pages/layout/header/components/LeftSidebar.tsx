import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { links } from "../utils/navLinks";
import { FaChevronDown, FaChevronRight, FaSignOutAlt } from "react-icons/fa";
import { APP_ROUTES } from "../../../../constant/APP_ROUTES";
import ModalContainer from "../../../../components/modal/ModalContainer.tsx";
import Button from "../../../../components/buttons/Button.tsx";
import { updateUserData } from "../../../../redux/features/authSlice.ts";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../../hooks/useAuth.ts";
import { useLogoutMutation } from "../../../../redux/features/authApi.ts";
import logo from "../../../../assets/images/logo2.png";

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

  // Adjust if your auth shape differs
  const {
    userData: { role },
  } = userData;

  const filteredLinks = links.filter((link) => link.roles.includes(role));

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock background scroll on small screens while the sidebar is visible
  useEffect(() => {
    if (!isLargeScreen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isLargeScreen]);

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

  // Prevent scroll/touch/click from bubbling to an overlay that might close the drawer
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <div
      className="
        relative flex flex-col
        h-[100dvh] max-h-[100dvh]
        bg-backgroundShade1 p-4 z-50
        overflow-hidden
      "
      onClick={stop}
      onMouseDown={stop}
      onTouchStart={stop}
      onTouchMove={stop}
      onWheel={stop}
      style={{ touchAction: "pan-y" }}
    >
      <Link
        to={APP_ROUTES.DASHBOARDS.PROJECT}
        className="cursor-pointer mb-6 shrink-0"
        onClick={() => {
          if (!isLargeScreen) toggleSidebar();
        }}
      >
        <img src={logo} alt="Viewsoft" className="w-40" />
      </Link>

      {/* Scrollable nav area */}
      <div
        className="
          flex flex-col gap-2 flex-1 min-h-0
          overflow-y-auto overscroll-contain touch-pan-y pr-1
          pb-24
        "
      >
        {filteredLinks.map((link, index) => (
          <div key={index} className="w-full">
            <div
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                location.pathname === link.url ? "bg-hover" : "hover:bg-hover"
              }`}
              onClick={() => {
                if (link.isDropdown) toggleDropdown(link.url);
              }}
            >
              {link.isDropdown ? (
                <div className="flex items-center space-x-2 w-full">
                  {link.Icon && <link.Icon className="text-base" />}
                  <span className="text-text text-base">{link.text}</span>
                </div>
              ) : (
                <Link
                  to={link.url}
                  className="flex items-center space-x-2 w-full"
                  onClick={() => {
                    if (!isLargeScreen) toggleSidebar();
                  }}
                >
                  {link.Icon && <link.Icon className="text-base" />}
                  <span className="text-text text-base">{link.text}</span>
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
                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
                      location.pathname === subLink.url
                        ? "bg-hover"
                        : "hover:bg-hover"
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

      {/* Footer pinned to bottom of the sidebar */}
      <div
        className="
          absolute bottom-0 left-0 right-0
          bg-backgroundShade1
          border-t border-white/10
          px-4 py-2
        "
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 text-text hover:bg-hover"
        >
          <FaSignOutAlt className="text-2xl" />
          <span className="hidden lg:block">Logout</span>
        </button>
      </div>

      <ModalContainer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Logout"
      >
        <p className="text-text">
          Are you sure you want to log out? You will need to sign in again to
          access your account.
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
