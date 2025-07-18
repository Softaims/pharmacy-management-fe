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
} from "lucide-react";
import AddPharmacyModal from "./AddPharmacyModal.jsx";
import DeleteConfirmationModal from "./DeleteConfirmationModal.jsx";
import StatusConfirmationModal from "./StatusConfirmationModal.jsx";
import apiService from "../../api/apiService.js";
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState(false);
  const filteredPharmacies = pharmacies.filter(
    (pharmacy) =>
      (pharmacy?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pharmacy?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePharmacy = async (id) => {
    setLoading(true);
    try {
      await apiService.deletePharmacy(id); // Appel de l'API pour supprimer la pharmacie
      setPharmacies(pharmacies.filter((pharmacy) => pharmacy.id !== id)); // Mise à jour de l'état local
      setShowDeleteModal(false);
      setSelectedPharmacy(null);
      toast.success("Pharmacie supprimée avec succès !"); // Toast de succès
    } catch (error) {
      console.error("Échec de la suppression de la pharmacie :", error);
      toast.error(
        error.message ||
          "Échec de la suppression de la pharmacie. Veuillez réessayer biotechnology."
      ); // Toast d'erreur
    } finally {
      setLoading(false);
    }
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
  const confirmStatusToggle = async () => {
    setLoading(true);
    try {
      const newStatus = statusPharmacy.status === "Active" ? false : true;
      await apiService.changeStatus(statusPharmacy.id, newStatus);
      setPharmacies(
        pharmacies.map((pharmacy) =>
          pharmacy.id === statusPharmacy.id
            ? {
                ...pharmacy,
                status: newStatus ? "Active" : "Inactif",
              }
            : pharmacy
        )
      );
      setShowStatusModal(false);
      setStatusPharmacy(null);
      toast.success("Statut de la pharmacie mis à jour avec succès !");
    } catch (error) {
      console.error("Échec de la mise à jour du statut :", error);
      toast.error(
        error.message ||
          "Échec de la mise à jour du statut. Veuillez réessayer."
      ); // Toast d'erreur
    } finally {
      setLoading(false);
    }
  };

  // const toggleStatus = (id) => {
  //   setPharmacies(
  //     pharmacies.map((pharmacy) =>
  //       pharmacy.id === id
  //         ? {
  //             ...pharmacy,
  //             status: pharmacy.status === "Active" ? "Inactif" : "Active",
  //           }
  //         : pharmacy
  //     )
  //   );
  // };

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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm lg:text-base"
            />
          </div>
          {/* <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm lg:text-base">
            <Filter className="w-4 h-4" />
            filtre
          </button> */}
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
        <div className="hidden md:block overflow-x-auto">
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
                    {/* <button
                      onClick={() => handleStatusToggle(pharmacy)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                        pharmacy.status === "Active"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {pharmacy.status}
                    </button> */}
                    <div className="inline-flex flex-col items-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pharmacy.status === "Active"}
                          onChange={() => handleStatusToggle(pharmacy)}
                          className="peer hidden"
                        />
                        <div
                          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                            pharmacy.status === "Active"
                              ? "bg-green-600 peer-focus:ring-4 peer-focus:ring-green-300"
                              : "bg-gray-200 peer-focus:ring-4 peer-focus:ring-gray-300"
                          } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all`}
                        ></div>
                      </label>
                      <span
                        className={`mt-1 text-sm font-medium ${
                          pharmacy.status === "Active"
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                      >
                        {pharmacy.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => openEditModal(pharmacy)}
                        className="flex flex-col items-center text-blue-600 hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-xs font-medium mt-1">Edit</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(pharmacy)}
                        className="flex flex-col items-center text-red-600 hover:bg-red-50 rounded-lg p-2 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-xs font-medium mt-1">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
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
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pharmacy.status === "Active"}
                      onChange={() => handleStatusToggle(pharmacy)}
                      className="hidden peer"
                    />
                    <div
                      className={`relative w-11 h-6 rounded-full peer transition-colors duration-200 ${
                        pharmacy.status === "Active"
                          ? "bg-green-600 peer-focus:ring-4 peer-focus:ring-green-300"
                          : "bg-gray-200 peer-focus:ring-4 peer-focus:ring-gray-300"
                      } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all`}
                    ></div>
                    <span
                      className={`ms-3 text-sm font-medium ${
                        pharmacy.status === "Active"
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {pharmacy.status}
                    </span>
                  </label>
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
                  <button
                    onClick={() => openEditModal(pharmacy)}
                    className="flex flex-col items-center text-blue-600 hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-xs font-medium mt-1">Edit</span>
                  </button>
                  <button
                    onClick={() => openDeleteModal(pharmacy)}
                    className="flex flex-col items-center text-red-600 hover:bg-red-50 rounded-lg p-2 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-xs font-medium mt-1">Delete</span>
                  </button>
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
        loading={loading}
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
        loading={loading}
      />
    </div>
  );
};

export default PharmacyManagement;
