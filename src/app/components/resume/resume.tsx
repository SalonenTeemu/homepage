import Experience from "@/app/components/resume/experience";
import Education from "@/app/components/resume/education";
import Hobbies from "@/app/components/resume/hobbies";
import Technologies from "@/app/components/resume/technologies";
import { resumeDescriptions } from "@/app/assets/content/descriptions";

/**
 * The resume component.
 *
 * @returns {JSX.Element} Resume component
 */
export default function Resume() {
	const descriptions = resumeDescriptions();

	return (
		<>
			<div id="resume" className="w-full pt-4 text-center">
				<p className="3xl:text-5xl pb-4 text-xl lg:text-2xl 2xl:text-3xl">Resume</p>
			</div>

			<div className="flex h-full w-full flex-col justify-center text-center lg:flex-row">
				<div className="flex w-full justify-center p-4 lg:w-1/2 lg:justify-end">
					<div className="mr-0 flex w-full flex-col md:w-3/4 lg:ml-8 lg:mr-4 lg:w-4/5 xl:ml-16 xl:mr-16 xl:w-3/4 2xl:w-2/3">
						<p className="text-md 3xl:text-3xl pb-4 pt-4 lg:text-lg 2xl:text-xl">IT work experience</p>
						<Experience params={{ content: descriptions.workExperience.valmet }} />
						<p className="text-md 3xl:text-3xl pb-4 pt-8 lg:text-lg 2xl:text-xl">
							Technologies I am familiar with
						</p>
						<Technologies params={{ content: descriptions.technologies }} />
					</div>
				</div>
				<div className="flex w-full justify-center p-4 lg:w-1/2 lg:justify-start">
					<div className="ml-0 flex w-full flex-col md:w-3/4 lg:ml-4 lg:mr-8 lg:w-4/5 xl:ml-16 xl:mr-16 xl:w-3/4 2xl:w-2/3">
						<p className="text-md 3xl:text-3xl pb-4 pt-4 lg:text-lg 2xl:text-xl">Education</p>
						<Education params={{ content: descriptions.education.master }} />
						<Education params={{ content: descriptions.education.bachelor }} />

						<p className="text-md 3xl:text-3xl pb-4 pt-8 lg:text-lg 2xl:text-xl">Hobbies</p>
						<Hobbies params={{ content: descriptions.hobbies }} />
					</div>
				</div>
			</div>
		</>
	);
}
