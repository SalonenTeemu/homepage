"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import PopupMenu from "@/app/components/common/popupMenu";
import MenuIcon from "@/app/assets/icons/menuIcon";

export default function Navbar() {
	const pathname = usePathname();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setSidebarOpen(false);
			}
		};

		if (sidebarOpen) {
			document.addEventListener("mousedown", handleOutsideClick);
		} else {
			document.removeEventListener("mousedown", handleOutsideClick);
		}

		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, [sidebarOpen]);

	return (
		<>
			<nav className="relative w-full bg-slate-950 py-4 text-slate-50">
				<div className="relative mx-auto flex max-w-7xl items-center justify-center px-4">
					<ul className="flex space-x-6">
						<li>
							<Link
								href="/"
								className={`text-md font-bold selection:text-slate-950 ${
									pathname === "/" ? "text-lime-500 hover:text-slate-50" : "hover:text-lime-500"
								}`}
							>
								Home
							</Link>
						</li>
						<li>
							<Link
								href="/resume"
								className={`text-md font-bold selection:text-slate-950 ${
									pathname === "/resume" ? "text-lime-500 hover:text-slate-50" : "hover:text-lime-500"
								}`}
							>
								Resume
							</Link>
						</li>
						<li>
							<Link
								href="/projects"
								className={`text-md font-bold selection:text-slate-950 ${
									pathname.startsWith("/projects")
										? "text-lime-500 hover:text-slate-50"
										: "hover:text-lime-500"
								}`}
							>
								Projects
							</Link>
						</li>
					</ul>

					<div className="relative" ref={menuRef}>
						<button
							className="fixed right-4 top-4 z-50 text-slate-50 transition-none duration-150 ease-in-out hover:text-lime-500 motion-reduce:transition-none md:transition md:hover:-translate-y-1"
							onClick={toggleSidebar}
							aria-label="Toggle Sidebar"
						>
							<MenuIcon />
						</button>

						{sidebarOpen && <PopupMenu isOpen={sidebarOpen} />}
					</div>
				</div>
			</nav>
		</>
	);
}
