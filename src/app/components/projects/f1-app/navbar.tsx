"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The navigation bar for the F1 App.
 *
 * @returns {JSX.Element} Navbar component
 */
export default function Navbar() {
	const pathname = usePathname();

	return (
		<nav className="bg-slate-900 py-2">
			<div className="container mx-auto flex justify-center space-x-20">
				<Link
					href="/projects/f1-app"
					className={`text-md font-bold selection:text-slate-950 ${
						pathname === "/projects/f1-app" ? "text-lime-500 hover:text-slate-50" : "hover:text-lime-500"
					}`}
				>
					Race Schedule
				</Link>
				<Link
					href="/projects/f1-app/drivers"
					className={`text-md font-bold selection:text-slate-950 ${
						pathname === "/projects/f1-app/drivers"
							? "text-lime-500 hover:text-slate-50"
							: "hover:text-lime-500"
					}`}
				>
					Driver Standings
				</Link>
				<Link
					href="/projects/f1-app/constructors"
					className={`text-md font-bold selection:text-slate-950 ${
						pathname === "/projects/f1-app/constructors"
							? "text-lime-500 hover:text-slate-50"
							: "hover:text-lime-500"
					}`}
				>
					Constructor Standings
				</Link>
			</div>
		</nav>
	);
}
