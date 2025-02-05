import Link from "next/link";

/**
 * Wrapper for icons that are links.
 *
 * @param param0 href: link to the page, icon: icon to display
 * @returns {JSX.Element} The link icon wrapper component
 */
export default function LinkIconWrapper({
	params,
}: {
	params: {
		href: string;
		icon: JSX.Element;
	};
}) {
	return (
		<Link
			href={params.href}
			target="_blank"
			className="3xl:h-16 3xl:w-16 mb-4 mt-4 h-8 w-8 hover:text-lime-500 md:h-10 md:w-10"
		>
			{params.icon}
		</Link>
	);
}
