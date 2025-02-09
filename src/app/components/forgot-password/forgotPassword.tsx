"use client";

import { useState } from "react";
import { isEmailValid } from "@/app/utils/utils";

/**
 * The ForgotPassword component.
 *
 * @returns {JSX.Element} The ForgotPassword component
 */
export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async () => {
		if (!email || !isEmailValid(email)) {
			setError("Invalid email.");
			return;
		}
		try {
			const res = await fetch("/api/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(`Error requesting password reset. ${data.response}.`);
				return;
			}
			setSuccessMessage(`Password reset request has been sent to ${email}.`);
			setEmail("");
			setError("");
		} catch (err) {
			setError("Error requesting password reset. Please try again.");
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
			<div className="w-full max-w-md rounded-lg bg-slate-800 p-6 text-slate-50 shadow-lg">
				<h2 className="mb-4 text-center text-2xl font-bold">Forgot Password</h2>
				{error && <p className="mb-4 text-red-500">{error}</p>}
				{successMessage && <p className="mb-4 text-green-500">{successMessage}</p>}
				<input
					type="email"
					placeholder="Enter the email associated with your account"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="mb-4 w-full rounded-md border border-transparent bg-slate-700 p-2 text-slate-50 hover:border-lime-500"
					required
				/>
				<button
					onClick={handleSubmit}
					className="w-full rounded-md bg-lime-500 py-2 text-slate-950 hover:bg-lime-600"
				>
					Submit
				</button>
				<p className="ml-1 mt-2 text-sm text-gray-400">
					Note that you can only reset your password if you have added and verified email on your account!
				</p>
			</div>
		</div>
	);
}
