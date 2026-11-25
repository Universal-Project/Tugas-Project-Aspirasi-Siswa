"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export type UserRole = "admin" | "siswa";

export interface User {
  username?: string;
  nis?: string | number;
  kelas?: string;
}

export interface AuthState {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  loginAdmin: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginSiswa: (nis: string, kelas: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token") || localStorage.getItem("sipelapor_token");
      const storedRole = (localStorage.getItem("role") || localStorage.getItem("sipelapor_role")) as UserRole | null;
      const storedUser = localStorage.getItem("user") || localStorage.getItem("sipelapor_user");

      if (storedToken && storedRole && storedUser) {
        setToken(storedToken);
        setRole(storedRole);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAdmin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authApi.loginAdmin(username, password);
      const adminUser: User = { username: data.admin || username };
      setUser(adminUser);
      setRole("admin");
      setToken(data.token);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "admin");
      localStorage.setItem("user", JSON.stringify(adminUser));

      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Username atau password salah.";
      return { success: false, message: errorMsg };
    }
  };

  const loginSiswa = async (nis: string, kelas: string) => {
    setIsLoading(true);
    try {
      const data = await authApi.loginSiswa(nis, kelas);
      const studentUser: User = {
        nis: data.siswa?.nis || nis,
        kelas: data.siswa?.kelas || kelas,
      };
      setUser(studentUser);
      setRole("siswa");
      setToken(data.token);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "siswa");
      localStorage.setItem("user", JSON.stringify(studentUser));

      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "NIS atau Kelas salah.";
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("sipelapor_token");
    localStorage.removeItem("sipelapor_role");
    localStorage.removeItem("sipelapor_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        loginAdmin,
        loginSiswa,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
