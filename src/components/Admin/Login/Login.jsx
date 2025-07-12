import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../contexts/AuthContext";
import logo from "../../../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const from =
    location.state?.from?.pathname ||
    (role === "admin" ? "/admin" : "/pharmacy");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      toast.error("Veuillez remplir tous les champs", {
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Veuillez entrer une adresse e-mail valide", {
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    setLoading(true);

    try {
      await login({ email, password, role });

      toast.success("Connexion réussie ! Redirection...", {
        autoClose: 2000,
        theme: "dark",
      });
      navigate(from, { replace: true });
    } catch (err) {
      console.log("🚀 ~ handleSubmit ~ err:", err);
      toast.error(err.message || "Une erreur s'est produite", {
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg from-indigo-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          <img
            className="h-16 w-auto transition-transform duration-300 hover:scale-105"
            src={logo}
            alt="Logo MédocPro"
          />
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 ">
            MédocPro
          </h2>
          <p className="mt-2 text-center text-base text-gray-500 0">
            Une plateforme conçue pour simplifier la gestion des ordonnances
          </p>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-2xl sm:rounded-2xl sm:px-12 transform transition-all duration-500 ease-in-out hover:-translate-y-1">
          <form
            className="space-y-6"
            onSubmit={handleSubmit}
            noValidate={false}
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 "
              >
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="Entrez votre e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className=" fragmt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#069AA2] focus:border-transparent sm:text-sm bg-white text-gray-900 transition-all duration-200"
                autoComplete="email"
                required
                disabled={isLoading || loading}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 "
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#069AA2] focus:border-transparent sm:text-sm bg-white text-gray-900 transition-all duration-200"
                  autoComplete="current-password"
                  required
                  disabled={isLoading || loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  disabled={isLoading || loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sélectionnez votre rôle
              </label>
              <div
                className="flex bg-gray-100 rounded-lg p-1"
                role="radiogroup"
                aria-labelledby="role-label"
              >
                {[
                  { value: "admin", label: "Admin" },
                  { value: "pharmacy", label: "Pharmacie" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    disabled={isLoading || loading}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                      role === option.value
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200 "
                    } ${
                      isLoading || loading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    role="radio"
                    aria-checked={role === option.value}
                    tabIndex={role === option.value ? 0 : -1}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
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
                    Connexion...
                  </span>
                ) : (
                  "Se connecter"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
