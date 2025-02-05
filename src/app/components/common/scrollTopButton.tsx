"use client";

import { useEffect, useState } from "react";
import UpArrow from "@/app/assets/icons/upArrow";

/**
 * A scroll to top button component that appears when the user scrolls down the page.
 *
 * @returns {JSX.Element} The scroll top button component
 */
export default function ScrollTopButton() {
	const [visible, setVisible] = useState(false);

	const toggleVisible = () => {
		const amountScrolled = document.documentElement.scrollTop;
		if (amountScrolled > 500) {
			setVisible(true);
		} else {
			setVisible(false);
		}
	};

	const scrollTop = () => {
		if (typeof window !== "undefined") {
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", toggleVisible);
	}, []);

	return (
		<div className={`fixed bottom-0 right-0 ${visible ? "visible" : "hidden"}`}>
			<button
				className="-z-10 m-8 p-4 text-slate-50 transition-none duration-150 ease-in-out hover:text-lime-500 motion-reduce:transition-none motion-reduce:hover:transform-none md:transition md:hover:-translate-y-1"
				onClick={scrollTop}
			>
				<UpArrow />
			</button>
		</div>
	);
}
