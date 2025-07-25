// api/apiService.js (Updated version)
import axios from "./axiosInstance";
import Cookies from "js-cookie";

const apiService = {
  // Admin login
  Signin: async (payload) => {
    console.log("🚀 ~ Signin: ~ payload:", payload);
    try {
      const response = await axios.post("/admin/login", payload);
      console.log("🚀 ~ Signin: ~ response:", response);
      const staticExpiryDate = new Date();
      staticExpiryDate.setDate(staticExpiryDate.getDate() + 7); // 7 days from now

      // Store tokens in cookies
      const { accessToken, refreshToken } = response.data.data;
      Cookies.set("accessToken", accessToken, {
        expires: staticExpiryDate,
      });

      // Store refresh token
      Cookies.set("refreshToken", refreshToken, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      return response.data;
    } catch (error) {
      console.log("🚀 ~ Signin: ~ error:", error.response?.data || error);
      throw error.response?.data || { message: "Something went wrong" };
    }
  },

  // Pharmacy login
  PharSign: async (payload) => {
    console.log("🚀 ~ PharSign: ~ payload:", payload);

    try {
      // Format the payload to match the required structure
      const formattedPayload = {
        identifier: payload.email,
        password: payload.password,
        role: "PHARMACY",
      };

      const response = await axios.post("/auth/login", formattedPayload);

      // Store tokens in cookies
      const { accessToken, refreshToken, user } = response.data.data;
      const staticExpiryDate = new Date();
      staticExpiryDate.setDate(staticExpiryDate.getDate() + 7);

      Cookies.set("accessToken", accessToken, {
        expires: staticExpiryDate,
      });
      Cookies.set("refreshToken", refreshToken, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      return response.data;
    } catch (error) {
      console.log("🚀 ~ PharSign: ~ error:", error.response?.data || error);
      throw error.response?.data || { message: "Something went wrong" };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await axios.get("/auth/me");
      return response.data;
    } catch (error) {
      console.log(
        "🚀 ~ getCurrentUser: ~ error:",
        error.response?.data || error
      );
      throw error.response?.data || { message: "Failed to get user data" };
    }
  },

  // Refresh token
  refreshToken: async (payload) => {
    try {
      const response = await axios.post("/auth/refresh", payload);
      return response.data;
    } catch (error) {
      console.log("🚀 ~ refreshToken: ~ error:", error.response?.data || error);
      throw error.response?.data || { message: "Failed to refresh token" };
    }
  },

  // Logout
  logout: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userRole");
  },

  // Admin specific APIs
  getPharmacies: async () => {
    try {
      const response = await axios.get("/admin/pharmacies");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to get pharmacies" };
    }
  },

  addPharmacy: async (payload) => {
    try {
      const response = await axios.post("/admin/pharmacy/create", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to add pharmacy" };
    }
  },
  updatePharmacy: async (id, payload) => {
    try {
      const response = await axios.patch(`/admin/pharmacy/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update pharmacy" };
    }
  },

  deletePharmacy: async (id) => {
    try {
      const response = await axios.delete(`/admin/pharmacy/${id}`);
      console.log("🚀 ~ deletePharmacy: ~ response:", response);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete pharmacy" };
    }
  },
  changeStatus: async (id, isActive) => {
    console.log(
      "🚀 ~ changeStatus: ~ isActive:,,,,,,,,,,,,,,,,,,,,,,,,,",
      isActive,
      id
    );
    try {
      const response = await axios.patch(`/admin/pharmacy/${id}/status`, {
        isActive,
      });
      console.log("🚀 ~ changeStatus: ~ response:", response);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Échec de la mise à jour du statut de la pharmacie",
        }
      );
    }
  },

  // Pharmacy specific APIs
  getPharmacyDashboard: async () => {
    try {
      const response = await axios.get("/pharmacy/dashboard");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to get dashboard data" };
    }
  },
  changeOrderStatus: async (id, status) => {
    console.log(
      "🚀 ~ changeOrderStatus: ~ id, status,,,,,,,,,,,,,,,:",
      id,
      status
    );
    try {
      const response = await axios.patch(`/order/status/${id}`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Échec de la mise à jour du statut de la commande",
        }
      );
    }
  },
  changeOrderStatusWithDetails: async (orderId, newStatus, deliveryDetails) => {
    console.log(
      "🚀 ~ changeOrderStatusWithDetails: ~ orderId, newStatus, deliveryDetails:",
      orderId,
      newStatus,
      deliveryDetails
    );

    // Determine completionStatus based on deliveryDetails.type
    const completionStatus =
      deliveryDetails.type === "complete"
        ? "fully"
        : deliveryDetails.type === "partial"
        ? "partially"
        : "";

    const payload = {
      notes: deliveryDetails.note,
      completionStatus: completionStatus, // Set based on type (complete or partial)
      nextStatus: newStatus,
    };

    try {
      const response = await axios.patch(
        `/pharmacy/orders/completion-status/${orderId}`,
        payload
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message ||
          "Error updating order status with details."
      );
    }
  },

  getOrders: async (page = 1, limit = 100) => {
    try {
      // Sending pagination parameters with the request
      const response = await axios.get("/pharmacy/orders", {
        params: {
          page, // The current page number (default is 1)
          limit, // The number of items per page (default is 100)
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to get orders" };
    }
  },
  getOrderHistory: async (orderId) => {
    try {
      const response = await axios.get(`pharmacy/orders/history/${orderId}`);
      console.log("🚀 ~ getOrderHistory: ~ response:", response);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to get order history" };
    }
  },
  updateOrderHistory: async (id, editHistoryDetails) => {
    console.log(
      "🚀 ~ updateOrderHistory: ~ orderId, historyId, payload:",
      id,
      editHistoryDetails
    );

    // Dynamically set the completionStatus
    const completionStatus =
      editHistoryDetails.completionStatus === "FULLY_COMPLETED"
        ? "fully"
        : "partially";

    // Update the payload with the correct completionStatus
    const payload = {
      notes: editHistoryDetails.pharmacyNote,
      completionStatus: completionStatus,
    };

    try {
      const response = await axios.patch(
        `/pharmacy/orders/completion-status/${id}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to update order history" }
      );
    }
  },
  // Get pharmacy analytics (orders by status)
  getAnalytics: async () => {
    try {
      const response = await axios.get("/pharmacy/analytics");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to get analytics" };
    }
  },
};

export default apiService;
