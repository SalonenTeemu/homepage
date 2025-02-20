"use client";

import React, { createContext, useContext, useState } from "react";

interface NotificationContextProps {
	addNotification: (type: "success" | "error" | "info", message: string, duration?: number) => void;
	removeNotification: (id: number) => void;
}

// Create a context with default value of undefined
const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

/**
 * The NotificationProvider component provides the notification functions to its children.
 *
 * @returns The NotificationProvider component
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
	const [notifications, setNotifications] = useState<
		{ id: number; type: "success" | "error" | "info"; message: string }[]
	>([]);

	// Add a notification
	const addNotification = (type: "success" | "error" | "info", message: string, duration: number = 5000) => {
		const id = Date.now();
		setNotifications((prev) => [...prev, { id, type, message }]);

		// Remove notification after duration
		setTimeout(() => {
			setNotifications((prev) => prev.filter((notif) => notif.id !== id));
		}, duration);
	};

	// Remove a notification manually
	const removeNotification = (id: number) => {
		setNotifications((prev) => prev.filter((notif) => notif.id !== id));
	};

	return (
		<NotificationContext.Provider value={{ addNotification, removeNotification }}>
			{children}
			<NotificationContainer notifications={notifications} />
		</NotificationContext.Provider>
	);
}

// Custom hook to use the notification context
export const useNotification = () => useContext(NotificationContext);

// Notification Container Component
function NotificationContainer({
	notifications,
}: {
	notifications: { id: number; type: "success" | "error" | "info"; message: string }[];
}) {
	return (
		<div className="pointer-events-none fixed left-1/2 top-0 z-50 mt-4 flex -translate-x-1/2 transform flex-col items-center space-y-2">
			{notifications.map((notif) => (
				<Notification key={notif.id} type={notif.type} message={notif.message} />
			))}
		</div>
	);
}

// Notification Component
function Notification({ type, message }: { type: "success" | "error" | "info"; message: string }) {
	const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-yellow-500";
	const textColor = type === "success" || type === "info" ? "text-slate-950" : "text-slate-50";

	return (
		<div
			className={`w-full max-w-md rounded-md shadow-lg ${bgColor} flex items-center justify-center p-4 ${textColor} pointer-events-auto`}
		>
			<span className="text-md w-full text-center">{message}</span>
		</div>
	);
}
