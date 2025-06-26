import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FileText, BarChart2, User, Mail, Settings } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { id: "orders", label: "Orders", icon: FileText, path: "/pharmacy/orders" },
    { id: "profile", label: "Profile", icon: User, path: "/pharmacy/profile" },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/pharmacy/settings",
    },
  ];

  return (
    <div className="fixed top-0 left-0 bottom-0 bg-white shadow-lg w-16">
      <div className="p-4 border-b flex justify-center items-center">
        <img
          src={logo}
          alt="Pharmacy Logo"
          className="h-8 w-8 object-contain"
        />
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`w-full flex justify-center items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
              location.pathname === item.path
                ? "bg-blue-50 border-r-2 border-blue-500 text-blue-600"
                : "text-gray-700"
            }`}
            title={item.label}
          >
            <item.icon className="text-lg text-black" />
          </Link>
        ))}
      </nav>
    </div>
  );
}
