import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import PrivateRouteWrapper from './components/PrivateRouteWrapper';
import PublicRouteWrapper from './components/PublicRouteWrapper';
import { Header } from '../pages/layout';
import { ForgotPassword, SignIn } from '../pages/auth';
import {
    ArchivedOrders,
    ArchivedProjects,
    CreateOrder,
    CreateProject, CreateUser, EditOrder,
    EditProject,
    NotFound, OrderDashboard, OrderDetails,
    ProjectDashboard,
    ProjectDetails, UserManagement
} from '../pages';
import { APP_ROUTES } from '../constant/APP_ROUTES';
import ErrorBoundary from "../ErrorBoundry.tsx";
import AnnotationIframe from '../mock/AnnotationIframe.tsx';

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<PrivateRouteWrapper />} errorElement={<ErrorBoundary />}>
                <Route path={APP_ROUTES.APP.HOME} element={<Header />} >
                    <Route index element={<ProjectDashboard />} errorElement={<ErrorBoundary />} />
                    <Route path={APP_ROUTES.DASHBOARDS.PROJECT} element={<ProjectDashboard />} errorElement={<ErrorBoundary />} />
                    <Route path={APP_ROUTES.APP.PROJECTS.DETAILS} element={<ProjectDetails />} errorElement={<ErrorBoundary />} />
                    <Route path={APP_ROUTES.APP.PROJECTS.CREATE} element={<CreateProject />} errorElement={<ErrorBoundary />} />
                    <Route path={`${APP_ROUTES.APP.PROJECTS.EDIT}/:projectId`} element={<EditProject />} errorElement={<ErrorBoundary />} />
                    <Route path={`${APP_ROUTES.SUPERADMIN.USERS.MANAGEMENT}`} element={<UserManagement />} errorElement={<ErrorBoundary />} />
                    <Route path={`${APP_ROUTES.SUPERADMIN.USERS.CREATE}`} element={<CreateUser />} errorElement={<ErrorBoundary />} />
                    <Route path={`${APP_ROUTES.DASHBOARDS.ORDER}`} element={<OrderDashboard />} errorElement={<ErrorBoundary />} />
                    <Route path={APP_ROUTES.APP.ORDERS.DETAILS} element={<OrderDetails />} errorElement={<ErrorBoundary />} />
                    <Route path={APP_ROUTES.APP.ORDERS.CREATE} element={<CreateOrder />} errorElement={<ErrorBoundary />} />
                    <Route path={`${APP_ROUTES.APP.ORDERS.EDIT}/:orderId`} element={<EditOrder />} errorElement={<ErrorBoundary />} />
                    <Route path={`${APP_ROUTES.APP.PROJECTS.ARCHIVED}`} element={<ArchivedProjects />} errorElement={<ErrorBoundary />} />
                    <Route path={`${APP_ROUTES.APP.ORDERS.ARCHIVED}`} element={<ArchivedOrders />} errorElement={<ErrorBoundary />} />
                    <Route path={`test`} element={<AnnotationIframe />} errorElement={<ErrorBoundary />} />
                </Route>
            </Route>
            <Route element={<PublicRouteWrapper />} errorElement={<ErrorBoundary />}>
                <Route path={APP_ROUTES.AUTH.SIGN_IN} element={<SignIn />} errorElement={<ErrorBoundary />} />
                <Route path={APP_ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} errorElement={<ErrorBoundary />} />
            </Route>
            <Route path={APP_ROUTES.NOT_FOUND} element={<NotFound />} errorElement={<ErrorBoundary />} />
        </>
    )
);
