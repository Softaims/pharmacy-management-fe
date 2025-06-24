import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const AddPharmacyModal = ({
  showAddModal,
  setShowAddModal,
  pharmacies,
  setPharmacies,
  pharmacyToEdit,
}) => {
  const [newPharmacy, setNewPharmacy] = useState({
    name: "",
    owner: "",
    email: "",
    phone: "",
    address: "",
    status: "Active",
  });

  const isEditMode = !!pharmacyToEdit;

  useEffect(() => {
    if (pharmacyToEdit) {
      setNewPharmacy({
        name: pharmacyToEdit.name,
        owner: pharmacyToEdit.owner,
        email: pharmacyToEdit.email,
        phone: pharmacyToEdit.phone,
        address: pharmacyToEdit.address,
        status: pharmacyToEdit.status,
      });
    } else {
      resetForm();
    }
  }, [pharmacyToEdit]);

  const resetForm = () => {
    setNewPharmacy({
      name: "",
      owner: "",
      email: "",
      phone: "",
      address: "",
      status: "Active",
    });
  };

  const handleSubmit = () => {
    // Basic validation
    if (!newPharmacy.name || !newPharmacy.owner || !newPharmacy.email) {
      toast.error("Veuillez remplir tous les champs obligatoires (*)", {
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    // Simple email validation (adjust regex as needed)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newPharmacy.email)) {
      toast.error("Veuillez entrer une adresse e-mail valide", {
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    if (isEditMode) {
      setPharmacies(
        pharmacies.map((pharmacy) =>
          pharmacy.id === pharmacyToEdit.id
            ? { ...pharmacy, ...newPharmacy }
            : pharmacy
        )
      );
      toast.success("Pharmacie mise à jour avec succès !", {
        autoClose: 3000,
        theme: "dark",
      });
    } else {
      const pharmacy = {
        ...newPharmacy,
        id: pharmacies.length + 1,
        joinedDate: new Date().toISOString().split("T")[0],
        revenue: "$0",
      };
      setPharmacies([...pharmacies, pharmacy]);
      toast.success("Pharmacie ajoutée avec succès !", {
        autoClose: 3000,
        theme: "dark",
      });
    }
    resetForm();
    setShowAddModal(false);
  };

  const handleCancel = () => {
    resetForm();
    setShowAddModal(false);
  };

  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          resetForm();
          setShowAddModal(false);
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "auto";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [showAddModal]);

  if (!showAddModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleCancel}
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-[32rem] rounded-xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn scale-95 transition-transform p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditMode
                ? "Modifier la pharmacie"
                : "Ajouter une nouvelle pharmacie"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditMode
                ? "Mettez à jour les détails de la pharmacie ci-dessous"
                : "Entrez les détails de la pharmacie ci-dessous"}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-500 bg-white rounded-full shadow-lg hover:shadow-xl hover:text-gray-800 hover:bg-gray-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {[
            {
              label: "Nom de la pharmacie *",
              name: "name",
              type: "text",
              placeholder: "Entrez le nom de la pharmacie",
            },
            {
              label: "Nom du propriétaire *",
              name: "owner",
              type: "text",
              placeholder: "Entrez le nom du propriétaire",
            },
            {
              label: "Adresse e-mail *",
              name: "email",
              type: "email",
              placeholder: "Entrez l'adresse e-mail",
            },
            {
              label: "Numéro de téléphone",
              name: "phone",
              type: "tel",
              placeholder: "Entrez le numéro de téléphone",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                value={newPharmacy[field.name]}
                onChange={(e) =>
                  setNewPharmacy({
                    ...newPharmacy,
                    [field.name]: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                placeholder={field.placeholder}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <textarea
              value={newPharmacy.address}
              onChange={(e) =>
                setNewPharmacy({ ...newPharmacy, address: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              rows="3"
              placeholder="Entrez l'adresse complète"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={newPharmacy.status}
              onChange={(e) =>
                setNewPharmacy({ ...newPharmacy, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactif">Inactif</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#069AA2] hover:bg-[#05828A] text-white rounded-lg transition text-sm"
          >
            {isEditMode ? "Mettre à jour la pharmacie" : "Ajouter la pharmacie"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPharmacyModal;
