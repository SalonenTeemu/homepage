"use client";

import { useRouter } from "next/navigation";
import LeftArrow from "@/app/assets/icons/leftArrow";

/**
 * A button that redirects the user back to the previous page.
 *
 * @returns {JSX.Element} GoBackButton component
 */
export default function GoBackButton() {
	const router = useRouter();

	return (
		<button
			onClick={() => router.back()}
			className="fixed left-4 top-4 px-4 text-slate-50 transition-none duration-150 ease-in-out hover:border-lime-500 hover:text-lime-500 motion-reduce:transition-none md:transition md:hover:-translate-y-1"
		>
			<LeftArrow />
		</button>
	);
}
