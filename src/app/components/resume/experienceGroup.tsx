import { ExperienceGroupType } from "@/app/types/resumeTypes";

/**
 * Component for displaying multiple roles held at the same company.
 *
 * @param param0 content: ExperienceGroupType
 * @returns {JSX.Element} The experience group component
 */
export default function ExperienceGroup({
	params,
}: {
	params: {
		content: ExperienceGroupType;
	};
}) {
	return (
		<div className="mb-4 mt-4 flex w-full flex-col rounded-lg border-2 border-slate-300 p-4 hover:border-lime-500">
			<div className="flex flex-col text-left">
				<p className="pb-2 pl-0 pt-2 font-semibold text-lime-500 selection:text-slate-950">
					{params.content.company}
				</p>
			</div>

			{params.content.roles.map((role, index) => (
				<div
					key={role.title}
					className={`flex flex-col pl-0 text-left ${
						index !== 0 ? "mt-4 border-t border-slate-700 pt-4" : ""
					}`}
				>
					<p className="pl-0 font-medium">{role.title}</p>
					<p className="pb-4 pl-0 text-slate-300">{role.years}</p>

					<ul className="ml-4 list-disc">
						{role.description.map((x, i, arr) => {
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
			))}
		</div>
	);
}
