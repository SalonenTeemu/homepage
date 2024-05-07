import Image from "next/image";
import LinkIconWrapper from "@/app/components/about/linkIconWrapper";
import profilePicture from "@/public/profilePicture.jpg";
import GitHubIcon from "@/app/assets/icons/gitHubIcon";
import LinkedInIcon from "@/app/assets/icons/linkedInIcon";

export default function AboutMe() {
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
            My name is Teemu Salonen and I am a computer science student
            currently pursuing a master&apos;s degree. I am dedicated to
            continuous improvement in the field. While I excel in web
            development, I look forward to new challenges and can quickly learn
            new technologies. I am especially interested in cloud technologies
            and want to expand my expertise in this area. My experience ranges
            from smaller, independent projects to larger applications used
            worldwide. I am passionate about learning and evolving as a
            developer. I eagerly anticipate new opportunities and challenges in
            the future.
          </p>
          <div className="pt-8 flex flex-col justify-center lg:justify-start">
            <p className="text-sm md:text-md lg:text-lg 2xl:text-xl 3xl:text-3xl">
              Find me on LinkedIn or check out some of my projects on GitHub
            </p>
            <div className="flex justify-center lg:justify-start">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
