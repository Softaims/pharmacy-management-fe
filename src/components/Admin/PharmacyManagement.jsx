import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Filter,
  X,
} from "lucide-react";
import AddPharmacyModal from "./AddPharmacyModal.jsx";
import DeleteConfirmationModal from "./DeleteConfirmationModal.jsx";
import StatusConfirmationModal from "./StatusConfirmationModal.jsx";

const PharmacyManagement = ({
  pharmacies,
  setPharmacies,
  searchTerm,
  setSearchTerm,
  showAddModal,
  setShowAddModal,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [pharmacyToEdit, setPharmacyToEdit] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusPharmacy, setStatusPharmacy] = useState(null);

  const filteredPharmacies = pharmacies.filter(
    (pharmacy) =>
      pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePharmacy = (id) => {
    setPharmacies(pharmacies.filter((pharmacy) => pharmacy.id !== id));
    setShowDeleteModal(false);
    setSelectedPharmacy(null);
  };

  const openDeleteModal = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setShowDeleteModal(true);
  };

  const openEditModal = (pharmacy) => {
    setPharmacyToEdit(pharmacy);
    setShowAddModal(true);
  };

  const openAddModal = () => {
    setPharmacyToEdit(null); // Reset pharmacyToEdit for adding
    setShowAddModal(true);
  };
  const handleStatusToggle = (pharmacy) => {
    setStatusPharmacy(pharmacy);
    setShowStatusModal(true);
  };
  const confirmStatusToggle = () => {
    setPharmacies(
      pharmacies.map((pharmacy) =>
        pharmacy.id === statusPharmacy.id
          ? {
              ...pharmacy,
              status: pharmacy.status === "Active" ? "Inactif" : "Active",
            }
          : pharmacy
      )
    );
    setShowStatusModal(false);
    setStatusPharmacy(null);
  };

  const toggleStatus = (id) => {
    setPharmacies(
      pharmacies.map((pharmacy) =>
        pharmacy.id === id
          ? {
              ...pharmacy,
              status: pharmacy.status === "Active" ? "Inactif" : "Active",
            }
          : pharmacy
      )
    );
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-500">
                Total Pharmacies
              </p>
              <p className="text-xl lg:text-2xl font-semibold text-gray-800">
                {pharmacies.length}
              </p>
            </div>
            <div className="bg-blue-100 p-2 lg:p-3 rounded-lg">
              <Users className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-500">Active</p>
              <p className="text-xl lg:text-2xl font-semibold text-[#069AA2]">
                {pharmacies.filter((p) => p.status === "Active").length}
              </p>
            </div>
            <div className="bg-green-100 p-2 lg:p-3 rounded-lg">
              <div className="w-4 h-4 lg:w-6 lg:h-6 bg-[#069AA2] rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-500">Inactif</p>
              <p className="text-xl lg:text-2xl font-semibold text-[#E9486C]">
                {pharmacies.filter((p) => p.status === "Inactif").length}
              </p>
            </div>
            <div className="bg-red-100 p-2 lg:p-3 rounded-lg">
              <div className="w-4 h-4 lg:w-6 lg:h-6 bg-[#E9486C] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des pharmacies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm lg:text-base"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm lg:text-base">
            <Filter className="w-4 h-4" />
            filtre
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#069AA2] text-white rounded-lg hover:bg-[#05828A] transition-colors duration-200 text-sm lg:text-base"
          >
            <Plus className="w-4 h-4" />
            Ajouter une pharmacie
          </button>
        </div>
      </div>

      {/* Pharmacies Table/Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Détails de la pharmacie
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPharmacies.map((pharmacy) => (
                <tr
                  key={pharmacy.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {pharmacy.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {pharmacy.owner}
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        Joined {pharmacy.joinedDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {pharmacy.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {pharmacy.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {pharmacy.address}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      // onClick={() => toggleStatus(pharmacy.id)}
                      onClick={() => handleStatusToggle(pharmacy)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                        pharmacy.status === "Active"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {pharmacy.status}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(pharmacy)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(pharmacy)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-200">
          {filteredPharmacies.map((pharmacy) => (
            <div key={pharmacy.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {pharmacy.name}
                  </h3>
                  <p className="text-sm text-gray-500">{pharmacy.owner}</p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={() => toggleStatus(pharmacy.id)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                      pharmacy.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {pharmacy.status}
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{pharmacy.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span>{pharmacy.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{pharmacy.address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  Joined {pharmacy.joinedDate}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900 text-sm">
                    {pharmacy.revenue}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(pharmacy)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(pharmacy)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Pharmacy Modal */}
      <AddPharmacyModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        pharmacies={pharmacies}
        setPharmacies={setPharmacies}
        pharmacyToEdit={pharmacyToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedPharmacy(null);
        }}
        onConfirm={() => handleDeletePharmacy(selectedPharmacy.id)}
        pharmacyName={selectedPharmacy?.name || ""}
      />
      <StatusConfirmationModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setStatusPharmacy(null);
        }}
        onConfirm={confirmStatusToggle}
        pharmacyName={statusPharmacy?.name}
        currentStatus={statusPharmacy?.status}
      />
    </div>
  );
};

export default PharmacyManagement;
