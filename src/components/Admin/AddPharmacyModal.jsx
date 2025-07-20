import React, { useEffect, useState, useRef, useMemo } from "react";
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
  const [autocomplete, setAutocomplete] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [lastMode, setLastMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const addressInputRef = useRef(null);
  const isEditMode = !!pharmacyToEdit;
  const libraries = useMemo(() => ["places"], []);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Use Vite env variable
    libraries: libraries,
  });

  // Initialize Geocoder
  const geocoder = isLoaded ? new window.google.maps.Geocoder() : null;

  // Handle autocomplete load and configure options
  const onAutocompleteLoad = (autocomplete) => {
    setAutocomplete(autocomplete);

    // Configure autocomplete options
    if (autocomplete) {
      autocomplete.setOptions({
        // Restrict to specific types if needed
        // types: ['establishment'],
        componentRestrictions: { country: ["fr"] }, // Restrict to France
        // You can add more restrictions as needed
      });
    }
  };

  // Handle place selection from Autocomplete dropdown
  const handlePlaceChanged = () => {
    if (autocomplete) {
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
        setErrors({ ...errors, address: "" }); // Clear address error
      } else {
        setErrors({
          ...errors,
          address:
            "Veuillez sélectionner une adresse valide dans la liste ou saisir une adresse géocodable",
        });
      }
    }
  };

  // Handle manual address input
  const handleAddressChange = (e) => {
    setNewPharmacy({
      ...newPharmacy,
      address: e.target.value,
      latitude: null, // Reset coordinates to force geocoding on blur or submit
      longitude: null,
    });
  };

  // Geocode address to get latitude and longitude
  const geocodeAddress = async (address) => {
    if (!geocoder || !address) return false;

    try {
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK" && results[0]) {
            // Check if the match is too vague
            if (results[0].partial_match) {
              reject(
                new Error(
                  "L'adresse est trop vague, veuillez entrer une adresse plus précise"
                )
              );
            } else {
              resolve(results[0]);
            }
          } else {
            reject(new Error("Adresse non valide ou introuvable"));
          }
        });
      });

      console.log("🚀 ~ response ~ response:", response);

      const { lat, lng } = response.geometry.location;
      setNewPharmacy((prev) => ({
        ...prev,
        latitude: lat(),
        longitude: lng(),
      }));
      setErrors({ ...errors, address: "" });
      return true;
    } catch (error) {
      setErrors({
        ...errors,
        address:
          error.message ||
          "Impossible de géocoder l'adresse. Veuillez vérifier l'adresse saisie.",
      });
      return false;
    }
  };

  // Handle scroll event to reposition autocomplete dropdown
  useEffect(() => {
    const handleScroll = () => {
      if (autocomplete && window.google && window.google.maps) {
        // Force the autocomplete to recalculate its position
        window.google.maps.event.trigger(autocomplete, "resize");
      }
    };

    if (showAddModal && modalRef.current) {
      const modalElement = modalRef.current;
      modalElement.addEventListener("scroll", handleScroll);

      return () => {
        modalElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [showAddModal, autocomplete]);

  useEffect(() => {
    const currentMode = isEditMode ? "edit" : "add";
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
        latitude: pharmacyToEdit.latitude || null,
        longitude: pharmacyToEdit.longitude || null,
      });
    } else if (lastMode !== currentMode) {
      resetForm();
    }

    setLastMode(currentMode);
  }, [pharmacyToEdit, showAddModal]);

  const resetForm = () => {
    setNewPharmacy({
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      status: "",
      latitude: null,
      longitude: null,
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
    if (name.trim().length > 30) {
      return "Le nom de la pharmacie ne peut pas dépasser 30 caractères";
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
    if (isEditMode) return "";
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

  const handleInputChange = (name, value) => {
    setNewPharmacy({
      ...newPharmacy,
      [name]: value,
    });

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({
        ...errors,
        [name]: error,
      });
    }
  };

  const handleBlur = async (name) => {
    setTouched({
      ...touched,
      [name]: true,
    });

    const error = validateField(name, newPharmacy[name]);
    setErrors({
      ...errors,
      [name]: error,
    });

    if (name === "address" && newPharmacy.address) {
      // Ensure the user entered a valid address
      const success = await geocodeAddress(newPharmacy.address);
      if (!success) {
        setErrors({
          ...errors,
          address: "Veuillez entrer une adresse correcte et précise.",
        });
      }
    }
  };

  const hasChanges = () => {
    if (!isEditMode || !pharmacyToEdit) return true;
    return (
      newPharmacy.name !== pharmacyToEdit.name ||
      newPharmacy.email !== pharmacyToEdit.email ||
      newPharmacy.phone !== pharmacyToEdit.phone ||
      newPharmacy.address !== pharmacyToEdit.address
      // newPharmacy.latitude !== pharmacyToEdit.latitude ||
      // newPharmacy.longitude !== pharmacyToEdit.longitude
    );
  };

  const validateAllFields = async () => {
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

    // Validate coordinates
    if (!newPharmacy.latitude || !newPharmacy.longitude) {
      const success = await geocodeAddress(newPharmacy.address);
      if (!success) {
        newErrors.address =
          newErrors.address ||
          "Adresse non géocodable. Veuillez vérifier ou sélectionner une suggestion.";
      }
    }

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
    if (isEditMode && !hasChanges()) {
      toast.info("Aucune modification détectée", {
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    // Validate all fields and geocode address if necessary
    if (!(await validateAllFields())) {
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
        const payload = {};
        if (newPharmacy.name !== pharmacyToEdit.name)
          payload.name = newPharmacy.name;
        if (newPharmacy.email !== pharmacyToEdit.email)
          payload.email = newPharmacy.email;
        if (newPharmacy.phone !== pharmacyToEdit.phone)
          payload.phoneNumber = newPharmacy.phone;
        if (newPharmacy.address !== pharmacyToEdit.address)
          payload.address = newPharmacy.address;
        if (newPharmacy.latitude !== pharmacyToEdit.latitude)
          payload.latitude = newPharmacy.latitude;
        if (newPharmacy.longitude !== pharmacyToEdit.longitude)
          payload.longitude = newPharmacy.longitude;

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
        } de la pharmacie : ${error.message}`,
        {
          autoClose: 3000,
          theme: "dark",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    setShowAddModal(false);
  };

  const handleBackdropClick = () => {
    setShowAddModal(false);
  };

  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e) => {
        if (e.key === "Escape") {
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

  if (loadError) {
    return <div>Erreur de chargement de Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Chargement de Google Maps...</div>;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-[32rem] rounded-xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn scale-95 transition-transform p-6"
        style={{ position: "relative" }}
      >
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

        <div className="space-y-4">
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

          {/* Address field with Google Places Autocomplete */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse *
            </label>
            <div className="relative">
              <Autocomplete
                onLoad={onAutocompleteLoad}
                onPlaceChanged={handlePlaceChanged}
                options={{
                  // Add bounds to prioritize results near a specific location
                  // bounds: new google.maps.LatLngBounds(
                  //   new google.maps.LatLng(46.2, 1.8),
                  //   new google.maps.LatLng(49.5, 8.3)
                  // ),
                  componentRestrictions: { country: "fr" },
                  // fields: ["formatted_address", "geometry", "name"],
                  strictBounds: false,
                }}
              >
                <input
                  ref={addressInputRef}
                  type="text"
                  value={newPharmacy.address}
                  onChange={handleAddressChange}
                  onBlur={() => handleBlur("address")}
                  className={`w-full px-3 py-2 border placeholder:text-[12px] placeholder:text-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-colors duration-200 ${
                    errors.address && touched.address
                      ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Entrez l'adresse complète de la pharmacie"
                  autoComplete="address-line1"
                />
              </Autocomplete>
            </div>
            {errors.address && touched.address && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.address}
              </p>
            )}
          </div>

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
