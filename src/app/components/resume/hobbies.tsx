/**
 * Component for displaying hobbies information.
 *
 * @param param0 content: string[]
 * @returns {JSX.Element} The hobbies component
 */
export default function Hobbies({
	params,
}: {
	params: {
		content: string[];
	};
}) {
	return (
		<div className="mb-4 mt-4 flex w-full flex-col rounded border-2 border-slate-300 p-4 hover:border-lime-500">
			<div className="flex flex-col text-left">
				<ul className="ml-4 list-disc">
					{params.content.map((x, i, arr) => {
						let className = "";

						if (i === 0) {
							className += "pt-2 pb-1";
						} else if (i === arr.length - 1) {
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
