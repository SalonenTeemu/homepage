"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
	isUsernameValid,
	isPasswordValid,
	isEmailValid,
	usernameMinLength,
	passwordMinLength,
} from "@/app/utils/utils";

export default function Register() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [captchaValue, setCaptchaValue] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!captchaValue) {
			setError("Please verify the CAPTCHA.");
			return;
		}

		if (!isUsernameValid(username)) {
			setError(`Username must be at least ${usernameMinLength} characters.`);
			return;
		}

		if (email) {
			if (!isEmailValid(email)) {
				setError("Invalid email address.");
				return;
			}
		}

		if (!isPasswordValid(password)) {
			setError(
				`Password must be at least ${passwordMinLength} characters, include at least one uppercase letter, and at least one number.`
			);
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					email,
					password,
					recaptcha: captchaValue,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(`Registration failed. ${data.response}.`);
				return;
			}

			router.push("/login");
		} catch (e) {
			setError("Registration failed. Please try again later.");
		}
	};

	const onCaptchaChange = (value: string | null) => {
		setCaptchaValue(value);
		setError(null);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
			<div className="w-full max-w-sm rounded-lg bg-slate-800 p-6 text-slate-50 shadow-lg">
				<h2 className="mb-4 text-center text-2xl font-bold">Register</h2>
				{error && <p className="text-center text-sm text-red-500">{error}</p>}
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="mb-1 ml-1 block">Username</label>
						<input
							type="text"
							className="w-full rounded-md bg-slate-700 p-2 text-slate-50"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className="mb-4">
						<label className="mb-1 ml-1 block">Email (optional)</label>
						<input
							type="email"
							className="w-full rounded-md bg-slate-700 p-2 text-slate-50"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<p className="ml-1 mt-2 text-sm text-gray-400">
							Email is optional and can be used for account recovery (e.g., password reset).
						</p>
					</div>
					<div className="mb-4">
						<label className="mb-1 ml-1 block">Password</label>
						<input
							type="password"
							className="w-full rounded-md bg-slate-700 p-2 text-slate-50"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div className="mb-4">
						<label className="mb-1 ml-1 block">Confirm Password</label>
						<input
							type="password"
							className="w-full rounded-md bg-slate-700 p-2 text-slate-50"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>
					<div className="mb-4 flex justify-center">
						<ReCAPTCHA sitekey="6LfLB8AqAAAAAHspOOhsK4xnydZ5aFcSTfegjZRe" onChange={onCaptchaChange} />
					</div>
					<button
						type="submit"
						className="w-full rounded-md bg-lime-500 py-2 text-slate-950 hover:bg-lime-600"
					>
						Register
					</button>
				</form>

				<div className="mt-4 text-center">
					<p className="text-sm text-gray-400">
						Already have an account?{" "}
						<Link href="/login" className="text-lime-500 hover:underline">
							Go to Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
