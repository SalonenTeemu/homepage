"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	passwordMinLength,
	isPasswordValid,
	isEmailValid,
	isUsernameValid,
	usernameMinLength,
} from "@/app/utils/utils";
import { useAuth } from "../../context/authContext";
import { fetchWithAuth } from "@/app/utils/apiUtils";

/**
 * The Profile component.
 *
 * @returns {JSX.Element} The Profile component
 */
export default function Profile() {
	const router = useRouter();
	const authContext = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [emailConfirmationStatus, setEmailConfirmationStatus] = useState<string | null>(null);
	const [isPasswordUpdate, setIsPasswordUpdate] = useState(false);

	const user = authContext?.user;
	const fetchProfile = authContext?.fetchProfile;

	useEffect(() => {
		if (emailConfirmationStatus) {
			const timeout = setTimeout(() => {
				setEmailConfirmationStatus(null);
			}, 5000);

			return () => clearTimeout(timeout);
		}
		if (error) {
			const timeout = setTimeout(() => {
				setError(null);
			}, 5000);

			return () => clearTimeout(timeout);
		}
	}, [emailConfirmationStatus, error]);

	useEffect(() => {
		if (user) {
			setUsername(user.username || "");
			setEmail(user.email || "");
			setIsEditing(false);
			setError(null);
			setIsPasswordUpdate(false);
			setPassword("");
			setConfirmPassword("");
		}
	}, [user]);

	useEffect(() => {
		if (!isEditing) {
			setUsername(user?.username || "");
			setEmail(user?.email || "");
			setPassword("");
			setConfirmPassword("");
			setError(null);
			setIsPasswordUpdate(false);
		}
	}, [isEditing, user]);

	if (!authContext) {
		return <p>Loading...</p>;
	}

	if (!user) {
		return <p>Loading...</p>;
	}

	const handleSave = async () => {
		if (username && !isUsernameValid(username)) {
			setError(`Username must be at least ${usernameMinLength} characters.`);
			return;
		}
		if (email && !isEmailValid(email)) {
			setError("Invalid email address.");
			return;
		}
		if (isPasswordUpdate) {
			if (password && !isPasswordValid(password)) {
				setError(
					`Password must be at least ${passwordMinLength} characters, include at least one uppercase letter, and at least one number.`
				);
				return;
			}
			if (password && password !== confirmPassword) {
				setError("Passwords do not match.");
				return;
			}
		}

		try {
			let emailToAdd = email;
			if (user?.email && !email) emailToAdd = user.email;
			const res = await fetchWithAuth("/api/profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: emailToAdd,
					password: isPasswordUpdate ? password : undefined,
					username,
				}),
			});

			if (res) {
				const data = await res.json();

				if (!res.ok) {
					setError(`Profile update failed. ${data.response}`);
					return;
				}
				setEmail(data.email);
				setUsername(data.username);
				setPassword("");
				setConfirmPassword("");
				setError(null);
				setIsEditing(false);

				await fetchProfile?.();
			} else {
				router.push("/login");
			}
		} catch (err) {
			setError("Error updating profile. Please try again.");
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEmail(user?.email || "");
		setUsername(user?.username || "");
		setPassword("");
		setConfirmPassword("");
		setError(null);
		setIsPasswordUpdate(false);
	};

	const resendConfirmationEmail = async () => {
		try {
			const res = await fetchWithAuth("/api/resend-confirmation-email", {
				method: "POST",
			});

			if (res) {
				if (res.ok) {
					setEmailConfirmationStatus("A new confirmation email has been sent.");
				} else {
					const data = await res.json();
					setError(`Error. ${data.response}`);
				}
			} else {
				router.push("/login");
			}
		} catch (err) {
			setError("Error resending confirmation email. Please try again.");
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
			<div className="w-full max-w-sm rounded-lg bg-slate-800 p-6 text-slate-50 shadow-lg">
				<h2 className="mb-4 text-center text-2xl font-bold">{!isEditing ? "" : "Edit "}Profile</h2>
				{error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}
				{emailConfirmationStatus && (
					<p className="mb-4 text-center text-sm text-green-500">{emailConfirmationStatus}</p>
				)}
				{!isEditing ? (
					<div>
						<p className="mb-4">
							<span className="font-bold">Username:</span> {user.username}
						</p>
						<p className="mb-4">
							<span className="font-bold">Email:</span> {user.email || "Not provided"}
						</p>
						{user.email && !user.emailConfirmed && (
							<>
								<p className="mb-4 text-sm text-red-500">
									Your email is not confirmed. Confirm it with the button below to ensure account
									recovery features.
								</p>
								<button
									className="mb-4 w-full rounded-md bg-lime-500 py-2 text-slate-950 hover:bg-lime-600"
									onClick={resendConfirmationEmail}
								>
									Resend Confirmation Email
								</button>
							</>
						)}
						<button
							className="w-full rounded-md bg-lime-500 py-2 text-slate-950 hover:bg-lime-600"
							onClick={() => setIsEditing(true)}
						>
							Edit Profile
						</button>
					</div>
				) : (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSave();
						}}
					>
						<div className="mb-4">
							<label className="mb-1 ml-1 block">New Username</label>
							<input
								type="text"
								className="w-full rounded-md bg-slate-700 p-2 text-slate-50"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>

						<div className="mb-4">
							<label className="mb-1 ml-1 block">New Email</label>
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

						<div className="mb-4 flex items-center">
							<input
								type="checkbox"
								id="update-password"
								className="ml-1 h-5 w-5 cursor-pointer rounded border-slate-600 bg-slate-700 text-lime-500 focus:ring-2 focus:ring-lime-500 focus:ring-offset-slate-800"
								checked={isPasswordUpdate}
								onChange={() => setIsPasswordUpdate((prev) => !prev)}
							/>
							<label htmlFor="update-password" className="ml-2 text-slate-50">
								Update Password
							</label>
						</div>

						{isPasswordUpdate && (
							<>
								<div className="mb-4">
									<label className="mb-1 ml-1 block">New Password</label>
									<input
										type="password"
										className="w-full rounded-md bg-slate-700 p-2 text-slate-50"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
								<div className="mb-4">
									<label className="mb-1 ml-1 block">Confirm New Password</label>
									<input
										type="password"
										className="w-full rounded-md bg-slate-700 p-2 text-slate-50"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
									/>
								</div>
							</>
						)}
						<div className="flex justify-between">
							<button
								type="submit"
								className="rounded-md bg-lime-500 px-4 py-2 text-slate-950 hover:bg-lime-600"
							>
								Update
							</button>
							<button
								type="button"
								className="rounded-md bg-slate-700 px-4 py-2 text-slate-50 hover:bg-slate-600"
								onClick={handleCancel}
							>
								Cancel
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
