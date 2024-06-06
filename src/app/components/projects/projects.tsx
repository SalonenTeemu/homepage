import Project from "@/app/components/projects/project";
import { projectDescriptions } from "@/app/assets/content/descriptions";

export default function Projects() {
  const descriptions = projectDescriptions();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <p className="text-md lg:text-lg 2xl:text-xl 3xl:text-3xl pt-4 pb-4">
          This page contains some miscellaneous projects that I wanted to add to
          the website.
          <br />
          Try out a project by clicking its title. View the project&apos;s
          GitHub page by clicking the icon.
        </p>
      </div>
      <Project params={{ content: descriptions.f1ScheduleApp }} />
    </div>
  );
}
