const apiVersion = "v1"
const API_BASE = `/api/${apiVersion}`;
const AUTH_BASE = `${API_BASE}/auth`;
const USER_BASE = `${API_BASE}/user`;
const TASKS_BASE = `${API_BASE}/tasks`;
const CSRF_BASE = `${API_BASE}/csrf-token`;
const ROLE_BASE = `${API_BASE}/role`;
const PERMISSION_BASE = `${API_BASE}/permission`;
const PROJECT_BASE = `${API_BASE}/project`;
const ISSUE_BASE = `${API_BASE}/issue`;
const ORDER_BASE = `${API_BASE}/order`;
const COMPANY_BASE = `${API_BASE}/company`;
const COMMENTS_BASE = `${API_BASE}/comments`;
const CHECKLIST_BASE = `${API_BASE}/checklist-templates`;

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
  ROLES: {
    ROOT: `${ROLE_BASE}`
  },
  PERMISSIONS: {
    ROOT: `${PERMISSION_BASE}`
  },
  USER: {
    ROOT: `${USER_BASE}`,
    GET_USER: `${USER_BASE}/get`,
    ASSIGN_MANAGER: `${USER_BASE}/oversight`,
    GET_ASSIGN_TASK: `${USER_BASE}/manager`,
    GET_DASHBOARD_COUNT: `${USER_BASE}/dashboard/count`,
    BY_TOKEN: `${USER_BASE}/by/token`,
    LOGOUT: `${USER_BASE}/logout`,
    AZURE_LOGIN: `${USER_BASE}/azure/login`,
    AZURE_CREATE_USER: `${USER_BASE}/azure`,
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
  PROJECT: {
    ROOT: `${PROJECT_BASE}`,
    LIST: `${PROJECT_BASE}/list`,
    FILES: 'files',
    DOWNLOAD: 'download',
    UPDATE_FILE: 'update-file',
    ISSUES: 'issues',
    STATS: `${PROJECT_BASE}/dashboard/stats`,
    RECENT: `${PROJECT_BASE}/dashboard/recent`,
    GENERATE_REPORT: `generate-report`,
    ARCHIVED: `archived`,
    TOGGLE_ARCHIVED: `toggle-archive`,
    ISSUE_LOG_HISTORY: 'update-log-history',
    ACTIVITY_LOGS: 'activity-logs',
    ALL_ISSUES: 'all-issues',
    ASSIGN_TO_USERS: 'assign-to-users',
    UNASSIGN_TO_USERS: 'unassign-to-users',
  },
  ORDER: {
    ROOT: `${ORDER_BASE}`,
    LIST: `${ORDER_BASE}/list`,
    FILES: 'files',
    STATS: `${ORDER_BASE}/dashboard/stats`,
    RECENT: `${ORDER_BASE}/dashboard/recent`,
    ARCHIVED: `archived/list`,
    TOGGLE_ARCHIVED: `toggle-archive`,
  },
  ISSUE: {
    ROOT: `${ISSUE_BASE}`,
    ASSIGN_TO_USER: `assign-to-user`,
    REMOVE_USER: `remove-user`
  },
  COMPANY: {
    ROOT: `${COMPANY_BASE}`,
  },
  COMMENTS: {
    ROOT: `${COMMENTS_BASE}`,
    LATEST: `${COMMENTS_BASE}/latest`,
  },
  CHECKLIST: {
    ROOT: `${CHECKLIST_BASE}`,
  }
};


export const API_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
}
