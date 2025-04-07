"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useNotification } from "@/app/context/notificationContext";
import { fetchWithAuth } from "../utils/apiUtils";
import { User } from "@/app/types/authTypes";

// Define the AuthContextProps interface
export interface AuthContextProps {
	user: User | null;
	loading: boolean;
	logout: () => void;
	fetchProfile: () => any;
	setUser: (user: User | null) => void;
}

// Create a context with default value of undefined
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * The AuthProvider component provides the user object and related functions to its children.
 *
 * @returns The AuthProvider component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const notificationContext = useNotification();
	const router = useRouter();
	const pathname = usePathname();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	/**
	 * Fetches the user data from the server and sets the user state.
	 *
	 * @returns The user data
	 */
	const fetchProfile = async () => {
		try {
			const res = await fetchWithAuth("/api/profile", {}, logout, notificationContext.addNotification);

			if (!res) {
				setUser(null);
				return;
			}
			const data = await res.json();

			setUser(data);
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Logs out the user by sending a POST request to the server and clearing the user state.
	 */
	const logout = useCallback(async () => {
		try {
			await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
			if (pathname === "/profile") {
				router.push("/");
			}
			setUser(null);
		} catch {
			notificationContext.addNotification!("error", "Failed to log out.");
		}
	}, [pathname, router]);

	// Fetch the user profile on mount
	useEffect(() => {
		fetchProfile();
	}, []);

	// Refresh the access token every 14 minutes
	useEffect(() => {
		/**
		 * Refreshes the access token by sending a POST request to the server.
		 */
		const refreshToken = async () => {
			if (!user) return;

			try {
				const res = await fetch("/api/auth/refresh", {
					method: "POST",
					credentials: "include",
				});

				if (!res.ok) {
					logout();
				}
			} catch {
				logout();
			}
		};
		const interval = setInterval(refreshToken, 14 * 60 * 1000); // 14 minutes
		return () => clearInterval(interval);
	}, [user, logout]);

	return (
		<AuthContext.Provider value={{ user, loading, logout, fetchProfile, setUser }}>{children}</AuthContext.Provider>
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
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
