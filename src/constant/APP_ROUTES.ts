const BASE_ROUTES = {
  PROJECTS: "/projects",
  ORDERS: "/orders",
  USERS: "/users",
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
      ARCHIVED: `${BASE_ROUTES.PROJECTS}/archived`,
      ALL: `${BASE_ROUTES.PROJECTS}/all`,
      EXCEL_VIEWER: `${BASE_ROUTES.PROJECTS}/excel-viewer`,
      PDF_VIEWER: `${BASE_ROUTES.PROJECTS}/pdf-viewer`,
      ALL_ISSUES: `${BASE_ROUTES.PROJECTS}/all-issues`
    },
    ORDERS: {
      LIST: `${BASE_ROUTES.ORDERS}`, // Page to list all projects
      DETAILS: `${BASE_ROUTES.ORDERS}/:orderId`, // Specific project details
      CREATE: `${BASE_ROUTES.ORDERS}/create`,
      EDIT: `${BASE_ROUTES.ORDERS}/edit`,
      ARCHIVED: `${BASE_ROUTES.ORDERS}/archived`,
      ALL: `${BASE_ROUTES.ORDERS}/all`,
    },
    PROFILE: "/profile", // Common for all roles
    COMPANY: "/company",
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
    USERS: {
      MANAGEMENT: `${BASE_ROUTES.USERS}/management`,
      CREATE: `${BASE_ROUTES.USERS}/create`,
    },
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
