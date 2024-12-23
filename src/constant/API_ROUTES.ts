const API_BASE = "/api/v1";
const AUTH_BASE = `${API_BASE}/auth`;
const USER_BASE = `${API_BASE}/users`;
const TASKS_BASE = `${API_BASE}/tasks`;
const CSRF_BASE = `${API_BASE}/csrf-token`;

export const API_ROUTES = {
  AUTH: {
    REGISTER: `${AUTH_BASE}/register`,
    LOGIN: `${AUTH_BASE}/sign-in`,
    LOGOUT: `${AUTH_BASE}/logout`,
    SEND_CODE: `${AUTH_BASE}/email/send-code`,
    VERIFY_CODE: `${AUTH_BASE}/verify-code`,
    RESET_PASSWORD: `${AUTH_BASE}/reset-password`,
    CHANGE_PASSWORD: `${AUTH_BASE}/reset-password`,
  },
  USER: {
    ROOT: `${USER_BASE}`,
    GET_USER: `${USER_BASE}/get`,
    ASSIGN_MANAGER: `${USER_BASE}/oversight`,
    GET_ASSIGN_TASK: `${USER_BASE}/manager`,
    GET_DASHBOARD_COUNT: `${USER_BASE}/dashboard/count`,
  },
  TASKS: {
    ROOT: `${TASKS_BASE}/`,
    BY_ID: `${TASKS_BASE}`,
    USER_TASK_COUNT: `${TASKS_BASE}/by-user/count`,
    ALL_USER_TASK_COUNT: `${TASKS_BASE}/all-tasks`,
  },
  CSRF: {
    FETCH_TOKEN: `${CSRF_BASE}/csrf-token`,
  },
};
