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
        <p className="text-md lg:text-lg 2xl:text-xl 3xl:text-3xl pt-4 pb-4">
          This page contains some miscellaneous projects that I wanted to add to
          the website made for learning purposes and for fun.
          <br />
          Try out an application by clicking its title. View the GitHub page of
          the project by clicking the GitHub icon.
        </p>
      </div>
      <Project params={{ content: descriptions.premierLeagueApp }} />
      <Project params={{ content: descriptions.f1ScheduleApp }} />
    </div>
  );
}
