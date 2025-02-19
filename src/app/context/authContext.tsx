"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useNotification } from "@/app/context/notificationContext";
import { fetchWithAuth } from "../utils/apiUtils";
import { User } from "@/app/types/authTypes";

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
	const addNotification = notificationContext ? notificationContext.addNotification : () => {};
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
			const res = await fetchWithAuth("/api/profile", {}, logout, addNotification, router);

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

	/**
	 * Logs out the user by sending a POST request to the server and clearing the user state.
	 */
	const logout = useCallback(async () => {
		await fetch("/api/logout", { method: "POST", credentials: "include" });
		if (pathname === "/profile") {
			router.push("/");
		}
		setUser(null);
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
				const res = await fetch("/api/refresh", {
					method: "POST",
					credentials: "include",
				});

				if (!res.ok) {
					console.log("Token refresh failed, logging out...");
					logout();
				}
			} catch (err) {
				console.error("Error refreshing token:", err);
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
		console.log("useAuth must be used within an AuthProvider");
	}
	return context;
}
