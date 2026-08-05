import { makeId } from "@/app/utils/utils";

/**
 * Properties for the Technologies component.
 *
 * @typedef {Object} TechnologiesProps
 */
type TechnologiesProps = {
	params: {
		content: {
			programmingLanguages: string[];
			frontend: string[];
			backend: string[];
			cloud: string[];
		};
	};
};

/**
 * Labels for the different technology categories.
 * The keys correspond to the keys in the content object, and the values are the display labels for those categories.
 */
const labels: Record<string, string> = {
	programmingLanguages: "Programming Languages",
	frontend: "Frontend",
	backend: "Integrations & Backend",
	cloud: "DevOps & Cloud",
};

/**
 * Component for displaying technologies information.
 *
 * @param param0 params: TechnologiesProps
 * @returns {JSX.Element} The technologies component
 */
export default function Technologies({ params }: TechnologiesProps) {
	return (
		<div className="mb-4 mt-4 flex w-full flex-col rounded-lg border-2 border-slate-300 p-4 hover:border-lime-500">
			<div className="flex flex-col text-left">
				{Object.entries(params.content).map(([key, items]) => (
					<div key={key} className="mb-4">
						<p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
							{labels[key] ?? key}
						</p>
						<div className="flex flex-row flex-wrap">
							{items.map((x) => (
								<p
									key={`${x}-${makeId(5)}`}
									className="m-1 rounded-full bg-lime-500 px-3 py-1 text-slate-950 transition-none duration-300 ease-in-out hover:transform-none motion-reduce:transition-none motion-reduce:hover:transform-none lg:transition lg:hover:-translate-y-1"
								>
									{x}
								</p>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
