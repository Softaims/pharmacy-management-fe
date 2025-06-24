import React, { useState, useEffect } from "react";
import { Menu, X, ChevronLeft, Home, Plus } from "lucide-react";
import Sidebar from "../../components/Admin/Sidebar";
import PharmacyManagement from "../../components/Admin/PharmacyManagement.jsx";
import SettingsPanel from "../../components/Admin/SettingsPanel.jsx";
import { useAuth } from "../../contexts/AuthContext";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  console.log("🚀 ~ DashboardPage ~ user:", user);
  const [pharmacies, setPharmacies] = useState([
    {
      id: 1,
      name: "Pharmacie SantéPlus",
      owner: "Dr. Jean Dupont",
      email: "jean@santeplus.com",
      phone: "+1 (555) 123-4567",
      address: "123 rue Principale, New York, NY 10001",
      status: "Active",
      joinedDate: "2023-01-15",
      revenue: "45 230 $",
    },
    {
      id: 2,
      name: "Pharmacie Médicale de la Ville",
      owner: "Dr. Sarah Martin",
      email: "sarah@medville.com",
      phone: "+1 (555) 234-5678",
      address: "456 avenue du Chêne, Los Angeles, CA 90210",
      status: "Active",
      joinedDate: "2023-03-22",
      revenue: "38 450 $",
    },
    {
      id: 3,
      name: "Pharmacie Rapid'Médic",
      owner: "Dr. Michel Brun",
      email: "michel@rapidmedic.com",
      phone: "+1 (555) 345-6789",
      address: "789 rue des Pins, Chicago, IL 60601",
      status: "Inactif",
      joinedDate: "2022-11-08",
      revenue: "22180$",
    },
    {
      id: 4,
      name: "Pharmacie FamilleSanté",
      owner: "Dr. Émilie Dubois",
      email: "emilie@famillesante.com",
      phone: "+1 (555) 456-7890",
      address: "321 rue Orme, Houston, TX 77001",
      status: "Active",
      joinedDate: "2023-05-10",
      revenue: "51 670 $",
    },
  ]);

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

            {/* {activeTab === "users" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#069AA2] hover:bg-[#05828A] text-white px-3 lg:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 text-sm lg:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:block">Ajouter une pharmacie</span>
                <span className="sm:hidden">Ajouter</span>
              </button>
            )} */}
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
