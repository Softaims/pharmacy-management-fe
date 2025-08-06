// pages/Pharmacy/PharmacyDashboard.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../../components/Pharmacy/Sidebar.jsx";
import Orders from "../../components/Pharmacy/Orders.jsx";
import Profile from "../../components/Pharmacy/Profile.jsx";
import Settings from "../../components/Pharmacy/Settings.jsx";
import Statistics from "../../components/Pharmacy/Statistics.jsx";
import { onMessage } from "firebase/messaging";
import { toast } from "react-toastify";
import Message from "../../components/Message.jsx";
import { messaging } from "../../firebase/firebaseConfig.js";
import { useRef } from "react";
// Mezordopro: Recevez, gérez et préparez les ordonnances en toute simplicité
export default function PharmacyDashboard() {
  const ordersRef = useRef(null); // Create ref for Orders component

  onMessage(messaging, (payload) => {
    // console.log("Message received. ", payload);
    toast.info(<Message notification={payload.notification} />);
    if (ordersRef.current) {
      ordersRef.current.fetchOrders(1, ""); // Refetch orders with page 1 and empty search term
    }
  });

  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <div className="w-[98px]  shadow-lg">
        <Sidebar />
      </div>
      <div className="flex-1 ">
        {/* Add margin-left for sidebar */}
        <div className="text-white bg-[#069AA2]  flex items-center justify-center border-b border-gray-200 h-[80px] px-4 bshadow-lg ">
          <h3 className="text-2xl font-semibold text-center leading-tight">
            <span className="font-bold">Mézordopro :</span> Recevez, gérez et
            préparez les ordonnances en toute simplicité
          </h3>
        </div>

        <Routes>
          <Route
            path="/"
            element={<Navigate to="/pharmacy/orders" replace />}
          />
          <Route path="/orders" element={<Orders ref={ordersRef} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
    </div>
  );
}
