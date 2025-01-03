import Link from "next/link";

/**
 * Component for a link to the resume PDF.
 *
 * @param linkText The text to display for the link
 * @returns {JSX.Element} ResumePDFLink component
 */
export default function ResumePDFLink({ linkText }: { linkText: string }) {
  return (
    <div className="w-full flex justify-center pb-8">
      <p className="text-sm md:text-md lg:text-lg 2xl:text-xl 3xl:text-3xl">
        <Link
          href="/resume/resume.pdf"
          aria-description=""
          target="_blank"
          className="text-md font-bold text-lime-500 hover:text-slate-50 selection:text-slate-950">
          {linkText}
        </Link>
      </p>
    </div>
  );
}
