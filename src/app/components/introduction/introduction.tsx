import { roboto } from "@/app/components/common/fonts";
import AboutMeScroll from "@/app/components/introduction/aboutMeScroll";

/**
 * The front page introduction component.
 *
 * @returns {JSX.Element} Introduction component
 */
export default function Introduction() {
	const highlightedText = "text-lime-500 font-bold selection:text-slate-950";

	return (
		<div id="introduction" className="relative h-screen w-full">
			<div className="flex h-full w-full flex-col items-center justify-center pl-4 pr-4 text-left md:pl-0 md:pr-0">
				<div className={`${roboto.variable} font-rubik`}>
					<p className="mb-1 text-xl md:text-3xl lg:text-4xl 2xl:text-5xl">
						Hey! Welcome to my <span className={highlightedText}>homepage!</span>
					</p>
					<p className="text-md md:text-xl lg:text-2xl 2xl:text-3xl">
						My name is <span className={highlightedText}>Teemu Salonen</span>.
					</p>
					<p
						className={`md:text-md pt-2 text-xs sm:text-sm lg:text-lg 2xl:text-xl ${roboto.variable} font-inter`}
					>
						I am a computer science student currently pursuing a {"master's"} degree.
						<br />I am passionate about software engineering and always{" "}
						<span className={highlightedText}>open</span> to new challenges and{" "}
						<span className={highlightedText}>interested</span> in learning new technologies.
					</p>
				</div>
			</div>

			<div className="absolute bottom-32 flex w-full items-center justify-center text-slate-50 md:bottom-24">
				<AboutMeScroll />
			</div>
		</div>
	);
}
