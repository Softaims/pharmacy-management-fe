import React, { useEffect, useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import apiService from "../../api/apiService";
import dayjs from "dayjs";

const AddPharmacyModal = ({
  showAddModal,
  setShowAddModal,
  pharmacies,
  setPharmacies,
  pharmacyToEdit,
}) => {
  const [newPharmacy, setNewPharmacy] = useState({
    name: "",
    // owner: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    status: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const isEditMode = !!pharmacyToEdit;

  useEffect(() => {
    if (pharmacyToEdit) {
      setNewPharmacy({
        name: pharmacyToEdit.name,
        // owner: pharmacyToEdit.owner,
        email: pharmacyToEdit.email,
        phone: pharmacyToEdit.phone,
        address: pharmacyToEdit.address,
        status: pharmacyToEdit.status,
        password: "",
      });
    } else {
      resetForm();
    }
  }, [pharmacyToEdit]);

  const resetForm = () => {
    setNewPharmacy({
      name: "",
      // owner: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      status: "",
    });
    setShowPassword(false);
  };

  const handleSubmit = async () => {
    // Basic validation
    if (
      !newPharmacy.name ||
      // !newPharmacy.owner ||
      !newPharmacy.email ||
      (!isEditMode && !newPharmacy.password)
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires (*)", {
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newPharmacy.email)) {
      toast.error("Veuillez entrer une adresse e-mail valide", {
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    // Password validation (minimum 8 characters, only required for add mode)
    if (!isEditMode && newPharmacy.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères", {
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    try {
      let result;
      if (isEditMode) {
        // Create payload with only changed fields
        const payload = {};
        if (newPharmacy.name !== pharmacyToEdit.name)
          payload.name = newPharmacy.name;
        if (newPharmacy.email !== pharmacyToEdit.email)
          payload.email = newPharmacy.email;
        if (newPharmacy.phone !== pharmacyToEdit.phone)
          payload.phoneNumber = newPharmacy.phone;
        if (newPharmacy.address !== pharmacyToEdit.address)
          payload.address = newPharmacy.address;
        if (newPharmacy.password) payload.password = newPharmacy.password;
        if (newPharmacy.status !== pharmacyToEdit.status) {
          payload.isActive = newPharmacy.status === "Active";
        }

        // Only send PATCH request if there are changes
        if (Object.keys(payload).length === 0) {
          toast.info("Aucune modification détectée", {
            autoClose: 3000,
            theme: "dark",
          });
          resetForm();
          setShowAddModal(false);
          return;
        }

        result = await apiService.updatePharmacy(pharmacyToEdit.id, payload);
        console.log("🚀 ~ handleSubmit ~ result:", result);

        // Update local state
        setPharmacies(
          pharmacies.map((pharmacy) =>
            pharmacy.id === pharmacyToEdit.id
              ? {
                  ...pharmacy,
                  ...payload,
                  phone: payload.phoneNumber || pharmacy.phone,
                  status:
                    payload.isActive !== undefined
                      ? payload.isActive
                        ? "Active"
                        : "Inactif"
                      : pharmacy.status,
                }
              : pharmacy
          )
        );

        toast.success("Pharmacie mise à jour avec succès !", {
          autoClose: 3000,
          theme: "dark",
        });
      } else {
        const payload = {
          name: newPharmacy.name,
          email: newPharmacy.email,
          phoneNumber: newPharmacy.phone,
          password: newPharmacy.password,
          address: newPharmacy.address,
          latitude: 48.8534,
          longitude: 2.3488,
          role: "PHARMACY",
        };

        result = await apiService.addPharmacy(payload);
        const newPharmacyData = {
          ...result.data.user.pharmacy,
          id: result.data.id,
          email: result.data.user.email,
          name: result.data.name,
          address: result.data.address,
          phone: result.data.user.phoneNumber,
          // owner: newPharmacy.owner, // Use form owner instead of hardcoded
          status: "Active",
          joinedDate: dayjs(result.data.createdAt).format("DD MMMM YYYY"),
        };
        setPharmacies([...pharmacies, newPharmacyData]);
        toast.success("Pharmacie ajoutée avec succès !", {
          autoClose: 3000,
          theme: "dark",
        });
      }

      resetForm();
      setShowAddModal(false);
    } catch (error) {
      toast.error(
        `Erreur lors de ${
          isEditMode ? "la mise à jour" : "l'ajout"
        } de la pharmacie : ${error.message}`,
        {
          autoClose: 3000,
          theme: "dark",
        }
      );
    }
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
            // {
            //   label: "Nom du propriétaire *",
            //   name: "owner",
            //   type: "text",
            //   placeholder: "Entrez le nom du propriétaire",
            // },
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
            {
              label: isEditMode ? "Nouveau mot de passe" : "Mot de passe *",
              name: "password",
              type: showPassword ? "text" : "password",
              placeholder: isEditMode
                ? "Entrez un nouveau mot de passe (facultatif)"
                : "Entrez le mot de passe",
              isPassword: true,
            },
          ].map((field) => (
            <div key={field.name} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={field.type}
                  value={newPharmacy[field.name]}
                  onChange={(e) =>
                    setNewPharmacy({
                      ...newPharmacy,
                      [field.name]: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm pr-10"
                  placeholder={field.placeholder}
                />
                {field.isPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
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

          {/* Show Statut dropdown only in edit mode */}
          {isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={newPharmacy.status || "Active"}
                onChange={(e) =>
                  setNewPharmacy({ ...newPharmacy, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>
          )}
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
