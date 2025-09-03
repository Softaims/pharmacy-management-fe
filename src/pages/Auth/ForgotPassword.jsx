import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import apiService from "../../api/apiService";

const ForgotPassword = () => {
  // State management with better structure
  const [formState, setFormState] = useState({
    email: "",
    otp: ["", "", "", ""], // Array for 4-digit OTP
    newPassword: "",
    confirmPassword: "",
  });

  const [uiState, setUiState] = useState({
    step: 1, // 1: request, 2: verify otp, 3: reset password
    loading: false,
    showPassword: false,
    showConfirmPassword: false,
  });

  const [authData, setAuthData] = useState({
    userId: null,
    resetToken: "",
  });

  // Refs for OTP inputs
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();

  // Helper functions
  const updateFormState = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const updateUiState = (field, value) => {
    setUiState((prev) => ({ ...prev, [field]: value }));
  };

  const updateAuthData = (field, value) => {
    setAuthData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...formState.otp];
    newOtp[index] = value.slice(-1); // Only take last character
    updateFormState("otp", newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !formState.otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.email) {
      toast.error("Veuillez entrer votre adresse e-mail");
      return;
    }

    if (!validateEmail(formState.email)) {
      toast.error("Veuillez entrer une adresse e-mail valide");
      return;
    }

    updateUiState("loading", true);
    try {
      const payload = { email: formState.email };
      const res = await apiService.requestResetOtp(payload);
      if (res?.success) {
        toast.success(res.message || "Code OTP envoyé à votre e-mail");
        updateAuthData("userId", res?.data?.userId || null);
        updateUiState("step", 2);
      } else {
        toast.error(res.message || "Échec de la demande OTP");
      }
    } catch (err) {
      toast.error(err.message || "Erreur lors de la requête");
    } finally {
      updateUiState("loading", false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = formState.otp.join("");
    if (!otpString || otpString.length !== 4) {
      toast.error("Veuillez entrer le code OTP complet");
      return;
    }

    updateUiState("loading", true);
    try {
      const payload = { email: formState.email, code: otpString };
      const res = await apiService.verifyResetOtp(payload);
      if (res?.success && res?.data?.verified) {
        toast.success(res.message || "OTP vérifié");
        updateAuthData("resetToken", res?.data?.resetToken || "");
        updateAuthData("userId", res?.data?.userId || authData.userId);
        updateUiState("step", 3);
      } else {
        toast.error(res.message || "Échec de la vérification OTP");
      }
    } catch (err) {
      toast.error(err.message || "Erreur lors de la vérification OTP");
    } finally {
      updateUiState("loading", false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formState.newPassword || !authData.resetToken) {
      toast.error("Veuillez entrer le nouveau mot de passe");
      return;
    }

    if (!validatePassword(formState.newPassword)) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (formState.newPassword !== formState.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    updateUiState("loading", true);
    try {
      const otpString = formState.otp.join("");
      const payload = {
        code: otpString,
        newPassword: formState.newPassword,
        confirmPassword: formState.confirmPassword,
      };
      const res = await apiService.resetPassword(payload, authData.resetToken);
      if (res?.success) {
        toast.success(res.message || "Mot de passe réinitialisé avec succès");
        navigate("/login");
      } else {
        toast.error(res.message || "Échec de la réinitialisation");
      }
    } catch (err) {
      toast.error(err.message || "Erreur lors de la réinitialisation");
    } finally {
      updateUiState("loading", false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Réinitialiser le mot de passe
          </h2>
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-3 h-3 rounded-full ${
                  stepNum === uiState.step
                    ? "bg-[#069AA2]"
                    : stepNum < uiState.step
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Email */}
        {uiState.step === 1 && (
          <>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Entrez l'adresse e-mail associée à votre compte pharmacie. Nous
              enverrons un code OTP à cet e-mail.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => updateFormState("email", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#069AA2] text-gray-900 placeholder-gray-400"
                  placeholder="exemple@email.com"
                  required
                  disabled={uiState.loading}
                />
              </div>

              <button
                type="submit"
                disabled={uiState.loading}
                className="w-full py-3 px-4 bg-[#069AA2] text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-[#05828A] transition-colors"
              >
                {uiState.loading ? "Envoi..." : "Envoyer le code OTP"}
              </button>
            </form>
          </>
        )}

        {/* Step 2: OTP Verification */}
        {uiState.step === 2 && (
          <>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Entrez le code à 4 chiffres envoyé à votre e-mail
            </p>
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Code OTP
                </label>
                <div className="flex justify-center space-x-3">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      maxLength="1"
                      value={formState.otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#069AA2] focus:border-[#069AA2] text-gray-900"
                      disabled={uiState.loading}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uiState.loading}
                  className="flex-1 py-3 px-4 bg-[#069AA2] text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-[#05828A] transition-colors"
                >
                  {uiState.loading ? "Vérification..." : "Vérifier"}
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 3: Reset Password */}
        {uiState.step === 3 && (
          <>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Créez votre nouveau mot de passe
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={uiState.showPassword ? "text" : "password"}
                    value={formState.newPassword}
                    onChange={(e) =>
                      updateFormState("newPassword", e.target.value)
                    }
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#069AA2] text-gray-900 placeholder-gray-400"
                    placeholder="Minimum 8 caractères"
                    required
                    disabled={uiState.loading}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateUiState("showPassword", !uiState.showPassword)
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {uiState.showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={uiState.showConfirmPassword ? "text" : "password"}
                    value={formState.confirmPassword}
                    onChange={(e) =>
                      updateFormState("confirmPassword", e.target.value)
                    }
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#069AA2] text-gray-900 placeholder-gray-400"
                    placeholder="Répétez le mot de passe"
                    required
                    disabled={uiState.loading}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateUiState(
                        "showConfirmPassword",
                        !uiState.showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {uiState.showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formState.newPassword &&
                  formState.confirmPassword &&
                  formState.newPassword !== formState.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      Les mots de passe ne correspondent pas
                    </p>
                  )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uiState.loading}
                  className="flex-1 py-3 px-4 bg-[#069AA2] text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-[#05828A] transition-colors"
                >
                  {uiState.loading ? "Réinitialisation..." : "Réinitialiser"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
