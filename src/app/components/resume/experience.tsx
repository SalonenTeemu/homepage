import { ExperienceType } from "@/app/types/resumeTypes";

/**
 * Component for displaying experience information.
 *
 * @param param0 content: ExperienceType
 * @returns {JSX.Element} The experience component
 */
export default function Experience({
	params,
}: {
	params: {
		content: ExperienceType;
	};
}) {
	return (
		<div className="mb-4 mt-4 flex w-full flex-col rounded border-2 border-slate-300 p-4 hover:border-lime-500">
			<div className="flex flex-col text-left">
				<p className="pl-0 pt-2">{params.content.company}</p>
				<p className="pl-0">{params.content.title}</p>
				<p className="pb-4 pl-0 text-slate-300">{params.content.years}</p>
			</div>
			<div className="flex flex-col pl-0 text-left">
				<ul className="ml-4 list-disc">
					{params.content.description.map((x, i, arr) => {
						let className = "";

						if (i === arr.length - 1) {
							className += "pb-2";
						} else {
							className += "pb-1";
						}
						return (
							<li key={`${x}-${i}`} className={className}>
								{x}
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
