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
  // console.log("🚀 ~ DashboardPage ~ user:", user);
  const [pharmacies, setPharmacies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchPharmacies = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getPharmacies();
        // Transform API data to match the static data structure
        const transformedPharmacies = response.data.map((pharmacy) => ({
          id: pharmacy.id,
          name: pharmacy.name,
          email: pharmacy.user?.email || "N/A",
          phone: pharmacy.user?.phoneNumber || "N/A",
          address: pharmacy.address,
          status: pharmacy.isActive ? "Active" : "Inactive",
          joinedDate: dayjs(pharmacy.createdAt).format("DD MMMM YYYY"),
          createdAt: pharmacy.createdAt,
        }));
        const sortedPharmacies = transformedPharmacies.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPharmacies(sortedPharmacies);
      } catch (error) {
        console.error("Error fetching pharmacies:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPharmacies();
  }, []);
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
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-[10px] flex-shrink-0">
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
            isLoading ? (
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#069AA2]"></div>
                </div>
              </div>
            ) : (
              <PharmacyManagement
                pharmacies={pharmacies}
                setPharmacies={setPharmacies}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                showAddModal={showAddModal}
                setShowAddModal={setShowAddModal}
              />
            )
          ) : (
            <SettingsPanel />
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
