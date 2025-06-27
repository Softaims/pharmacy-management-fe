import mailIcon from "../../assets/mailsvg.svg";
import userIcon from "../../assets/user-icon.svg";
import chartIcon from "../../assets/chart-icon.svg";
import settingIcon from "../../assets/settin-icon.svg";

const menuItems = [
  {
    id: "orders",
    icon: chartIcon,
    path: "/pharmacy/orders",
    tooltip: "Orders",
  },
  {
    id: "mail",
    icon: mailIcon,
    path: "/pharmacy/mail",
    tooltip: "Mail",
  },
  {
    id: "profile",
    icon: userIcon,
    path: "/pharmacy/profile",
    tooltip: "Profile",
  },
  {
    id: "settings",
    icon: settingIcon,
    path: "/pharmacy/settings",
    tooltip: "Settings",
  },
];

export default menuItems;
