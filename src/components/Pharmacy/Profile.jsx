import {
  FiLogOut,
  FiUser,
  FiMapPin,
  FiMail,
  FiPhone,
  FiKey,
  FiEye,
  FiEyeOff,
  FiEdit2,
} from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  // Get user data from AuthContext
  const { user, logout } = useAuth();

  // Password change state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
  };

  // Password validation (basic)
  const validatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Tous les champs sont obligatoires.");
      return false;
    }
    if (newPassword.length < 8) {
      setPasswordError(
        "Le nouveau mot de passe doit contenir au moins 8 caractères."
      );
      return false;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError(
        "Le nouveau mot de passe doit contenir au moins une lettre majuscule."
      );
      return false;
    }
    if (!/[0-9]/.test(newPassword)) {
      setPasswordError(
        "Le nouveau mot de passe doit contenir au moins un chiffre."
      );
      return false;
    }
    if (newPassword === currentPassword) {
      setPasswordError(
        "Le nouveau mot de passe ne doit pas être identique à l'actuel."
      );
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Placeholder for API call
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    if (!validatePassword()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      };
      const res = await import("../../api/apiService").then((m) =>
        m.default.updatePassword(payload)
      );
      setPasswordSuccess(res?.message || "Mot de passe changé avec succès.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsEditingPassword(false);
    } catch (err) {
      setPasswordError(
        err?.message || "Erreur lors du changement de mot de passe."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="mx-auto max-w-[80%]">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className=" font-bold text-gray-900">Profil</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-md"
          >
            <FiLogOut className="w-5 h-5" />
            Se déconnecter
          </button>
        </div>

        {/* Profile Fields */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 gap-6">
            {/* Pharmacy Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FiUser className="w-4 h-4 text-blue-600" />
                Nom de la pharmacie
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 font-medium">
                {user ? user.pharmacy?.name : "Chargement..."}{" "}
                {/* Displaying dynamic data */}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FiMapPin className="w-4 h-4 text-green-600" />
                Adresse
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 font-medium">
                {user ? user?.pharmacy.address : "Chargement..."}{" "}
                {/* Displaying dynamic data */}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FiMail className="w-4 h-4 text-purple-600" />
                E-mail
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 font-medium">
                {user ? user.email : "Chargement..."}{" "}
                {/* Displaying dynamic data */}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FiPhone className="w-4 h-4 text-orange-600" />
                Numéro de téléphone
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 font-medium">
                {user ? user.phoneNumber : "Chargement..."}{" "}
                {/* Displaying dynamic data */}
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="mt-8">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <FiKey className="w-4 h-4 text-gray-600" />
              Mot de passe
            </label>
            {!isEditingPassword ? (
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <span className="flex-1 text-gray-400 select-none">
                  ************
                </span>
                <button
                  className="ml-2 p-2 rounded hover:bg-gray-100 transition-colors"
                  onClick={() => setIsEditingPassword(true)}
                  aria-label="Modifier le mot de passe"
                >
                  <FiEdit2 className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            ) : (
              <form className="space-y-4 mt-2" onSubmit={handleChangePassword}>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Masquer" : "Afficher"}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirm((v) => !v)}
                      tabIndex={-1}
                      aria-label={showConfirm ? "Masquer" : "Afficher"}
                    >
                      {showConfirm ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                {passwordError && (
                  <div className="text-red-600 text-sm font-medium">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="text-green-600 text-sm font-medium">
                    {passwordSuccess}
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Enregistrement..."
                      : "Changer le mot de passe"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg font-semibold transition-colors"
                    onClick={() => {
                      setIsEditingPassword(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setPasswordError("");
                      setPasswordSuccess("");
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
