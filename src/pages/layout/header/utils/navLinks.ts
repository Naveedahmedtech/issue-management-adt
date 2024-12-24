import {
  FaHome,
  FaTasks,
  FaUser,
  FaClipboard,
  FaShoppingCart,
  FaPlus
} from "react-icons/fa";
import { ROLES } from "../../../../constant/ROLES";
import { APP_ROUTES } from "../../../../constant/APP_ROUTES";

export const links = [
  {
    url: APP_ROUTES.APP.HOME,
    Icon: FaHome,
    text: "Dashboard",
    roles: [ROLES.WORKER, ROLES.SUPER_ADMIN, ROLES.ADMIN],
    className:
        "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all",
  },
  {
    url: APP_ROUTES.APP.PROJECTS.LIST,
    Icon: FaTasks,
    text: "Projects",
    roles: [ROLES.ADMIN, ROLES.WORKER, ROLES.SUPER_ADMIN],
    className:
        "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all",
    isDropdown: true,
    subLinks: [
      { url: "#", text: "Project List", Icon: "" },
      {
        url: APP_ROUTES.APP.PROJECTS.DETAILS.replace(":projectId", "1"),
        text: "Project 1",
        Icon: FaClipboard,
      },
      {
        url: APP_ROUTES.APP.PROJECTS.DETAILS.replace(":projectId", "2"),
        text: "Project 2",
        Icon: FaClipboard,
      },
    ],
  },
  {
    url: APP_ROUTES.APP.PROJECTS.CREATE,
    Icon: FaPlus,
    text: "Create Project",
    roles: [ROLES.ADMIN],
    className:
        "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all",
  },
  {
    url: APP_ROUTES.DASHBOARDS.ORDER,
    Icon: FaShoppingCart,
    text: "Order Dashboard",
    roles: [ROLES.ADMIN],
    className:
        "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all",
  },
  {
    url: APP_ROUTES.SUPERADMIN.USER_MANAGEMENT,
    Icon: FaUser,
    text: "User Management",
    roles: [ROLES.SUPER_ADMIN],
    className:
        "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all",
  },
];
