import Link from "next/link";

/**
 * Component for a link to the resume PDF.
 *
 * @param linkText The text to display for the link
 * @returns {JSX.Element} ResumePDFLink component
 */
export default function ResumePDFLink({ linkText }: { linkText: string }) {
	return (
		<div className="flex w-full justify-center pb-8">
			<p className="md:text-md 3xl:text-3xl text-sm lg:text-lg 2xl:text-xl">
				<Link
					href="/about/resume.pdf"
					aria-description=""
					target="_blank"
					className="text-md font-bold text-lime-500 selection:text-slate-950 hover:text-slate-50"
				>
					{linkText}
				</Link>
			</p>
		</div>
	);
}
