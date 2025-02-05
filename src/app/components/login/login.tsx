"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { isUsernameValid, isPasswordValid } from "@/app/utils/utils";

export default function Login() {
	const router = useRouter();
	const authContext = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!username || !isUsernameValid(username)) {
			setError("Login failed. Invalid username.");
			return;
		}

		if (!password || !isPasswordValid(password)) {
			setError("Login failed.");
			return;
		}

		try {
			const res = await fetch("/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password,
				}),
				credentials: "include",
			});

			const data = await res.json();

			if (!res.ok) {
				setError(`Login failed. ${data.response}`);
				return;
			}
			await authContext?.fetchProfile();
			router.push("/profile");
		} catch (e) {
			setError("Login failed. Please try again later.");
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
			<div className="w-full max-w-md rounded-lg bg-slate-800 p-6 text-slate-50 shadow-lg">
				<h2 className="mb-4 text-center text-2xl font-bold">Login</h2>
				<p className="text-center text-sm text-red-500">{error}</p>
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
						<label className="mb-1 ml-1 block">Password</label>
						<input
							type="password"
							className="w-full rounded-md bg-slate-700 p-2 text-slate-50"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
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
