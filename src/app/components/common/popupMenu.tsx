"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/authContext";

interface PopupMenuProps {
	isOpen: boolean;
}

export default function Sidebar({ isOpen }: PopupMenuProps) {
	const authContext = useAuth();
	const user = authContext?.user;
	const logout = authContext?.logout;

	return (
		<div
			className={`fixed right-4 top-4 mt-6 w-48 transform rounded-md bg-slate-800 text-slate-50 shadow-lg transition-transform duration-300 ${
				isOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
			} z-50`}
		>
			<div className="space-y-4 p-4">
				<ul className="space-y-2">
					{!user ? (
						<>
							<li>
								<Link href="/register" className="hover:text-lime-500">
									Register
								</Link>
							</li>
							<li>
								<Link href="/login" className="hover:text-lime-500">
									Login
								</Link>
							</li>
						</>
					) : (
						<>
							<li>
								<Link href="/profile" className="hover:text-lime-500">
									Profile
								</Link>
							</li>
							<li>
								<button onClick={logout} className="w-full text-left hover:text-red-500">
									Logout
								</button>
							</li>
						</>
					)}
				</ul>
			</div>
		</div>
	);
}
