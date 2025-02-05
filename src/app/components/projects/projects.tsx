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
			<div className="mb-8 text-center">
				<p className="text-md 3xl:text-3xl pb-4 pt-4 lg:text-lg 2xl:text-xl">
					This page contains some miscellaneous projects that I wanted to add to the website made for learning
					purposes and for fun.
					<br />
					Try out an application by clicking its title. View the GitHub page of the project by clicking the
					GitHub icon.
				</p>
			</div>
			<Project params={{ content: descriptions.aiChessApp }} />
			<Project params={{ content: descriptions.aiChatbotApp }} />
			<Project params={{ content: descriptions.premierLeagueApp }} />
			<Project params={{ content: descriptions.f1ScheduleApp }} />
		</div>
	);
}
