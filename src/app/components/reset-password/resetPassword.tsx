"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/app/context/authContext";
import { useNotification } from "@/app/context/notificationContext";
import { isPasswordValid, passwordMinLength } from "@/app/utils/utils";

/**
 * The ResetPassword component.
 *
 * @returns {JSX.Element} The ResetPassword component
 */
export default function ResetPassword() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const authContext = useAuth();
	const notificationContext = useNotification();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [timer, setTimer] = useState<number>(5);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [timerVisible, setTimerVisible] = useState(false);

	const user = authContext.user;

	useEffect(() => {
		if (!token) {
			notificationContext.addNotification("error", "Cannot reset password. No token found in the URL.");
			setTimerVisible(true);
			redirectAfterTimeout(user, router);
		}
	}, [token]);

	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
	const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

	/**
	 * Redirects the user after a timeout.
	 *
	 * @param user The user object
	 * @param router The router object
	 */
	const redirectAfterTimeout = (user: any, router: any) => {
		const countdown = setInterval(() => {
			setTimer((prev) => prev - 1);
		}, 1000);

		setTimeout(() => {
			clearInterval(countdown);
			if (user) {
				router.push("/profile");
			} else {
				router.push("/login");
			}
		}, 5000);
	};

	/**
	 * Handles the form submission to reset the password.
	 */
	const handleSubmit = async () => {
		if (token) {
			if (!isPasswordValid(password)) {
				notificationContext.addNotification(
					"error",
					`Password must be at least ${passwordMinLength} characters, include at least one uppercase letter, and at least one number.`
				);
				return;
			}
			if (password !== confirmPassword) {
				notificationContext.addNotification("error", "Passwords do not match.");
				return;
			}

			try {
				const res = await fetch("/api/auth/reset-password", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token, password }),
				});

				const data = await res.json();

				if (res.ok) {
					notificationContext.addNotification("success", "Your password has been reset.");
					if (user) {
						authContext.fetchProfile();
					}
					setTimerVisible(true);
					redirectAfterTimeout(user, router);
				} else {
					notificationContext.addNotification("error", `Error resetting password. ${data.response}.`);
					redirectAfterTimeout(user, router);
					setTimerVisible(false);
					return;
				}
			} catch {
				notificationContext.addNotification("error", "Something went wrong. Please try again.");
				setTimerVisible(false);
			}
		} else {
			notificationContext.addNotification("error", "Error confirming email. No token found in the URL.");
			setTimerVisible(true);
			redirectAfterTimeout(user, router);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
			<div className="w-full max-w-md rounded-lg bg-slate-800 p-6 text-slate-50 shadow-lg">
				<h2 className="mb-4 text-center text-2xl font-bold">Reset Password</h2>
				<div className="mb-4">
					<label className="mb-1 ml-1 block">New Password</label>
					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							className="w-full rounded-md border border-transparent bg-slate-700 p-2 text-slate-50 hover:border-lime-500"
							placeholder="New password"
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
				<div className="mb-4">
					<label className="mb-1 ml-1 block">Confirm Password</label>
					<div className="relative">
						<input
							type={showConfirmPassword ? "text" : "password"}
							className="w-full rounded-md border border-transparent bg-slate-700 p-2 text-slate-50 hover:border-lime-500"
							placeholder="Confirm password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
						<span
							onClick={toggleConfirmPasswordVisibility}
							className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-200"
						>
							{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</span>
					</div>
				</div>
				<button
					onClick={handleSubmit}
					className="w-full rounded-md bg-lime-500 py-2 text-slate-950 hover:bg-lime-600"
				>
					Reset Password
				</button>
				{timerVisible && <p className="mt-4 text-center text-slate-50">Redirecting in {timer} seconds...</p>}
			</div>
		</div>
	);
}
