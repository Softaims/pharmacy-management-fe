import React from "react";
import { Users, X, LogOut } from "lucide-react"; // Added LogOut icon
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify"; // To show toast notifications for logout
import logo from "../../assets/logo.png";

const Sidebar = ({
  activeTab,
  handleTabChange,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { user, logout, isLoading } = useAuth(); // Access user and logout function from AuthContext
  console.log("🚀 ~ user:,,,,,,,,,,,,,,,,,,,,,,,", user, isLoading);

  const sidebarItems = [
    { id: "users", label: "Gestion des pharmacies", icon: Users },
    // { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie !");
    } catch (error) {
      console.log("🚀 ~ handleLogout ~ error:", error);
      toast.error("Erreur lors de la déconnexion. Veuillez réessayer.");
    }
  };

  return (
    <aside
      className={`sidebar fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-xl lg:shadow-none w-64
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } flex flex-col`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center min-w-0">
          <div className="">
            <div className="flex justify-center items-center">
              <img
                src={logo}
                alt="Pharmacy Logo"
                className="h-12 w-12 object-cover"
              />
              <div className="">
                <h4 className="font-semibold text-2xl text-gray-900">
                  MezordoPro
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  Panneau d'administration
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area with nav and footer separated */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        {/* Navigation */}
        <nav className="px-3 py-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`group relative flex items-center w-full px-3 py-4 text-sm font-medium rounded-lg transition-all duration-200 outline-none
                  ${
                    isActive
                      ? "bg-[#DFEBEC] text-black shadow-sm outline-blue-500 focus:outline-blue-500"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`flex-shrink-0 w-5 h-5 ${
                    isActive
                      ? "text-[#069AA2]"
                      : "text-gray-400 group-hover:text-gray-500"
                  } mr-3`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">A</span>
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Administrateur
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.admin?.email || user?.email}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-4 w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-100 focus:outline-none transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Se déconnecter
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
