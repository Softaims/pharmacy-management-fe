import userIcon from "../../assets/user-icon.png";
import staticsIcon from "../../assets/statics.png";
import settingIcon from "../../assets/setting-icon.png";
import orderIcon2 from "../../assets/order-2.png";

const menuItems = [
  {
    id: "orders",
    icon: orderIcon2,
    path: "/pharmacy/orders",
    tooltip: "Ordonnances",
  },
  {
    id: "Statistiques",
    icon: staticsIcon,
    path: "/pharmacy/Statistiques",
    tooltip: "Statistiques",
  },

  {
    id: "profile",
    icon: userIcon,
    path: "/pharmacy/profile",
    tooltip: "Mon compte",
  },
  {
    id: "settings",
    icon: settingIcon,
    path: "/pharmacy/settings",
    tooltip: "Paramètres",
  },
];

export default menuItems;
