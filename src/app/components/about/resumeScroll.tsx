"use client";

import Link from "next/link";
import DownArrow from "@/app/assets/icons/downArrow";

/**
 * An arrow component that scrolls to the resume section.
 *
 * @returns {JSX.Element} ResumeScroll component
 */
export default function ResumeScroll() {
	return (
		<Link
			href="#resume"
			scroll={false}
			className="flex flex-col items-center justify-center text-center transition-none duration-150 ease-in-out hover:text-lime-500 motion-reduce:transition-none md:transition md:hover:-translate-y-1"
			onClick={(e) => {
				e.preventDefault();

				if (document) {
					document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" });
				}
			}}
		>
			<p className="pb-1">LEARN MORE</p>
			<DownArrow />
		</Link>
	);
}
