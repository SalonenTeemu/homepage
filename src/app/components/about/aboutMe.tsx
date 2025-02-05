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
			className="flex h-full w-full flex-col items-center justify-center pb-12 pt-12 text-center lg:flex-row lg:pb-24 lg:pt-24"
		>
			<div className="flex w-full justify-center p-4 lg:w-1/2 lg:justify-end">
				<div className="-full mr-0 flex flex-row justify-center md:w-4/5 lg:ml-8 lg:mr-4 lg:w-full xl:ml-16 xl:mr-16 xl:w-4/5 2xl:w-4/5">
					<div className="w-2/3 overflow-hidden rounded-xl">
						<Image src={profilePicture} alt="Picture of Teemu Salonen" placeholder="blur" priority />
					</div>
				</div>
			</div>
			<div className="flex w-full justify-center p-4 lg:w-1/2 lg:justify-start">
				<div className="4xl:w-3/5 ml-0 flex w-full flex-col justify-center md:w-4/5 lg:ml-4 lg:mr-8 lg:w-full lg:text-left xl:ml-16 xl:mr-16 xl:w-4/5">
					<p className="md:text-md 3xl:text-3xl text-sm lg:text-lg 2xl:text-xl">{descriptions.aboutMe}</p>
					<div className="flex flex-col justify-center pt-8 lg:justify-start">
						<p className="md:text-md 3xl:text-3xl pb-2 text-sm lg:text-lg 2xl:text-xl">
							Find me on LinkedIn or check out some of my projects on GitHub. You can also reach me via
							email at{" "}
							<Link
								href="mailto:teemutapani.salonen@gmail.com"
								target="_blank"
								className="text-lime-500 selection:text-slate-950 hover:text-slate-50"
							>
								teemutapani.salonen@gmail.com
							</Link>
							{"."}
						</p>
						<div className="flex justify-center gap-4 pb-2 lg:justify-start">
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
						<p className="md:text-md 3xl:text-3xl text-sm lg:text-lg 2xl:text-xl">
							<Link
								href="/resume"
								className="text-md font-bold text-lime-500 selection:text-slate-950 hover:text-slate-50"
							>
								Find my resume page here.
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
