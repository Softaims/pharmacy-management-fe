// src/components/FCMHandler.jsx
import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { useAuth } from "../contexts/AuthContext";
import { messaging } from "../firebase/firebaseConfig";
import apiService from "../api/apiService";
import { toast } from "react-toastify";

const { VITE_APP_VAPID_KEY } = import.meta.env;

export default function FCMHandler() {
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    const handleFCM = async () => {
      if (isAuthenticated && role === "pharmacy") {
        try {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            const deviceToken = await getToken(messaging, {
              vapidKey: VITE_APP_VAPID_KEY,
            });
            await apiService.registerDeviceToken({ deviceToken });
          } else {
            toast.error("Notifications are blocked in browser settings.");
          }
        } catch (err) {
          console.error("Error getting FCM token", err);
        }
      }
    };

    handleFCM();
  }, [isAuthenticated, role]);

  return null; // Component only handles side-effects
}
