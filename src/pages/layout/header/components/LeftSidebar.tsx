import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_NAME } from "../../../../constant/BASE_URL";
import Text from "../../../../components/Text";
import IconLink from "./IconLink";
import { links } from "../utils/navLinks";
import { useLogoutMutation } from "../../../../redux/features/authApi";
import { APP_ROUTES } from "../../../../constant/APP_ROUTES";
// import { useAuth } from "../../../../hooks/useAuth";
import { FaSignOutAlt } from "react-icons/fa";
import ModalContainer from "../../../../components/modal/ModalContainer.tsx";
import Button from "../../../../components/buttons/Button.tsx";

interface LeftSidebarProps {
    toggleSidebar: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ toggleSidebar }) => {
    // const { userData } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [logout, { isLoading }] = useLogoutMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const userRole = userData?.userData?.role || "ADMIN";

    const handleLogout = async () => {
        try {
            await logout({}).unwrap();
            navigate(APP_ROUTES.AUTH.SIGN_IN);
        } catch (error) {
            console.error("Failed to logout:", error);
        } finally {
            setIsModalOpen(false); // Close the modal after logout
        }
    };

    const handleHome = () => {
        navigate(APP_ROUTES.APP.HOME_ALIAS);
    };

    // const accessibleLinks = links.filter((link) => link.roles.includes(userRole));

    return (
        <div
            className={`flex flex-col justify-between h-screen transition-all duration-300 bg-backgroundShade1 p-4 z-50`}
        >
            <div className="flex items-center justify-between mb-6">
                <Text
                    className="text-2xl lg:text-xl text-text font-normal cursor-pointer"
                    onClick={handleHome}
                >
                    {APP_NAME}
                </Text>
            </div>

            <div className="flex flex-col flex-grow space-y-4">
                {links.map((link, index) => (
                    <IconLink
                        key={index}
                        url={link.url}
                        Icon={link.Icon}
                        text={link.text}
                        className={link.className}
                        isActive={location.pathname === link.url}
                        onClick={toggleSidebar}
                    />
                ))}
            </div>

            <button
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center space-x-2 mt-auto p-2 rounded-lg transition-all duration-300 text-text hover:bg-backgroundShade2 ${
                    isLoading ? "opacity-50" : ""
                }`}
                disabled={isLoading}
            >
                <FaSignOutAlt className="text-2xl" />
                <span className="hidden lg:block">Logout</span>
            </button>

            {/* Logout Confirmation Modal */}
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
                    <Button text={"Cancel"} onClick={() => setIsModalOpen(false)}  />
                    <Button text={"Logout"} onClick={handleLogout} isSubmitting={isLoading} />
                </div>
            </ModalContainer>
        </div>
    );
};

export default LeftSidebar;