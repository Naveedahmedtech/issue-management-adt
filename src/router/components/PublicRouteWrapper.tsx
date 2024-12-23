import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import PageLoader from '../../components/PageLoader';
import { useLogoutMutation } from '../../redux/features/authApi';
import { apiFetch } from '../../server/api';
import { APP_ROUTES } from '../../constant/APP_ROUTES';

const PublicRouteWrapper = () => {
    const { userData, updateToken } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [logout] = useLogoutMutation();

    // const fetchCsrfToken = async () => {
    //     try {
    //         await apiFetch('csrf-token', { method: 'GET' });
    //     } catch (error) {
    //         console.error('Error while fetching CSRF token:', error);
    //     }
    // };

    const fetchUserData = async () => {
        try {
            const data = await apiFetch('users/by-token', { method: 'GET' });
            if (data?.result) {
                updateToken({ isLoggedIn: true, userData: data.result });
            } else {
                updateToken({ isLoggedIn: false });
            }
        } catch (error) {
            console.error('Error while fetching user data:', error);
            updateToken({ isLoggedIn: false });
            await logout({}).unwrap().catch(logoutError => {
                console.error('Error during logout:', logoutError);
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            setIsLoading(true);
            // await fetchCsrfToken(); 
            await fetchUserData(); 
        };
        initialize();
    }, []);

    if (isLoading) {
        return <PageLoader />;
    }

    if (!userData?.isLoggedIn) {
        return <Outlet />;
    } else {
        return <Navigate to={APP_ROUTES.APP.HOME}/>;
    }
};

export default PublicRouteWrapper;
