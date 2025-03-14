import Link from "next/link";
import { roboto } from "@/app/components/common/fonts";

/**
 * The introduction component.
 *
 * @returns {JSX.Element} Introduction component
 */
export default function Introduction() {
	return (
		<>
			<div
				className={`${roboto.variable} mb-4 mt-16 font-rubik text-3xl text-lime-500 selection:text-slate-950 md:text-3xl lg:text-4xl 2xl:text-5xl`}
			>
				Welcome!
			</div>
			<div className="flex h-full w-full flex-col justify-center text-center text-lg lg:flex-row">
				<div className="flex w-full justify-center p-4 lg:w-1/2 lg:justify-end">
					<div className="mr-0 flex w-full flex-col md:w-4/5 lg:ml-8 lg:mr-4 lg:w-5/6 xl:ml-16 xl:mr-16 xl:w-4/5 2xl:w-3/4">
						<p className="3xl:text-3xl pb-4 pt-4 text-xl lg:text-xl 2xl:text-xl">Purpose of the website</p>
						<div className="mb-2 mt-4 flex w-full flex-col rounded-lg border-2 border-slate-300 p-4 hover:border-lime-500">
							<div className="flex flex-col text-left">
								<p className="pl-0 pt-2">
									Welcome to my personal website, created as a platform for learning full-stack web
									development and experimenting with new technologies.
								</p>
								<p className="pl-0 pt-2">
									The site features details{" "}
									<Link
										className="font-semibold text-lime-500 selection:text-slate-950 hover:text-slate-50"
										href="/about"
									>
										about me
									</Link>
									, my resume, and includes some
									<Link
										className="font-semibold text-lime-500 selection:text-slate-950 hover:text-slate-50"
										href="/projects"
									>
										{" "}
										projects{" "}
									</Link>
									I have worked on. Additionally, there is a{" "}
									<Link
										className="font-semibold text-lime-500 selection:text-slate-950 hover:text-slate-50"
										href="/forum"
									>
										chat forum{" "}
									</Link>
									where authenticated users can post and participate in discussions.
								</p>
								<p className="pl-0 pt-2">
									Built with Next.js, TypeScript, Tailwind CSS, and other technologies, the site uses
									AWS DynamoDB for database storage and is deployed on Vercel.
								</p>
								<p className="pl-0 pt-2">
									<span className="text-lime-500 selection:text-slate-950">Please note </span>that the
									application is not in active development and is a hobby project so issues may occur.
									Updates will be made as I find time and have meaningful ideas to implement.
								</p>
								<p className="pb-2 pl-0 pt-2">
									Feel free to explore the site, and do not hesitate to reach out if you have any
									questions or feedback. You can find my LinkedIn, email, and a link to my GitHub
									profile in the footer below, where you can also explore more of my projects.
								</p>
								<p className="pb-2 pl-0 pt-2">
									<span className="text-lime-500 selection:text-slate-950">Latest update</span>:
									14.03.2025
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="flex w-full justify-center p-4 lg:w-1/2 lg:justify-start">
					<div className="ml-0 flex w-full flex-col md:w-4/5 lg:ml-4 lg:mr-8 lg:w-5/6 xl:ml-16 xl:mr-16 xl:w-4/5 2xl:w-3/4">
						<p className="text-md 3xl:text-3xl pb-4 pt-4 text-xl lg:text-xl 2xl:text-xl">Features</p>
						<div className="mb-2 mt-4 flex w-full flex-col rounded-lg border-2 border-slate-300 p-4 hover:border-lime-500">
							<div className="flex flex-col text-left">
								<p className="pt-2">The website features several key pages:</p>
								<ul className="ml-8 list-disc pb-2">
									<li>
										<Link
											className="font-semibold text-lime-500 selection:text-slate-950 hover:text-slate-50"
											href="/about"
										>
											About Me:{" "}
										</Link>
										This page provides information about me, my resume, and links to my LinkedIn and
										GitHub profiles.
									</li>
									<li>
										<Link
											className="font-semibold text-lime-500 selection:text-slate-950 hover:text-slate-50"
											href="/projects"
										>
											Projects:{" "}
										</Link>
										Here, you will find a selection of applications I have worked on and chose to
										include on the website. Each project includes a brief description and, when
										available, a link to its GitHub repository.
									</li>
									<li>
										<Link
											className="font-semibold text-lime-500 selection:text-slate-950 hover:text-slate-50"
											href="/forum"
										>
											Forum:{" "}
										</Link>
										This page hosts a chat forum where authenticated users can participate in
										discussions by posting and replying to others.
									</li>
								</ul>

								<p className="pl-0 pt-2">
									The website also includes user authentication and authorization:
								</p>
								<ul className="ml-8 list-disc pb-2">
									<li>
										Access the login, registration, and profile pages from the menu in the top right
										corner.
									</li>
									<li>Users can register an account and log in using their username or email.</li>

									<li>User details are stored in AWS DynamoDB.</li>
									<li>Users can view, update, or delete their profile at any time.</li>
									<li>
										After confirming their email address, users can request a password reset via
										email.
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
