import React, { useEffect, useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import apiService from "../../api/apiService";
import dayjs from "dayjs";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const AddPharmacyModal = ({
  showAddModal,
  setShowAddModal,
  pharmacies,
  setPharmacies,
  pharmacyToEdit,
}) => {
  const [newPharmacy, setNewPharmacy] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    status: "",
    latitude: null,
    longitude: null,
  });
  const [autocomplete, setAutocomplete] = useState(null); // State to store Autocomplete instance
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [lastMode, setLastMode] = useState(null); // Track the last mode (edit/add)
  const [loading, setLoading] = useState(false);
  const isEditMode = !!pharmacyToEdit;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDE65cQp3MxQGqFHaIpcfC1wH7fcgACewY", // Replace with your API Key
    libraries: ["places"], // Load places library
  });
  const handlePlaceChanged = (autocomplete) => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();
      setNewPharmacy({
        ...newPharmacy,
        address: place.formatted_address,
        latitude: latitude,
        longitude: longitude,
      });
    }
  };
  const handleAddressChange = (e) => {
    setNewPharmacy({
      ...newPharmacy,
      address: e.target.value,
    });
  };
  useEffect(() => {
    const currentMode = isEditMode ? "edit" : "add";

    // If mode changed, reset form
    if (lastMode !== null && lastMode !== currentMode) {
      resetForm();
    }

    if (pharmacyToEdit) {
      setNewPharmacy({
        name: pharmacyToEdit.name,
        email: pharmacyToEdit.email,
        phone: pharmacyToEdit.phone,
        address: pharmacyToEdit.address,
        status: pharmacyToEdit.status,
        password: "",
      });
    } else if (lastMode !== currentMode) {
      // Only reset form for add mode if we're switching from edit mode
      resetForm();
    }

    setLastMode(currentMode);
  }, [pharmacyToEdit, showAddModal]); // Added showAddModal to dependency array

  const resetForm = () => {
    setNewPharmacy({
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      status: "",
    });
    setErrors({});
    setTouched({});
    setShowPassword(false);
  };

  // Validation functions
  const validateName = (name) => {
    if (!name || name.trim() === "") {
      return "Le nom de la pharmacie est obligatoire";
    }
    if (name.trim().length < 2) {
      return "Le nom de la pharmacie doit contenir au moins 2 caractères";
    }
    if (name.trim().length > 100) {
      return "Le nom de la pharmacie ne peut pas dépasser 100 caractères";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === "") {
      return "L'adresse e-mail est obligatoire";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Veuillez entrer une adresse e-mail valide";
    }
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone || phone.trim() === "") {
      return "Le numéro de téléphone est obligatoire";
    }
    // French phone number validation (more flexible)
    const phoneRegex = /^(\+33|0)[1-9](\d{8})$/;
    const cleanPhone = phone.replace(/\s+/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      return "Veuillez entrer un numéro de téléphone valide (ex: +33780763734)";
    }
    return "";
  };

  const validateAddress = (address) => {
    if (!address || address.trim() === "") {
      return "L'adresse est obligatoire";
    }

    return "";
  };

  const validatePassword = (password) => {
    if (isEditMode) return ""; // Password not required in edit mode

    if (!password || password.trim() === "") {
      return "Le mot de passe est obligatoire";
    }
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (!/[A-Z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une lettre majuscule";
    }
    if (!/[a-z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une lettre minuscule";
    }
    if (!/\d/.test(password)) {
      return "Le mot de passe doit contenir au moins un chiffre";
    }

    return "";
  };

  // Real-time validation
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "address":
        error = validateAddress(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      default:
        break;
    }
    return error;
  };

  // Handle input change with validation
  const handleInputChange = (name, value) => {
    setNewPharmacy({
      ...newPharmacy,
      [name]: value,
    });

    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({
        ...errors,
        [name]: error,
      });
    }
  };

  // Handle field blur (when user leaves the field)
  const handleBlur = (name) => {
    setTouched({
      ...touched,
      [name]: true,
    });

    const error = validateField(name, newPharmacy[name]);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  // Check if form has changes in edit mode
  const hasChanges = () => {
    if (!isEditMode || !pharmacyToEdit) return true; // Always enabled in add mode

    return (
      newPharmacy.name !== pharmacyToEdit.name ||
      newPharmacy.email !== pharmacyToEdit.email ||
      newPharmacy.phone !== pharmacyToEdit.phone ||
      newPharmacy.address !== pharmacyToEdit.address
    );
  };

  // Validate all fields before submit
  const validateAllFields = () => {
    const newErrors = {};
    const fieldsToValidate = ["name", "email", "phone", "address"];

    if (!isEditMode) {
      fieldsToValidate.push("password");
    }

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, newPharmacy[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    setTouched(
      fieldsToValidate.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {})
    );

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Check if there are changes in edit mode
    if (isEditMode && !hasChanges()) {
      toast.info("Aucune modification détectée", {
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    // Validate all fields
    if (!validateAllFields()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire", {
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    setLoading(true);
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
          latitude: newPharmacy.latitude,
          longitude: newPharmacy.longitude,
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
          status: "Active",
          joinedDate: dayjs(result.data.createdAt).format("DD MMMM YYYY"),
        };
        setPharmacies([newPharmacyData, ...pharmacies]);
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
        } de la pharmacie : ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel button click - resets form and closes modal
  const handleCancel = () => {
    resetForm();
    setShowAddModal(false);
  };

  // Handle backdrop click - only reset form if switching between modes
  const handleBackdropClick = () => {
    // Don't reset form data on backdrop click - just close modal
    // This preserves form data if user accidentally clicks outside
    setShowAddModal(false);
  };

  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          // Don't reset form on escape - just close modal
          // This preserves form data if user accidentally presses escape
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

  const formFields = [
    {
      label: "Nom de la pharmacie *",
      name: "name",
      type: "text",
      placeholder: "Entrez le nom de la pharmacie",
    },
    {
      label: "Adresse e-mail *",
      name: "email",
      type: "email",
      placeholder: "Entrez l'adresse e-mail",
    },
    {
      label: "Numéro de téléphone *",
      name: "phone",
      type: "tel",
      placeholder: "Entrez le numéro de téléphone (ex: +33780763734)",
    },
    ...(!isEditMode
      ? [
          {
            label: "Mot de passe *",
            name: "password",
            type: showPassword ? "text" : "password",
            placeholder: "Entrez un mot de passe sécurisé",
            isPassword: true,
          },
        ]
      : []),
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
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
          {/* Render only the "Nom de la pharmacie" field first */}
          {formFields
            .filter((field) => field.name === "name")
            .map((field) => (
              <div key={field.name} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type={field.type}
                    value={newPharmacy[field.name]}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    onBlur={() => handleBlur(field.name)}
                    className={`w-full px-3 py-2 border placeholder:text-[12px] placeholder:text-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm pr-10 transition-colors duration-200 ${
                      errors[field.name] && touched[field.name]
                        ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500 "
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder={field.placeholder}
                  />
                </div>
                {errors[field.name] && touched[field.name] && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
          {/* Add the "Adresse" field as the second field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse *
            </label>
            <Autocomplete
              onLoad={(autocomplete) => setAutocomplete(autocomplete)}
              onPlaceChanged={() => handlePlaceChanged(autocomplete)}
            >
              <input
                type="text"
                value={newPharmacy.address}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border placeholder:text-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Entrez l'adresse complète de la pharmacie"
                style={{ width: "100%" }} /* Ensure full width */
              />
            </Autocomplete>
            {errors.address && touched.address && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.address}
              </p>
            )}
          </div>
          {/* Render the remaining fields */}
          {formFields
            .filter((field) => field.name !== "name")
            .map((field) => (
              <div key={field.name} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type={field.type}
                    value={newPharmacy[field.name]}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    onBlur={() => handleBlur(field.name)}
                    className={`w-full px-3 py-2 border placeholder:text-[12px] placeholder:text-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm pr-10 transition-colors duration-200 ${
                      errors[field.name] && touched[field.name]
                        ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500 "
                        : "border-gray-300 hover:border-gray-400"
                    }`}
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
                {errors[field.name] && touched[field.name] && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
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
            disabled={loading || (isEditMode && !hasChanges())}
            className={`px-4 py-2 rounded-lg transition text-sm ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-wait"
                : isEditMode && !hasChanges()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#069AA2] hover:bg-[#05828A] text-white"
            }`}
          >
            {loading
              ? "Veuillez patienter..."
              : isEditMode
              ? "Mettre à jour la pharmacie"
              : "Ajouter la pharmacie"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPharmacyModal;
