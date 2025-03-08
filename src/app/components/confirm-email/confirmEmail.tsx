"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/authContext";

/**
 * The confirm email component.
 *
 * @returns {JSX.Element} The confirm email component
 */
export default function ConfirmEmail() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const authContext = useAuth();
	const [status, setStatus] = useState<string>("Validating...");
	const [timer, setTimer] = useState<number>(10);

	const user = authContext?.user;

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
		}, 10000); // Redirect after 10 seconds
	};

	useEffect(() => {
		if (token) {
			const confirmEmail = async () => {
				try {
					const res = await fetch(`/api/auth/confirm-email?token=${token}`);
					const data = await res.json();

					if (res.ok) {
						setStatus("Your email has been confirmed!");
						authContext?.fetchProfile();
						redirectAfterTimeout(user, router);
					} else {
						setStatus(
							`Error. ${data.response}. You can request a new confirmation email from the profile page.`
						);
						redirectAfterTimeout(user, router);
					}
				} catch {
					setStatus(
						"An error occurred while confirming your email. You can request a new confirmation email from the profile page."
					);
					redirectAfterTimeout(user, router);
				}
			};

			confirmEmail();
		} else {
			setStatus("Error confirming email. No token found in the URL.");
			redirectAfterTimeout(user, router);
		}
	}, [token]);

	/**
	 * Gets the status class.
	 *
	 * @returns The status class
	 */
	const getStatusClass = () => {
		if (status.includes("successfully")) {
			return "text-green-500";
		} else if (status.includes("Error")) {
			return "text-red-500";
		} else {
			return "text-slate-50";
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
			<div className="w-full max-w-md rounded-lg bg-slate-800 p-6 text-center text-slate-50 shadow-lg">
				<h1 className="mb-4 text-2xl font-bold">Email Confirmation</h1>
				<p className={getStatusClass()}>{status}</p>
				<p className="mt-4 text-slate-50">Redirecting in {timer} seconds...</p>
			</div>
		</div>
	);
}
