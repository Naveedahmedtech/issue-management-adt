import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import PrivateRouteWrapper from './components/PrivateRouteWrapper';
import PublicRouteWrapper from './components/PublicRouteWrapper';
import { Header } from '../pages/layout';
import { ForgotPassword, SignIn } from '../pages/auth';
import {
    CreateProject,
    EditProject,
    NotFound,
    PROFJECT_Dashboard,
    ProjectDetails
} from '../pages';
import { APP_ROUTES } from '../constant/APP_ROUTES';
import ErrorBoundary from "../ErrorBoundry.tsx";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<PrivateRouteWrapper />}>
                <Route path={APP_ROUTES.APP.HOME} element={<Header />} >
                    <Route index element={<PROFJECT_Dashboard />} errorElement={<ErrorBoundary />} />
                    <Route path={APP_ROUTES.DASHBOARDS.PROJECT} element={<PROFJECT_Dashboard />} errorElement={<ErrorBoundary />} />
                    <Route path={APP_ROUTES.APP.PROJECTS.DETAILS} element={<ProjectDetails />} errorElement={<ErrorBoundary />} />
                    <Route path={APP_ROUTES.APP.PROJECTS.CREATE} element={<CreateProject />} errorElement={<ErrorBoundary />} />
                    <Route path={`${APP_ROUTES.APP.PROJECTS.EDIT}/:projectId`} element={<EditProject />} errorElement={<ErrorBoundary />} />
                </Route>
            </Route>
            <Route element={<PublicRouteWrapper />}>
                <Route path={APP_ROUTES.AUTH.SIGN_IN} element={<SignIn />} errorElement={<ErrorBoundary />} />
                <Route path={APP_ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} errorElement={<ErrorBoundary />} />
            </Route>
            <Route path={APP_ROUTES.NOT_FOUND} element={<NotFound />} errorElement={<ErrorBoundary />} />
        </>
    )
);
