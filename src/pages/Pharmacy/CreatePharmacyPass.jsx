import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "../../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CreatePharmacyPass = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  console.log("🚀 ~ CreatePharmacyPass ~ token:", token);

  const baseURL = `${import.meta.env.VITE_API_BASE_URL}/api`;

  const validatePassword = (pwd) => {
    const isValid = pwd.length >= 10 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd);
    return isValid
      ? ""
      : "Le mot de passe doit comporter au moins 10 caractères, inclure 1 lettre majuscule et 1 chiffre.";
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (hasInteracted) {
      setPasswordError(validatePassword(newPassword));
    }
  };

  const handlePasswordBlur = () => {
    setHasInteracted(true);
    setPasswordError(validatePassword(password));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const isFormValid = () => {
    return (
      password &&
      confirmPassword &&
      password === confirmPassword &&
      !validatePassword(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs", {
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    const validationError = validatePassword(password);
    if (validationError) {
      setPasswordError(validationError);
      toast.error("Veuillez corriger les erreurs du mot de passe", {
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas", {
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${baseURL}/auth/create-pharmacy-password`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Mot de passe créé avec succès ! Redirection...", {
        autoClose: 2000,
        theme: "dark",
      });
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Une erreur s'est produite", {
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          <img
            className="h-16 w-auto transition-transform duration-300 hover:scale-105"
            src={logo}
            alt="Logo MédocPro"
          />
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900">
            Mézordo Pro
          </h2>
          <p className="mt-2 text-center text-base text-gray-500">
            Configurez votre mot de passe pharmacie
          </p>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-2xl sm:rounded-2xl sm:px-12 transform transition-all duration-500 ease-in-out hover:-translate-y-1">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  onPaste={handlePasswordChange}
                  className={`mt-2 w-full px-4 py-3 border ${
                    passwordError && hasInteracted
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#069AA2] focus:border-transparent sm:text-sm bg-white text-gray-900 transition-all duration-200`}
                  autoComplete="new-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {passwordError && hasInteracted && (
                <p className="mt-1 text-sm text-red-500">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmez votre mot de passe"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onPaste={handleConfirmPasswordChange}
                  className={`mt-2 w-full px-4 py-3 border ${
                    hasInteracted &&
                    password !== confirmPassword &&
                    confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#069AA2] focus:border-transparent sm:text-sm bg-white text-gray-900 transition-all duration-200`}
                  autoComplete="new-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {hasInteracted &&
                password !== confirmPassword &&
                confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    Les mots de passe ne correspondent pas
                  </p>
                )}
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-[#069AA2] hover:bg-[#05828A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#069AA2] transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Création...
                  </span>
                ) : (
                  "Créer le mot de passe"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePharmacyPass;
