import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/Admin/LoginPage.jsx";
import DashboardPage from "../pages/Admin/DashboardPage.jsx";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/Admin" element={<DashboardPage />} />
    </Routes>
  );
}
