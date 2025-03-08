import { makeId } from "@/app/utils/utils";

/**
 * Component for displaying a list of technologies.
 *
 * @param param0 content: string[]
 * @returns {JSX.Element} Technologies component
 */
export default function Technologies({
	params,
}: {
	params: {
		content: string[];
	};
}) {
	return (
		<div className="mb-4 mt-4 flex w-full flex-col rounded-lg border-2 border-slate-300 p-4 hover:border-lime-500">
			<div className="flex flex-col text-left">
				<div className="flex flex-row flex-wrap pb-2 pt-2">
					{params.content.map((x) => (
						<p
							key={`${x}-${makeId(5)}`}
							className="m-1 rounded-full bg-lime-500 pb-1 pl-3 pr-3 pt-1 text-slate-950 transition-none duration-300 ease-in-out hover:transform-none motion-reduce:transition-none motion-reduce:hover:transform-none lg:transition lg:hover:-translate-y-1"
						>
							{x}
						</p>
					))}
				</div>
			</div>
		</div>
	);
}
