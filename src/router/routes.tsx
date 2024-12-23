// src/routes.js
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import PrivateRouteWrapper from './components/PrivateRouteWrapper';
import PublicRouteWrapper from './components/PublicRouteWrapper';
import { Header } from '../pages/layout';
import { ForgotPassword, SignIn, Register, ResetPassword, VerifyResetCode } from '../pages/auth';
import {
    MYTaskPage,
    Dashboard,
    NotFound,
    Profile,
    UserManagement,
    ManagerTasks,
    AllTasksPage,
    TeamTask,
    TestingBoard
} from '../pages';
import { APP_ROUTES } from '../constant/APP_ROUTES';

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<PrivateRouteWrapper />}>
                <Route path={APP_ROUTES.APP.HOME} element={<Header />}>
                    <Route index element={<Dashboard />} />
                    <Route path={APP_ROUTES.APP.HOME_ALIAS} element={<Dashboard />} />
                    <Route path={APP_ROUTES.APP.MY_TASKS} element={<MYTaskPage />} />
                    <Route path={APP_ROUTES.APP.PROFILE} element={<Profile />} />
                    <Route path={APP_ROUTES.APP.USER_MANAGEMENT} element={<UserManagement />} />
                    <Route path={APP_ROUTES.APP.MANGER_TASKS} element={<ManagerTasks />} />
                    <Route path={APP_ROUTES.APP.ALL_TASKS} element={<AllTasksPage />} />
                    <Route path={APP_ROUTES.APP.TEAM_TASK} element={<TeamTask />} />
                </Route>
            </Route>
            <Route element={<PublicRouteWrapper />}>
                <Route path={APP_ROUTES.AUTH.REGISTER} element={<Register />} />
                <Route path={APP_ROUTES.AUTH.SIGN_IN} element={<SignIn />} />
                <Route path={APP_ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />
                <Route path={APP_ROUTES.AUTH.VERIFY_RESET_CODE} element={<VerifyResetCode />} />
                <Route path={APP_ROUTES.AUTH.RESET_PASSWORD} element={<ResetPassword />} />

                <Route path={APP_ROUTES.TESTING.BOARD} element={<TestingBoard />} />
            </Route>
            <Route path={APP_ROUTES.NOT_FOUND} element={<NotFound />} />
        </>
    )
);
