import Image from "next/image";
import Link from "next/link";
import { aboutMeDescriptions } from "@/app/assets/content/descriptions";
import LinkIconWrapper from "@/app/components/about/linkIconWrapper";
import profilePicture from "@/public/profilePicture.jpg";
import GitHubIcon from "@/app/assets/icons/gitHubIcon";
import LinkedInIcon from "@/app/assets/icons/linkedInIcon";
import EmailIcon from "@/app/assets/icons/emailIcon";

/**
 * Component for the about me section of the homepage.
 *
 * @returns {JSX.Element} The about me component
 */
export default function AboutMe() {
  const descriptions = aboutMeDescriptions();

  return (
    <div
      id="about"
      className="w-full h-full text-center pt-12 lg:pt-24 pb-12 lg:pb-24 flex flex-col lg:flex-row justify-center items-center"
    >
      <div className="w-full lg:w-1/2 p-4 flex justify-center lg:justify-end">
        <div className="-full md:w-4/5 lg:w-full xl:w-4/5 2xl:w-4/5 mr-0 lg:ml-8 lg:mr-4 xl:ml-16 xl:mr-16 flex flex-row justify-center">
          <div className="w-2/3 overflow-hidden rounded-xl">
            <Image
              src={profilePicture}
              alt="Picture of Teemu Salonen"
              placeholder="blur"
              priority
            />
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 p-4 flex justify-center lg:justify-start">
        <div className="w-full md:w-4/5 lg:w-full xl:w-4/5 4xl:w-3/5 ml-0 lg:ml-4 lg:mr-8 xl:ml-16 xl:mr-16 flex flex-col justify-center lg:text-left">
          <p className="text-sm md:text-md lg:text-lg 2xl:text-xl 3xl:text-3xl">
            {descriptions.aboutMe}
          </p>
          <div className="pt-8 flex flex-col justify-center lg:justify-start">
            <p className="pb-2 text-sm md:text-md lg:text-lg 2xl:text-xl 3xl:text-3xl">
              Find me on LinkedIn or check out some of my projects on GitHub.
              You can also reach me via email at{" "}
              <Link
                href="mailto:teemutapani.salonen@gmail.com"
                target="_blank"
                className="text-lime-500 hover:text-slate-50 selection:text-slate-950"
              >
                teemutapani.salonen@gmail.com
              </Link>
              {"."}
            </p>
            <div className="pb-2 flex justify-center lg:justify-start">
              <LinkIconWrapper
                params={{
                  href: "https://www.linkedin.com/in/teemu-t-salonen/",
                  icon: <LinkedInIcon />,
                }}
              />
              <LinkIconWrapper
                params={{
                  href: "https://github.com/SalonenTeemu/",
                  icon: <GitHubIcon />,
                }}
              />
              <LinkIconWrapper
                params={{
                  href: "mailto:teemutapani.salonen@gmail.com",
                  icon: <EmailIcon />,
                }}
              />
            </div>
            <p className="text-sm md:text-md lg:text-lg 2xl:text-xl 3xl:text-3xl">
              <Link
                href="/resume"
                className="text-md font-bold text-lime-500 hover:text-slate-50 selection:text-slate-950"
              >
                Find the resume page here.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
