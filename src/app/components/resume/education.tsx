import { EducationType } from "@/app/types/resumeTypes";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

/**
 * Component for displaying education information.
 *
 * @param param0 content: EducationType
 * @returns {JSX.Element} The education component
 */
export default function Education({
	params,
}: {
	params: {
		content: EducationType;
	};
}) {
	return (
		<div className="mb-4 mt-4 flex w-full flex-col rounded-lg border-2 border-slate-300 p-4 hover:border-lime-500">
			<div className="flex flex-col pb-2 text-left">
				<p className="pb-2 pl-0 pt-2 font-semibold text-lime-500 selection:text-slate-950">
					{params.content.university}
				</p>
				<p className="pl-0 font-medium">{params.content.level}</p>
				<p className="pb-2 pl-0 text-slate-300">{params.content.years}</p>
				{params.content.major && <p className="pb-2 pl-0">Major: {params.content.major}</p>}
				{params.content.minor && <p className="pb-2 pl-0">Minor: {params.content.minor}</p>}
				{params.content.thesisTitle && (
					<p className="pl-0">
						{params.content.level?.toLowerCase().includes("master") ? "Master's" : "Bachelor's"} Thesis:{" "}
						<Link
							href={params.content.thesisLink ? params.content.thesisLink : "#"}
							className="font-semibold text-lime-500 selection:text-slate-950 hover:text-slate-50"
						>
							{params.content.thesisTitle}
						</Link>
					</p>
				)}
				{params.content.githubRepo && (
					<div className="ml-4 mt-1 flex items-center gap-2">
						<ExternalLink size={16} className="text-slate-300" />

						<Link
							href={params.content.githubRepo}
							target="_blank"
							className="text-lime-500 hover:text-slate-50"
						>
							Research implementation repository
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
