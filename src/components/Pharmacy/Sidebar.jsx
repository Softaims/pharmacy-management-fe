import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import menuItems from "./menuItems";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 bottom-0 bg-white shadow-lg w-16 flex flex-col">
      <div className="p-4 border-b flex justify-center items-center">
        <img
          src={logo}
          alt="Pharmacy Logo"
          className="h-8 w-8 object-contain"
        />
      </div>
      <nav className="mt-8 flex flex-col gap-4 items-center flex-1">
        {menuItems.map((item) => (
          <div key={item.id} className="relative group">
            <Link
              to={item.path}
              className={`relative flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 hover:bg-gray-100 ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700"
              }`}
            >
              {location.pathname === item.path && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-700 rounded-r" />
              )}
              <img
                src={item.icon}
                alt={item.tooltip}
                className="h-6 w-6 transition-transform group-hover:scale-110"
              />
            </Link>
            <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {item.tooltip}
            </span>
          </div>
        ))}
      </nav>
    </div>
  );
}
