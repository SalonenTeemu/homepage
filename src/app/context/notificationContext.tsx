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
		const id = Date.now() + Math.floor(Math.random() * 1000);

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

/**
 * The useNotification hook provides access to the notification functions.
 *
 * @returns The notification context
 */
export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error("useNotification must be used within a NotificationProvider");
	}
	return context;
};

// NotificationContainer Component
function NotificationContainer({
	notifications,
}: {
	notifications: { id: number; type: "success" | "error" | "info"; message: string }[];
}) {
	return (
		<div className="pointer-events-none fixed left-0 top-0 z-50 mt-4 flex w-full flex-col items-center space-y-2 px-4">
			{notifications.map((notif) => (
				<Notification key={notif.id} id={notif.id} type={notif.type} message={notif.message} />
			))}
		</div>
	);
}

// Notification Component
function Notification({ id, type, message }: { id: number; type: "success" | "error" | "info"; message: string }) {
	const { removeNotification } = useNotification()!;
	const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-yellow-500";
	const textColor = type === "success" || type === "info" ? "text-slate-950" : "text-slate-50";
	const buttonHoverTextColor = type === "success" || type === "info" ? "hover:text-slate-50" : "hover:text-slate-950";

	return (
		<div
			className={`w-full max-w-3xl rounded-md shadow-lg ${bgColor} flex items-center p-2 ${textColor} pointer-events-auto`}
		>
			<div className="flex-grow text-center">
				<span className="text-md whitespace-normal break-words">{message}</span>
			</div>

			<button
				onClick={() => removeNotification(id)}
				className={`ml-2 px-2 py-1 text-xl transition ${textColor} ${buttonHoverTextColor}`}
			>
				✖
			</button>
		</div>
	);
}
