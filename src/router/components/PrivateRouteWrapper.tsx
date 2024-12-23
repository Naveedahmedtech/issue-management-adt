import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import PageLoader from '../../components/PageLoader';
import { useLogoutMutation } from '../../redux/features/authApi';
import { apiFetch } from '../../server/api';
import { APP_ROUTES } from '../../constant/APP_ROUTES';

const PrivateRouteWrapper = () => {
    const { userData, updateToken } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [logout] = useLogoutMutation();

    const fetchUserData = async () => {
        try {
            const data = await apiFetch('users/by-token', {
                method: 'GET',
            });
            if (data?.result) {
                updateToken({ isLoggedIn: true, userData: data.result });
            } else {
                updateToken({ isLoggedIn: false });
            }
        } catch (error) {
            console.error('Error while fetching user data:', error);
            updateToken({ isLoggedIn: false });

            if (error instanceof Error && error.message.includes('404')) {
                // Call logout mutation and wait for it to complete using unwrap
                await logout({}).unwrap().catch(logoutError => {
                    console.error('Error during logout:', logoutError);
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchUserData();
    }, []);

    if (isLoading) {
        return <PageLoader />;
    }

    if (!userData?.isLoggedIn) {
        return <Navigate to={APP_ROUTES.AUTH.SIGN_IN} />;
    }

    return <Outlet />;
};

export default PrivateRouteWrapper;
