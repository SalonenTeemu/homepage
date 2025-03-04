"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
	passwordMinLength,
	isPasswordValid,
	isEmailValid,
	isUsernameValid,
	usernameMinLength,
	usernameMaxLength,
} from "@/app/utils/utils";
import { useAuth } from "../../context/authContext";
import { useNotification } from "@/app/context/notificationContext";
import { fetchWithAuth } from "@/app/utils/apiUtils";

/**
 * The Profile component.
 *
 * @returns {JSX.Element} The Profile component
 */
export default function Profile() {
	const authContext = useAuth();
	const notificationContext = useNotification();
	const [isEditing, setIsEditing] = useState(false);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isPasswordUpdate, setIsPasswordUpdate] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [showConfirmPasswordModal, setShowConfirmPasswordModal] = useState(false);

	const user = authContext?.user;

	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
	const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);
	const toggleConfirmPasswordModal = () => setShowConfirmPasswordModal((prev) => !prev);

	useEffect(() => {
		if (user) {
			setUsername(user.displayName || "");
			setEmail(user.email || "");
			setIsEditing(false);
			setIsPasswordUpdate(false);
			setPassword("");
			setConfirmPassword("");
		}
	}, [user]);

	useEffect(() => {
		if (!isEditing) {
			setUsername(user?.displayName || "");
			setEmail(user?.email || "");
			setPassword("");
			setConfirmPassword("");
			setIsPasswordUpdate(false);
		}
	}, [isEditing, user]);

	if (!authContext || !user) {
		return <p>Loading...</p>;
	}

	/**
	 * Handles the form submission to update the profile.
	 */
	const handleSave = async () => {
		if (username && !isUsernameValid(username)) {
			notificationContext?.addNotification(
				"error",
				`Username must be at least ${usernameMinLength} and at most ${usernameMaxLength} characters.`
			);
			return;
		}
		if (email && !isEmailValid(email)) {
			notificationContext?.addNotification("error", "Invalid email address.");
			return;
		}
		if (isPasswordUpdate) {
			if (password && !isPasswordValid(password)) {
				notificationContext?.addNotification(
					"error",
					`Password must be at least ${passwordMinLength} characters, include at least one uppercase letter, and at least one number.`
				);
				return;
			}
			if (password && password !== confirmPassword) {
				notificationContext?.addNotification("error", "Passwords do not match.");
				return;
			}
		}

		try {
			let emailToAdd = email;
			if (user?.email && !email) {
				emailToAdd = user.email;
			} else {
				emailToAdd = email;
			}
			const res = await fetchWithAuth(
				"/api/profile",
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: emailToAdd,
						password: isPasswordUpdate ? password : undefined,
						username,
					}),
				},
				authContext?.logout,
				notificationContext?.addNotification!
			);

			if (res) {
				const data = await res.json();

				if (!res.ok) {
					notificationContext?.addNotification("error", `Profile update failed. ${data.response}.`);
					return;
				}
				authContext?.setUser(data);
				setEmail(data.email);
				setUsername(data.displayName);
				setPassword("");
				setConfirmPassword("");
				setIsEditing(false);

				notificationContext?.addNotification("success", "Profile updated successfully.");
			} else {
				notificationContext?.addNotification(
					"error",
					"Error updating profile. Session expired or too many requests."
				);
			}
		} catch (err) {
			notificationContext?.addNotification("error", "Error updating profile. Please try again.");
		}
	};

	/**
	 * Handles the form submission to delete the account.
	 */
	const handleDeleteAccount = async () => {
		try {
			const res = await fetchWithAuth(
				"/api/profile",
				{
					method: "DELETE",
				},
				authContext?.logout,
				notificationContext?.addNotification!
			);

			if (res) {
				if (res.ok) {
					authContext?.logout();
					notificationContext?.addNotification("success", "Account deleted successfully.");
				} else {
					const data = await res.json();
					notificationContext?.addNotification("error", `Error deleting profile. ${data.response}.`);
				}
			} else {
				notificationContext?.addNotification(
					"error",
					"Error updating profile. Session expired or too many requests."
				);
			}
		} catch (err) {
			notificationContext?.addNotification("error", "Error deleting profile. Please try again.");
		}
	};

	/**
	 * Cancels the profile editing.
	 */
	const handleCancel = () => {
		setIsEditing(false);
		setEmail(user?.email || "");
		setUsername(user?.displayName || "");
		setPassword("");
		setConfirmPassword("");
		setIsPasswordUpdate(false);
	};

	/**
	 * Handles the request to resend the confirmation email.
	 */
	const resendConfirmationEmail = async () => {
		try {
			const res = await fetchWithAuth(
				"/api/auth/resend-confirmation-email",
				{
					method: "POST",
				},
				authContext?.logout,
				notificationContext?.addNotification!
			);

			if (res) {
				if (res.ok) {
					notificationContext?.addNotification("success", "A new confirmation email has been sent.");
				} else {
					const data = await res.json();
					notificationContext?.addNotification(
						"error",
						`Error sending confirmation email. ${data.response}.`
					);
				}
			} else {
				notificationContext?.addNotification(
					"error",
					"Error updating profile. Session expired or too many requests."
				);
			}
		} catch (err) {
			notificationContext?.addNotification("error", "Error sending confirmation email. Please try again.");
		}
	};

	/**
	 * Handles the form submission to update the account.
	 */
	const handleUpdateAccount = async () => {
		setIsUpdateModalOpen(false);
		await handleSave();
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
			<div className="w-full max-w-sm rounded-lg bg-slate-800 p-6 text-slate-50 shadow-lg">
				<h2 className="mb-4 text-center text-2xl font-bold">{!isEditing ? "" : "Edit "}Profile</h2>
				{!isEditing ? (
					<div>
						<p className="mb-4">
							<span className="font-bold">Username:</span> {user.displayName}
						</p>
						<p className="mb-4">
							<span className="font-bold">Email:</span> {user.email || "Not provided"}
						</p>
						{user.email && !user.emailConfirmed && (
							<>
								<p className="mb-4 text-sm text-red-500">
									Your email is not confirmed. Confirm it with the button below to enable password
									recovery.
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
							setIsUpdateModalOpen(true);
						}}
					>
						<div className="mb-4">
							<label className="mb-1 ml-1 block">New Username</label>
							<input
								type="text"
								className="w-full rounded-md border border-transparent bg-slate-700 p-2 text-slate-50 hover:border-lime-500"
								value={username}
								placeholder="Enter new username"
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>

						<div className="mb-4">
							<label className="mb-1 ml-1 block">
								New Email<span className="text-lime-500">*</span>
							</label>
							<input
								type="email"
								className="w-full rounded-md border border-transparent bg-slate-700 p-2 text-slate-50 hover:border-lime-500"
								value={email}
								placeholder="Enter new email"
								onChange={(e) => setEmail(e.target.value)}
							/>
							<p className="ml-1 mt-2 text-sm text-gray-400">
								<span className="text-lime-500">*</span>Email is required for password recovery.
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
									<div className="relative">
										<input
											type={showPassword ? "text" : "password"}
											className="w-full rounded-md border border-transparent bg-slate-700 p-2 text-slate-50 hover:border-lime-500"
											placeholder="Length > 7, uppercase, number"
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
								className="ml-2 rounded-md bg-red-500 px-4 py-2 text-slate-950 hover:bg-red-600"
								onClick={() => setIsDeleteModalOpen(true)}
							>
								Delete Account
							</button>
							<button
								type="button"
								className="ml-2 rounded-md bg-slate-700 px-4 py-2 text-slate-50 hover:bg-slate-600"
								onClick={handleCancel}
							>
								Cancel
							</button>
						</div>
					</form>
				)}
				{isDeleteModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
						<div className="w-full max-w-md rounded-lg bg-slate-800 p-6 text-slate-50 shadow-lg">
							<h3 className="text-center text-xl font-semibold text-red-500">Delete Account</h3>
							<p className="mt-4 text-center text-slate-300">
								Are you sure you want to delete your account? This action cannot be undone. All your
								data will be lost.
							</p>
							<div className="mt-6 flex justify-between">
								<button
									className="mr-2 w-full rounded-md bg-slate-700 py-2 text-slate-50 hover:bg-slate-600"
									onClick={() => setIsDeleteModalOpen(false)}
								>
									Cancel
								</button>
								<button
									className="ml-2 w-full rounded-md bg-red-500 py-2 text-slate-950 hover:bg-red-600"
									onClick={handleDeleteAccount}
								>
									Confirm
								</button>
							</div>
						</div>
					</div>
				)}
				{isUpdateModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
						<div className="w-full max-w-md rounded-lg bg-slate-800 p-6 text-slate-50 shadow-lg">
							<h3 className="text-center text-xl font-semibold text-lime-500">Update Account</h3>
							<p className="mt-4 text-center text-slate-300">
								Are you sure you want to update your account with the following changes?
							</p>
							<div className="mt-4 text-left">
								<p>
									<span className="font-semibold">Username:</span> {username}
								</p>
								<p>
									<span className="font-semibold">Email:</span> {email}
								</p>
								{isPasswordUpdate && (
									<p className="flex items-center">
										<span className="font-semibold">Password:&nbsp;</span>
										{showConfirmPasswordModal ? password : "******"}
										<span
											onClick={toggleConfirmPasswordModal}
											className="ml-2 cursor-pointer text-gray-400 hover:text-gray-200"
										>
											{showConfirmPasswordModal ? <EyeOff size={20} /> : <Eye size={20} />}
										</span>
									</p>
								)}
							</div>
							<div className="mt-6 flex justify-between">
								<button
									className="mr-2 w-full rounded-md bg-slate-700 py-2 text-slate-50 hover:bg-slate-600"
									onClick={() => setIsUpdateModalOpen(false)}
								>
									Cancel
								</button>
								<button
									className="ml-2 w-full rounded-md bg-lime-500 py-2 text-slate-950 hover:bg-lime-600"
									onClick={handleUpdateAccount}
								>
									Confirm
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
