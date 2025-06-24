import axios from "./axiosInstance";
const apiService = {
  logout: () => axios.post("/v1/logout"),
  customSignup: (payload) => axios.post("/v1/signup", payload),
  customSignin: (payload) => axios.post("/v1/signin", payload),
  // ✅ Google Login
  googleLogin: (payload) => axios.post("/v1/google-login", payload),
  getCurrentUser: () => axios.get("/v1/me"),
};

export default apiService;
