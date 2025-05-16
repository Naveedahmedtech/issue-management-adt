import {FaArchive, FaBuilding, FaClipboardList, FaFolderOpen, FaHome, FaPlusCircle, FaProjectDiagram, FaUserPlus, FaUsersCog,} from "react-icons/fa";
import {ROLES} from "../../../../constant/ROLES";
import {APP_ROUTES} from "../../../../constant/APP_ROUTES";

export const links = [
  {
    url: APP_ROUTES.DASHBOARDS.PROJECT,
    Icon: FaHome,
    text: "Project Dashboard",
    roles: [ROLES.WORKER, ROLES.SUPER_ADMIN, ROLES.ADMIN],
    className:
      "text-text hover:text-textHover hover:bg-hover p-2 rounded-lg transition-all",
  },
  {
    url: APP_ROUTES.APP.PROJECTS.LIST,
    Icon: FaProjectDiagram, // Modern Project Management icon
    text: "Projects",
    roles: [ROLES.ADMIN, ROLES.WORKER, ROLES.SUPER_ADMIN],
    className:
      "text-text hover:text-textHover hover:bg-hover p-2 rounded-lg transition-all",
    isDropdown: true,
    subLinks: [
      { url: APP_ROUTES.APP.PROJECTS.ALL, text: "All Projects", Icon: FaClipboardList },
      // { url: APP_ROUTES.APP.ORDERS.ALL, text: "All Orders", Icon: MdOutlineShoppingCart },
      { url: APP_ROUTES.APP.PROJECTS.CREATE, text: "Create Project", Icon: FaPlusCircle },
      // { url: APP_ROUTES.APP.ORDERS.CREATE, text: "Create Order", Icon: FaPlusCircle },
    ],
  },
  // {
  //   url: APP_ROUTES.APP.PROJECTS.ALL_ISSUES,
  //   Icon: TbAlertCircle, // Issue tracking icon
  //   text: "Issues",
  //   roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  //   className:
  //     "text-text hover:text-textHover hover:bg-hover p-2 rounded-lg transition-all",
  // },
  // {
  //   url: APP_ROUTES.DASHBOARDS.ORDER,
  //   Icon: MdOutlineShoppingCart,
  //   text: "Order Dashboard",
  //   roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  //   className:
  //     "text-text hover:text-textHover hover:bg-hover p-2 rounded-lg transition-all",
  // },
  {
    url: APP_ROUTES.APP.COMPANY,
    Icon: FaBuilding,
    text: "Company",
    roles: [ROLES.ADMIN, ROLES.WORKER, ROLES.SUPER_ADMIN],
  },
  {
    url: APP_ROUTES.SUPERADMIN.USERS.MANAGEMENT,
    Icon: FaUsersCog, // User management icon
    text: "User Management",
    roles: [ROLES.SUPER_ADMIN],
    className:
      "text-text hover:text-textHover hover:bg-hover p-2 rounded-lg transition-all",
  },
  {
    url: APP_ROUTES.SUPERADMIN.USERS.CREATE,
    Icon: FaUserPlus, // Better 'Add User' icon
    text: "Create User",
    roles: [ROLES.SUPER_ADMIN],
    className:
      "text-text hover:text-textHover hover:bg-hover p-2 rounded-lg transition-all",
  },
  {
    url: APP_ROUTES.APP.PROJECTS.ARCHIVED,
    Icon: FaFolderOpen, // Clearer 'Archived Projects' icon
    text: "Archived Projects",
    roles: [ROLES.ADMIN, ROLES.WORKER, ROLES.SUPER_ADMIN],
    className:
      "text-text hover:text-textHover hover:bg-hover p-2 rounded-lg transition-all",
  },
  {
    url: APP_ROUTES.APP.ORDERS.ARCHIVED,
    Icon: FaArchive,
    text: "Archived Orders",
    roles: [ROLES.ADMIN, ROLES.WORKER, ROLES.SUPER_ADMIN],
    className:
      "text-text hover:text-textHover hover:bg-hover p-2 rounded-lg transition-all",
  },  
];
