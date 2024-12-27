import React, { useState } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { APP_NAME } from "../../../../constant/BASE_URL";
import Text from "../../../../components/Text";
import { links } from "../utils/navLinks";
import { FaChevronDown, FaChevronRight, FaSignOutAlt } from "react-icons/fa";
// import { useLogoutMutation } from "../../../../redux/features/authApi";
import { APP_ROUTES } from "../../../../constant/APP_ROUTES";
import ModalContainer from "../../../../components/modal/ModalContainer.tsx";
import Button from "../../../../components/buttons/Button.tsx";
import {updateUserData} from "../../../../redux/features/authSlice.ts";
import {useDispatch} from "react-redux";

interface LeftSidebarProps {
    toggleSidebar: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // const [logout, { isLoading }] = useLogoutMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            // await logout({}).unwrap();
            dispatch(updateUserData({ isLoggedIn: false }));

            navigate(APP_ROUTES.AUTH.SIGN_IN);
        } catch (error) {
            console.error("Failed to logout:", error);
        } finally {
            setIsModalOpen(false);
        }
    };

    const handleHome = () => {
        navigate(APP_ROUTES.APP.HOME_ALIAS);
    };

    const toggleDropdown = (url: string) => {
        setOpenDropdown(openDropdown === url ? null : url);
    };

    return (
        <div className="flex flex-col justify-between h-screen bg-backgroundShade1 p-4 z-50">
            <div className="flex items-center justify-between mb-6">
                <Text
                    className="text-2xl lg:text-xl text-text font-normal cursor-pointer"
                    onClick={handleHome}
                >
                    {APP_NAME}
                </Text>
            </div>

            <div className="flex flex-col flex-grow space-y-2">
                {links.map((link, index) => (
                    <div key={index} className="w-full">
                        {/* Parent Link */}
                        <div
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                                location.pathname === link.url ? "bg-backgroundShade2" : "hover:bg-backgroundShade2"
                            }`}
                            onClick={() => (link.isDropdown && toggleDropdown(link.url))}
                        >
                            <Link to={link.isDropdown ? "#" : link.url} className="flex items-center space-x-2">
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

                        {/* Sub links */}
                        {link.isDropdown && openDropdown === link.url && (
                            <div className="ml-6 mt-2 space-y-2">
                                {link.subLinks.map((subLink, subIndex) => (
                                    <Link
                                        key={subIndex}
                                        className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
                                            location.pathname === subLink.url
                                                ? "bg-backgroundShade2"
                                                : "hover:bg-backgroundShade2"
                                        }`}
                                        to={subLink.url}
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

            {/* Logout Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center space-x-2 mt-auto p-2 rounded-lg transition-all duration-300 text-text hover:bg-backgroundShade2`}
                // className={`flex items-center space-x-2 mt-auto p-2 rounded-lg transition-all duration-300 text-text hover:bg-backgroundShade2 ${
                //     isLoading ? "opacity-50" : ""
                // }`}
                // disabled={isLoading}
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
                    Are you sure you want to log out? You will need to sign in again to access your account.
                </p>
                <div className="flex justify-end mt-4 space-x-4">
                    <Button text={"Cancel"} onClick={() => setIsModalOpen(false)} preview={'secondary'} fullWidth={false} />
                    <Button text={"Logout"} onClick={handleLogout}
                            // isSubmitting={isLoading}
                            preview={'danger'} fullWidth={false}  />
                </div>
            </ModalContainer>
        </div>
    );
};

export default LeftSidebar;
