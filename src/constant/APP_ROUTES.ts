const BASE_ROUTES = {
  PROJECTS: "/projects",
  ORDERS: "/orders",
};
const DASHBOARDS = {
  PROJECT: `${BASE_ROUTES.PROJECTS}-dashboard`,
  ORDER: `${BASE_ROUTES.ORDERS}-dashboard`,
};

export const APP_ROUTES = {
  APP: {
    HOME: "/",
    HOME_ALIAS: "/dashboard",
    PROJECTS: {
      LIST: `${BASE_ROUTES.PROJECTS}`, // Page to list all projects
      DETAILS: `${BASE_ROUTES.PROJECTS}/:projectId`, // Specific project details
      ISSUES: `${BASE_ROUTES.PROJECTS}/:projectId/issues`, // Issues for a project
      DOCUMENTS: `${BASE_ROUTES.PROJECTS}/:projectId/documents`, // Documents for a project
      INFO: `${BASE_ROUTES.PROJECTS}/:projectId/info`, // Project Info page
      CREATE: `${BASE_ROUTES.PROJECTS}/create`,
      EDIT: `${BASE_ROUTES.PROJECTS}/edit`,
    },
    PROFILE: "/profile", // Common for all roles
  },
  AUTH: {
    SIGN_IN: "/auth/sign-in", // Login route
    FORGOT_PASSWORD: "/auth/forgot-password", // Password recovery
  },
  ADMIN: {
    ADD_PROJECT: `${BASE_ROUTES.PROJECTS}/add`, // Admin-specific action
    ADD_ORDER: `${BASE_ROUTES.ORDERS}/add`, // Admin-specific action
  },
  SUPERADMIN: {
    USER_MANAGEMENT: "/user-management", // Superadmin-specific action
  },
  WORKER: {
    MY_TASKS: "/my-tasks", // Worker-specific tasks
  },
  DASHBOARDS: {
    PROJECT: DASHBOARDS.PROJECT, // Project-specific dashboard
    ORDER: DASHBOARDS.ORDER, // Order-specific dashboard
  },
  NOT_FOUND: "*", // Fallback for undefined routes
};
