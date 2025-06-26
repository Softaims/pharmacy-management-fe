// api/apiService.js (Updated version)
import axios from "./axiosInstance";
import Cookies from "js-cookie";

const apiService = {
  // Admin login
  Signin: async (payload) => {
    console.log("🚀 ~ Signin: ~ payload:", payload);

    try {
      const response = await axios.post("/auth/admin/login", payload);
      console.log("🚀 ~ Signin: ~ response:", response);
      const staticExpiryDate = new Date();
      staticExpiryDate.setDate(staticExpiryDate.getDate() + 7); // 7 days from now

      // Store tokens in cookies
      const { accessToken, refreshToken } = response.data.data;
      Cookies.set("accessToken", accessToken, {
        expires: staticExpiryDate,
      });
      // Store access token
      // Cookies.set("accessToken", accessToken, {
      //   expires: 7, // 1 day
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "Strict",
      // });

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
      const response = await axios.post("/auth/pharmacy/login", payload);
      console.log("🚀 ~ PharSign: ~ response:", response);

      // Store tokens in cookies
      const { accessToken, refreshToken, user } = response.data.data;

      Cookies.set("accessToken", accessToken, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
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
  // logout: async () => {
  //   try {
  //     const response = await axios.post("/auth/logout");
  //     return response.data;
  //   } catch (error) {
  //     console.log("🚀 ~ logout: ~ error:", error.response?.data || error);
  //     // Don't throw error for logout, just log it
  //     return null;
  //   } finally {
  //     // Always clear cookies on logout
  //     Cookies.remove("accessToken");
  //     Cookies.remove("refreshToken");
  //     Cookies.remove("userRole");
  //   }
  // },

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

  getOrders: async () => {
    try {
      const response = await axios.get("/pharmacy/orders");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to get orders" };
    }
  },
};

export default apiService;
// import axios from "./axiosInstance";
// import Cookies from "js-cookie"; // Import js-cookie to manage cookies

// const apiService = {
//   Signin: async (payload) => {
//     console.log("🚀 ~ Signin: ~ payload:", payload);

//     try {
//       const response = await axios.post("/auth/admin/login", payload);
//       console.log("🚀 ~ Signin: ~ response:", response);

//       // Store tokens in cookies (Set cookie with HttpOnly, Secure, and SameSite flags for best security)
//       const { accessToken, refreshToken } = response.data.data;

//       // Store access token in a cookie with HttpOnly, Secure and SameSite flags (Recommended for Security)
//       Cookies.set("accessToken", accessToken, {
//         expires: 1, // 1 day expiration for example
//         secure: true, // Cookie is only sent over HTTPS
//         sameSite: "Strict", // Helps mitigate CSRF
//       });

//       // Store refresh token as well, for refreshing access token when expired
//       Cookies.set("refreshToken", refreshToken, {
//         expires: 7, // Longer expiration for refresh token (7 days as an example)
//         secure: true,
//         sameSite: "Strict",
//       });

//       return response.data;
//     } catch (error) {
//       console.log("🚀 ~ Signin: ~ error:", error.response?.data || error);
//       throw error.response ? error.response.data : "Something went wrong";
//     }
//   },

//   logout: () => {
//     // Delete cookies upon logout
//     Cookies.remove("accessToken");
//     Cookies.remove("refreshToken");
//     return axios.post("/v1/logout");
//   },

//   getCurrentUser: () => axios.get("/v1/me"),
// };

// export default apiService;
