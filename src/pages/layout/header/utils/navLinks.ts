import {
  FaHome,
  FaTasks,
  FaUsers,
  FaUserCog,
  FaClipboardList,
} from "react-icons/fa";
import { ROLES } from "../../../../constant/ROLES";
import { APP_ROUTES } from "../../../../constant/APP_ROUTES";

export const links = [
  {
    url: APP_ROUTES.APP.HOME_ALIAS,
    Icon: FaHome,
    text: "Dashboard",
    roles: [ROLES.REGULAR_USER, ROLES.MANAGER, ROLES.ADMIN],
    className:
      "text-text hover:text-text hover:bg-background p-2  rounded-lg transition-all",
  },
  {
    url: APP_ROUTES.APP.MY_TASKS,
    Icon: FaTasks,
    text: "My Tasks",
    roles: [ROLES.REGULAR_USER, ROLES.MANAGER, ROLES.ADMIN],
    className:
      "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all mb-5",
  },
  {
    url: "/team-task",
    Icon: FaClipboardList,
    text: "Team Tasks",
    roles: [ROLES.MANAGER],
    className:
      "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all mb-5",
  },
  {
    url: "/all-tasks",
    Icon: FaTasks,
    text: "All Tasks",
    roles: [ROLES.ADMIN],
    className:
      "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all mb-5",
  },
  {
    url: "/user-management",
    Icon: FaUsers,
    text: "User Management",
    roles: [ROLES.ADMIN],
    className:
      "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all mb-5",
  },
  {
    url: "/profile",
    Icon: FaUserCog,
    text: "Profile",
    roles: [ROLES.ADMIN],
    className:
      "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all mb-5",
  },
];
