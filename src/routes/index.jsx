import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Admin/LoginPage.jsx";
import DashboardPage from "../pages/Admin/DashboardPage.jsx";
import PharmacyDashboard from "../pages/Pharmacy/PharmacyDashboard.jsx";
import CreatePharmacyPass from "../pages/Pharmacy/CreatePharmacyPass.jsx";
import ForgotPassword from "../pages/Auth/ForgotPassword.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import useDocumentTitle from "../components/useDocumentTitle.js";

export default function AppRoutes() {
  const { isAuthenticated, role } = useAuth();

  // if (isLoading) {
  //   return <div>Loading...</div>; // Or a proper loading component
  // }
  useDocumentTitle(
    isAuthenticated
      ? role === "admin"
        ? "Mézordopro | Accès admin"
        : "Mézordopro | Accès pharmacien"
      : "Mézordopro | Login"
  );

  return (
    <Routes>
      {/* Login Route - Redirect if already authenticated */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={role === "admin" ? "/admin" : "/pharmacy"} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* <Route path="/set-password" element={<CreatePharmacyPass />} /> */}
      <Route
        path="/set-password"
        element={
          isAuthenticated && role === "admin" ? (
            <Navigate to="/admin" replace />
          ) : (
            <CreatePharmacyPass />
          )
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <Navigate
            to={
              isAuthenticated
                ? role === "admin"
                  ? "/admin"
                  : "/pharmacy"
                : "/login"
            }
            replace
          />
        }
      />

      {/* Protected Pharmacy Routes */}
      <Route
        path="/pharmacy/*"
        element={
          <ProtectedRoute roles={["pharmacy"]}>
            <PharmacyDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
