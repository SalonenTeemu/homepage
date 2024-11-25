import Experience from "@/app/components/resume/experience";
import Education from "@/app/components/resume/education";
import Hobbies from "@/app/components/resume/hobbies";
import Technologies from "@/app/components/resume/technologies";
import { resumeDescriptions } from "@/app/assets/content/descriptions";

export default function Resume() {
  const descriptions = resumeDescriptions();

  return (
    <div className="w-full h-full text-center justify-center flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 p-4 flex justify-center lg:justify-end">
        <div className="w-full md:w-4/5 lg:w-full xl:w-4/5 2xl:w-3/5 mr-0 lg:ml-8 lg:mr-4 xl:ml-16 xl:mr-16 flex flex-col">
          <p className="text-md lg:text-lg 2xl:text-xl 3xl:text-3xl pt-4 pb-4">
            IT work experience
          </p>
          <Experience
            params={{ content: descriptions.workExperience.valmet }}
          />
          <p className="text-md lg:text-lg 2xl:text-xl 3xl:text-3xl pt-8 pb-4">
            Technologies I am familiar with
          </p>
          <Technologies params={{ content: descriptions.technologies }} />
        </div>
      </div>
      <div className="w-full lg:w-1/2 p-4 flex justify-center lg:justify-start">
        <div className="w-full md:w-4/5 lg:w-full xl:w-4/5 2xl:w-3/5 ml-0 lg:ml-4 lg:mr-8 xl:ml-16 xl:mr-16 flex flex-col">
          <p className="text-md lg:text-lg 2xl:text-xl 3xl:text-3xl pt-4 pb-4">
            Education
          </p>
          <Education params={{ content: descriptions.education.master }} />
          <Education params={{ content: descriptions.education.bachelor }} />

          <p className="text-md lg:text-lg 2xl:text-xl 3xl:text-3xl pt-8 pb-4">
            Hobbies
          </p>
          <Hobbies params={{ content: descriptions.hobbies }} />
        </div>
      </div>
    </div>
  );
}
