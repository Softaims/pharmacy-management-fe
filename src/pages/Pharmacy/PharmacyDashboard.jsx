// pages/Pharmacy/PharmacyDashboard.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../../components/Pharmacy/Sidebar.jsx";
import Orders from "../../components/Pharmacy/Orders.jsx";
import Profile from "../../components/Pharmacy/Profile.jsx";
import Settings from "../../components/Pharmacy/Settings.jsx";

export default function PharmacyDashboard() {
  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <div className="w-16">
        <Sidebar />
      </div>
      <div className="flex-1">
        {/* Add margin-left for sidebar */}
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/pharmacy/orders" replace />}
          />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}
