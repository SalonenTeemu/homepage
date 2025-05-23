import Link from "next/link";
import LinkIconWrapper from "@/app/components/about/linkIconWrapper";
import GitHubIcon from "@/app/assets/icons/gitHubIcon";
import type { Project } from "@/app/types/projectTypes";

/**
 * A component that displays a project's title, description, and GitHub link.
 *
 * @param param0 content: Project
 * @returns {JSX.Element} The project component
 */
export default function ProjectComponent({
	params,
}: {
	params: {
		content: Project;
	};
}) {
	return (
		<div className="flex justify-center">
			<div className="mb-4 mt-4 flex w-full flex-col rounded-lg border-2 border-slate-300 p-4 hover:border-lime-500 md:w-full">
				<div className="flex items-center pb-2">
					<h2 className="mr-4 pb-2 pt-2 text-xl font-semibold text-lime-500 selection:text-slate-950 hover:text-slate-50">
						<Link href={params.content.link}>{params.content.title}</Link>
					</h2>
					{params.content.gitHubLink && (
						<LinkIconWrapper
							params={{
								href: params.content.gitHubLink,
								icon: <GitHubIcon />,
							}}
						/>
					)}
				</div>
				<p className="text-md lg:text-md pb-2 pl-0 xl:text-lg">{params.content.description}</p>
			</div>
		</div>
	);
}
