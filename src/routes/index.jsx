import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Admin/LoginPage.jsx";
import DashboardPage from "../pages/Admin/DashboardPage.jsx";
import PharmacyDashboard from "../pages/Pharmacy/PharmacyDashboard.jsx";

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
            <Navigate
              to={role === "admin" ? "/admin" : "/pharmacy-dashboard"}
              replace
            />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all route - redirect to appropriate dashboard or home */}
      <Route
        path="*"
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
