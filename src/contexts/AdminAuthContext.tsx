import React, { createContext, useContext, useState, useEffect } from "react";
import { adminAuthApi } from "@/lib/api";

interface AdminUser {
  id: number;
  username: string;
  name: string;
  email: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      adminAuthApi
        .getProfile()
        .then((response) => {
          if (response.success) {
            setAdmin(response.data);
          }
        })
        .catch(() => {
          localStorage.removeItem("admin_token");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await adminAuthApi.login(username, password);
    if (response.success) {
      localStorage.setItem("admin_token", response.data.token);
      setAdmin(response.data.admin);
    } else {
      throw new Error(response.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setAdmin(null);
    window.location.href = "/admin";
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};
