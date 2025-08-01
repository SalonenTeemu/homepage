import Project from "@/app/components/projects/project";
import { projectDescriptions } from "@/app/assets/content/descriptions";

/**
 * Component that displays the projects page with a description of each project.
 *
 * @returns {JSX.Element} Projects component
 */
export default function Projects() {
	const descriptions = projectDescriptions();

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="text-center">
				<p className="3xl:text-2xl pb-4 pt-4 text-lg lg:text-xl 2xl:text-xl">
					This page includes some personal projects created for learning purposes and for fun.
					<br />
					To try out an application, simply click its title. You can also view the projects GitHub repository
					by clicking the GitHub icon if available.
				</p>
			</div>
			<Project params={{ content: descriptions.aiChessApp }} />
			<Project params={{ content: descriptions.premierLeagueApp }} />
			<Project params={{ content: descriptions.aiChatbotApp }} />
			<Project params={{ content: descriptions.f1App }} />
			<Project params={{ content: descriptions.forum }} />
		</div>
	);
}
