"use client";

import LinkedInIcon from "@/app/assets/icons/linkedInIcon";
import LinkIconWrapper from "../about/linkIconWrapper";
import GitHubIcon from "@/app/assets/icons/gitHubIcon";
import EmailIcon from "@/app/assets/icons/emailIcon";

/**
 * The footer component.
 *
 * @returns {JSX.Element} The footer component
 */
export default function Footer() {
	return (
		<div className="mt-2 flex w-full flex-col items-center justify-center pb-8">
			<div className="flex justify-center gap-4">
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
			<div className="text-center">
				Teemu Salonen{" ("}
				{new Date().getFullYear()}
				{")"}
			</div>
		</div>
	);
}
