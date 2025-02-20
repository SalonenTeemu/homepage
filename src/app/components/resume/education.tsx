import { EducationType } from "@/app/types/resumeTypes";
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
		<div className="mb-4 mt-4 flex w-full flex-col rounded border-2 border-slate-300 p-4 hover:border-lime-500">
			<div className="flex flex-col text-left">
				<p className="pl-0 pt-2">{params.content.university}</p>
				<p className="pl-0">{params.content.level}</p>
				<p className="pb-2 pl-0 text-slate-300">{params.content.years}</p>
				{params.content.major && <p className="pb-2 pl-0">Major: {params.content.major}</p>}
				{params.content.minor && <p className="pb-2 pl-0">Minor: {params.content.minor}</p>}
				{params.content.thesis && (
					<p className="pb-2 pl-0">
						Thesis:{" "}
						<Link
							href="https://trepo.tuni.fi/handle/10024/157793"
							className="text-lime-500 selection:text-slate-950 hover:text-slate-50"
						>
							{params.content.thesis}
						</Link>
					</p>
				)}
			</div>
		</div>
	);
}
