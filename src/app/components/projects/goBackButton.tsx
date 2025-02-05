"use client";

import Link from "next/link";
import LeftArrow from "@/app/assets/icons/leftArrow";

/**
 * A button that redirects the user back to the projects page.
 *
 * @returns {JSX.Element} GoBackButton component
 */
export default function GoBackButton() {
	return (
		<Link
			href="/projects"
			className="px-4text-slate-50 fixed left-4 top-4 transition-none duration-150 ease-in-out hover:border-lime-500 hover:text-lime-500 motion-reduce:transition-none md:transition md:hover:-translate-y-1"
		>
			<LeftArrow />
		</Link>
	);
}
