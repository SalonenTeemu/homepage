"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/authContext";
import { useNotification } from "@/app/context/notificationContext";
import { isUsernameValid, isPasswordValid, isEmailValid } from "@/app/utils/utils";

/**
 * The Login component.
 *
 * @returns {JSX.Element} The Login component
 */
export default function Login() {
	const router = useRouter();
	const authContext = useAuth();
	const notificationContext = useNotification();
	const [usernameOrEmail, setUsernameOrEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

	/**
	 * Handles the form submission to login.
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!usernameOrEmail || (!isUsernameValid(usernameOrEmail) && !isEmailValid(usernameOrEmail))) {
			notificationContext?.addNotification("error", "Login failed. Invalid username or email.");
			return;
		}

		if (!password || !isPasswordValid(password)) {
			notificationContext?.addNotification("error", "Login failed. Invalid password.");
			return;
		}

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					usernameOrEmail,
					password,
				}),
				credentials: "include",
			});

			const data = await res.json();

			if (!res.ok) {
				notificationContext?.addNotification("error", `Login failed. ${data.response}.`);
				return;
			}
			await authContext?.fetchProfile();
			notificationContext?.addNotification("success", "Welcome!");
			router.push("profile");
		} catch {
			notificationContext?.addNotification("error", "Login failed. Please try again.");
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
			<div className="w-full max-w-md rounded-lg bg-slate-800 p-6 text-slate-50 shadow-lg">
				<h2 className="mb-4 text-center text-2xl font-bold">Login</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="mb-1 ml-1 block">Username or Email</label>
						<input
							type="text"
							className="w-full rounded-md border border-transparent bg-slate-700 p-2 text-slate-50 hover:border-lime-500"
							placeholder="Enter username or email"
							value={usernameOrEmail}
							onChange={(e) => setUsernameOrEmail(e.target.value)}
							required
						/>
					</div>
					<div className="mb-2">
						<label className="mb-1 ml-1 block">Password</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								className="w-full rounded-md border border-transparent bg-slate-700 p-2 text-slate-50 hover:border-lime-500"
								placeholder="Enter password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<span
								onClick={togglePasswordVisibility}
								className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-200"
							>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</span>
						</div>
					</div>
					<p className="mb-2 text-right text-sm text-gray-400">
						<Link href="/forgot-password" className="text-lime-500 hover:underline">
							Forgot your password?
						</Link>
					</p>
					<button
						type="submit"
						className="w-full rounded-md bg-lime-500 py-2 text-slate-950 hover:bg-lime-600"
					>
						Login
					</button>
				</form>
				<div className="mt-4 text-center">
					<p className="text-sm text-gray-400">
						Don&apos;t have an account?{" "}
						<Link href="/register" className="text-lime-500 hover:underline">
							Go to Register
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
