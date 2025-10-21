"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient, type User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (token: string, newPassword: string) => Promise<any>;
  googleLogin: (token: string) => Promise<any>;
  verifyEmail: (token: string) => Promise<any>;
  refreshUser: () => Promise<void>;
  updateProfile: (profileData: {
    name?: string;
    email?: string;
    phone?: string;
  }) => Promise<any>;
  changePassword: (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = apiClient.getToken();
        if (token) {
          await refreshUser();
        }
      } catch (error) {
        apiClient.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const refreshUser = async (retryCount = 0) => {
    try {
      const token = apiClient.getToken();
      if (!token) {
        setUser(null);
        return;
      }

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        // Simplified session fetch - let backend handle token validation
        const response = await apiClient.getSession();
        clearTimeout(timeoutId);
        
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          throw new Error("Failed to get user session");
        }
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Too many requests") || error.message.includes("aborted"))
      ) {
        if (retryCount < 2) {
          setTimeout(() => {
            refreshUser(retryCount + 1);
          }, (retryCount + 1) * 2000);
          return;
        }
      }

      console.warn("Authentication failed:", error);
      apiClient.logout();
      setUser(null);
    }
  };

  const login = async (email: string, password: string, retryCount = 0) => {
    try {
      setIsLoading(true);
      const response = await apiClient.login({ email, password });

      if (response.success && response.data?.user && response.data?.token) {
        apiClient.setToken(response.data.token);
        setUser(response.data.user);
        return response;
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Too many requests")
      ) {
        if (retryCount < 2) {
          setIsLoading(false);
          setTimeout(() => {
            login(email, password, retryCount + 1);
          }, (retryCount + 1) * 2000);
          return;
        }
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.register({ name, email, password });
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
      // Clear any remaining auth state
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Optionally redirect to login page
        // window.location.href = "/home/auth/sign-in";
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Force clear state even if API call fails
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await apiClient.forgotPassword(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const response = await apiClient.resetPassword({ token, newPassword });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const response = await apiClient.verifyEmail(token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (code: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.googleLogin(code);

      if (response.success && response.data?.user && response.data?.token) {
        // Set user immediately with fresh data from backend
        setUser(response.data.user);
        return response;
      } else {
        throw new Error(response.message || "Google login failed");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: {
    name?: string;
    email?: string;
    phone?: string;
  }) => {
    try {
      const response = await apiClient.updateProfile(profileData);
      if (response.success) {
        await refreshUser();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      const response = await apiClient.changePassword(passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    googleLogin,
    verifyEmail,
    refreshUser,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
