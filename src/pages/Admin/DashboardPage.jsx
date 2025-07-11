import React, { useState, useEffect } from "react";
import { Menu, X, ChevronLeft, Home, Plus } from "lucide-react";
import Sidebar from "../../components/Admin/Sidebar";
import PharmacyManagement from "../../components/Admin/PharmacyManagement.jsx";
import SettingsPanel from "../../components/Admin/SettingsPanel.jsx";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../api/apiService.js";
import dayjs from "dayjs";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  console.log("🚀 ~ DashboardPage ~ user:", user);
  const [pharmacies, setPharmacies] = useState([]);
  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const response = await apiService.getPharmacies();
        console.log("🚀 ~ fetchPharmacies ~ data:", response);

        // Transform API data to match the static data structure
        const transformedPharmacies = response.data.map((pharmacy) => ({
          id: pharmacy.id,
          name: pharmacy.name,
          owner: pharmacy.user ? pharmacy.user.email.split("@")[0] : "Unknown", // Extract owner name from email or fallback
          email: pharmacy.user?.email || "N/A",
          phone: pharmacy.user?.phoneNumber || "N/A",
          address: pharmacy.address,
          status: pharmacy.isActive ? "Active" : "Inactif",
          joinedDate: dayjs(pharmacy.createdAt).format("DD MMMM YYYY"),
        }));
        console.log(
          "🚀 ~ transformedPharmacies ~ transformedPharmacies:",
          transformedPharmacies
        );

        setPharmacies(transformedPharmacies);
      } catch (error) {
        console.error("Error fetching pharmacies:", error.message);
        // Optionally handle error (e.g., show notification)
      }
    };

    fetchPharmacies();
  }, []); // Empty dependency array to run once on mount
  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        !event.target.closest(".sidebar") &&
        !event.target.closest(".mobile-menu-btn")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [sidebarOpen]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#FFFFFF]">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="mobile-menu-btn lg:hidden mr-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                  {activeTab === "users"
                    ? "Gestion des pharmacies"
                    : activeTab === "dashboard"
                    ? "Dashboard"
                    : "Settings"}
                </h2>
                <p className="text-gray-500 mt-1 text-sm lg:text-base hidden sm:block truncate">
                  {activeTab === "users"
                    ? "Gérer les pharmacies et leurs informations"
                    : activeTab === "dashboard"
                    ? "Overview of your pharmacy network"
                    : "Configure system settings"}
                </p>
              </div>
            </div>
          </div>
        </header>
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeTab === "users" ? (
            <PharmacyManagement
              pharmacies={pharmacies}
              setPharmacies={setPharmacies}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showAddModal={showAddModal}
              setShowAddModal={setShowAddModal}
            />
          ) : (
            <SettingsPanel />
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
