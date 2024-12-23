export const APP_ROUTES = {
  APP: {
    HOME: "/",
    HOME_ALIAS: "/dashboard",
    ALL_TASKS: "/all-tasks",
    MY_TASKS: "/my-tasks",
    PROFILE: "/profile",
    USER_MANAGEMENT: "/user-management",
    MANGER_TASKS: "/manager/:managerId/tasks",
    TEAM_TASK: "/team-task"
  },
  AUTH: {
    REGISTER: "/auth/register",
    SIGN_IN: "/auth/sign-in",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_RESET_CODE: "/auth/verify-reset-password-code",
    RESET_PASSWORD: "/auth/reset-password",
  },
  ADMIN: {
    ADD_USER: "/add-user",
    MANAGE_ROLES: "/manage-roles",
  },
  MANAGER: {
    ASSIGNED_TASKS: "/assigned-tasks",
    MY_TASKS: "/my-tasks",
  },
  TESTING: {
    BOARD: "testing/board",
  },
  NOT_FOUND: "*",
};
