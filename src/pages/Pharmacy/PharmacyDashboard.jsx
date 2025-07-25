// pages/Pharmacy/PharmacyDashboard.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../../components/Pharmacy/Sidebar.jsx";
import Orders from "../../components/Pharmacy/Orders.jsx";
import Profile from "../../components/Pharmacy/Profile.jsx";
import Settings from "../../components/Pharmacy/Settings.jsx";
import Statistics from "../../components/Pharmacy/Statistics.jsx";

export default function PharmacyDashboard() {
  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <div className="w-[98px]  shadow-lg">
        <Sidebar />
      </div>
      <div className="flex-1 ">
        {/* Add margin-left for sidebar */}
        <div className="text-[#069AA2] flex items-center justify-center border-b border-gray-200 h-[80px] px-4 bshadow-lg rounded-lg">
          <h3 className="text-2xl font-semibold text-center leading-tight">
            <span className="font-bold">Mezardopro :</span> Gestion Intelligente
            de la Pharmacie
          </h3>
        </div>

        <Routes>
          <Route
            path="/"
            element={<Navigate to="/pharmacy/orders" replace />}
          />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
    </div>
  );
}
