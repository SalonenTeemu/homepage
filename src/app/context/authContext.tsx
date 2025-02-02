"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchWithAuth } from "../utils/apiUtils";
import { User } from "@/app/types/authTypes";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  logout: () => void;
  fetchProfile: () => any;
}

// Create a context with default value of undefined
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * The AuthProvider component provides the user object and related functions to its children.
 *
 * @returns The AuthProvider component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user data
  const fetchProfile = async () => {
    try {
      const res = await fetchWithAuth("/api/profile");

      if (!res) {
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    if (pathname === "/profile") {
      router.push("/");
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * The useAuth hook provides the user object and logout function.
 *
 * @returns The user object and logout function
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    console.log("useAuth must be used within an AuthProvider");
  }
  return context;
}
