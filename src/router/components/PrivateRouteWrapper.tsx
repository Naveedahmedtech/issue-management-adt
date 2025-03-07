import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import PageLoader from '../../components/PageLoader';
import { useLogoutMutation } from '../../redux/features/authApi';
import { apiFetch } from '../../server/api';
import { APP_ROUTES } from '../../constant/APP_ROUTES';
import {API_METHOD, API_ROUTES} from "../../constant/API_ROUTES.ts";


const PrivateRouteWrapper = () => {
    const { userData, updateToken } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [logout] = useLogoutMutation();
    
    const fetchUserData = async () => {
        try {
            const data = await apiFetch(API_ROUTES.USER.BY_TOKEN, {
                method: API_METHOD.GET,
            });
            if (data?.data) {
                updateToken({ isLoggedIn: true, userData: data.data });
            } else {
                updateToken({ isLoggedIn: false });
            }
        } catch (error) {
            console.error('Error while fetching user data:', error);
            updateToken({ isLoggedIn: false });
    
            if (error instanceof Error && error.message.includes('404')) {
                // logout mutation 
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
