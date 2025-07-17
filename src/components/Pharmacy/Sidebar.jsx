import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import menuItems from "./menuItems";
import { FiLogOut } from "react-icons/fi"; // Import FiLogOut icon
import { useAuth } from "../../contexts/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();

  const location = useLocation();
  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
  };
  return (
    <div className="fixed top-0 left-0 bottom-0 w-[98px] bg-[#069AA2]    flex flex-col">
      <div className="flex justify-center items-center">
        <img
          src={logo}
          alt="Pharmacy Logo"
          className="h-12 w-12 object-cover"
        />
      </div>
      <nav className="mt-4 flex flex-col gap-4 items-center flex-1">
        {menuItems.map((item) => (
          <div key={item.id} className="relative group">
            <Link
              to={item.path}
              className={`relative flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 hover:bg-[#63AAAE] ${
                location.pathname === item.path
                  ? "bg-[#63AAAE]"
                  : "text-gray-700"
              }`}
            >
              {location.pathname === item.path && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r" />
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
      {/* Logout Button */}
      <div className="p-2">
        <div className="relative group   flex flex-col  items-center flex-1">
          <Link
            onClick={handleLogout}
            className="relative flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 hover:bg-[#63AAAE] text-gray-700"
          >
            <FiLogOut className="h-6 w-6 transition-transform group-hover:scale-110 text-red-500" />{" "}
          </Link>
          <span className=" text-sm font-medium">log out</span>
        </div>
      </div>
    </div>
  );
}
