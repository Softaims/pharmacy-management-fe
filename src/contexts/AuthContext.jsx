import React, { createContext, useContext, useReducer, useEffect } from "react";
import Cookies from "js-cookie";
import apiService from "../api/apiService";

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  role: null, // 'admin' or 'pharmacy'
};

// Action types
const actionTypes = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
  SET_USER: "SET_USER",
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        role: action.payload.role,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
      };
    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        role: action.payload.role,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = Cookies.get("accessToken");
      const userRole = Cookies.get("userRole");

      if (accessToken) {
        try {
          // Verify token and get user data
          const userData = await apiService.getCurrentUser();
          dispatch({
            type: actionTypes.SET_USER,
            payload: {
              user: userData.data,
              role: userRole || "admin",
            },
          });
        } catch (error) {
          console.log("🚀 ~ initializeAuth ~ error:", error);
          // Token is invalid, clear cookies
          // Cookies.remove("accessToken");
          // Cookies.remove("refreshToken");
          // Cookies.remove("userRole");
          dispatch({ type: actionTypes.LOGOUT });
        }
      } else {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });

    try {
      const response = await (credentials.role === "admin"
        ? apiService.Signin(credentials)
        : apiService.PharSign(credentials));

      // Store user role in cookie
      Cookies.set("userRole", credentials.role, {
        expires: 7,
        // secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: {
          user: response.data.user || response.data,
          role: credentials.role,
        },
      });

      return response;
    } catch (error) {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.log("Logout API error:", error);
    } finally {
      // Clear cookies
      // Cookies.remove("accessToken");
      // Cookies.remove("refreshToken");
      // Cookies.remove("userRole");

      dispatch({ type: actionTypes.LOGOUT });
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await apiService.refreshToken({ refreshToken });

      // Update access token
      Cookies.set("accessToken", response.data.accessToken, {
        expires: 1,
        // secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      return response.data.accessToken;
    } catch (error) {
      // Refresh failed, logout user
      logout();
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
