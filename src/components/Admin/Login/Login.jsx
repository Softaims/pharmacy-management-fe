import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Validation ---
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
      // Simulated delay to mimic API
      await new Promise((res) => setTimeout(res, 1000));
      // Replace this with real API call later
      // Example:
      // const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password, role }),
      // });

      // const result = await response.json();
      // if (!response.ok) throw new Error(result.message);

      toast.success("Connexion réussie ! Redirection...", {
        autoClose: 2000,
        theme: "dark",
      });

      // Redirect based on role
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/pharmacy-dashboard");
        }
      }, 2000);
    } catch (err) {
      toast.error(err.message || "Une erreur s'est produite", {
        autoClose: 3000,
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
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            MédocPro
          </h2>
          <p className="mt-2 text-center text-base text-gray-500 dark:text-gray-400">
            Une plateforme conçue pour simplifier la gestion des ordonnances
          </p>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-10 px-6 shadow-2xl sm:rounded-2xl sm:px-12 transform transition-all duration-500 ease-in-out hover:-translate-y-1">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="Entrez votre e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#069AA2] focus:border-transparent sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#069AA2] focus:border-transparent sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                autoComplete="current-password"
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Sélectionnez votre rôle
              </label>
              <div
                className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1"
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
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                      role === option.value
                        ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-500"
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
                disabled={loading || !email || !password}
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
