// routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/Admin/LoginPage.jsx";
import DashboardPage from "../pages/Admin/DashboardPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function AppRoutes() {
  const { isAuthenticated, role, isLoading } = useAuth();
  // if (isLoading) {
  //   return <div>Loading...</div>; // Or a proper loading component
  // }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />

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

      {/* Protected Pharmacy Routes */}
      {/* <Route
        path="/pharmacy-dashboard"
        element={
          <ProtectedRoute roles={["pharmacy"]}>
            <PharmacyDashboard />
          </ProtectedRoute>
        }
      /> */}

      {/* Catch all route - redirect to appropriate dashboard or home */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              isAuthenticated
                ? role === "admin"
                  ? "/admin"
                  : "/pharmacy-dashboard"
                : "/"
            }
            replace
          />
        }
      />
    </Routes>
  );
}
