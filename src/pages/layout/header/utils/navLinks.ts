import {
  FaHome,
  FaTasks,
  FaUser,
  FaShoppingCart,
  FaPlus,
  FaArchive
} from "react-icons/fa";
import { ROLES } from "../../../../constant/ROLES";
import { APP_ROUTES } from "../../../../constant/APP_ROUTES";

export const links = [
  {
    url: APP_ROUTES.DASHBOARDS.PROJECT,
    Icon: FaHome,
    text: "Project Dashboard",
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
    ],
  },
  {
    url: APP_ROUTES.APP.PROJECTS.CREATE,
    Icon: FaPlus,
    text: "Create Project",
    roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
    className:
        "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all",
  },
  {
    url: APP_ROUTES.DASHBOARDS.ORDER,
    Icon: FaShoppingCart,
    text: "Order Dashboard",
    roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
    className:
        "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all",
  },
  {
    url: APP_ROUTES.APP.ORDERS.LIST,
    Icon: FaTasks,
    text: "Orders",
    roles: [ROLES.ADMIN, ROLES.WORKER, ROLES.SUPER_ADMIN],
    className:
        "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all",
    isDropdown: true,
    subLinks: [
      { url: "#", text: "Order List", Icon: "" },
    ],
  },
  {
    url: APP_ROUTES.APP.ORDERS.CREATE,
    Icon: FaPlus,
    text: "Create Order",
    roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
    className:
        "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all",
  },
  {
    url: APP_ROUTES.SUPERADMIN.USERS.MANAGEMENT,
    Icon: FaUser,
    text: "User Management",
    roles: [ROLES.SUPER_ADMIN],
    className:
        "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all",
  },
  {
    url: APP_ROUTES.SUPERADMIN.USERS.CREATE,
    Icon: FaPlus,
    text: "Create User",
    roles: [ROLES.SUPER_ADMIN],
    className:
        "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all",
  },
  {
    url: APP_ROUTES.APP.PROJECTS.ARCHIVED,
    Icon: FaArchive,
    text: "Archived Projects",
    roles: [ROLES.ADMIN, ROLES.WORKER, ROLES.SUPER_ADMIN],
    className:
        "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all",
  },
  {
    url: APP_ROUTES.APP.ORDERS.ARCHIVED,
    Icon: FaArchive,
    text: "Archived Orders",
    roles: [ROLES.ADMIN, ROLES.WORKER, ROLES.SUPER_ADMIN],
    className:
        "text-text hover:text-text hover:bg-background p-2 rounded-lg transition-all",
  },
];
