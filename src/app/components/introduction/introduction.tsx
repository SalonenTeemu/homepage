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
    <div id="introduction" className="w-full h-screen relative">
      <div className="h-full w-full flex flex-col justify-center items-center text-left pl-4 md:pl-0 pr-4 md:pr-0">
        <div className={`${roboto.variable} font-rubik`}>
          <p className="text-xl md:text-3xl lg:text-4xl 2xl:text-5xl mb-1">
            Hey, my name is{" "}
            <span className={highlightedText}>Teemu Salonen</span>.
          </p>
          <p className="text-md md:text-xl lg:text-2xl 2xl:text-3xl">
            I enjoy programming and creating software.
          </p>
          <p
            className={`pt-2 text-xs sm:text-sm md:text-md lg:text-lg 2xl:text-xl ${roboto.variable} font-inter`}
          >
            My strengths lie in{" "}
            <span className={highlightedText}>full-stack</span> web development.
            <br />I am always <span className={highlightedText}>open</span> to
            new challenges and <span className={highlightedText}>interested</span>{" "}
            in learning new technologies.
          </p>
        </div>
      </div>

      <div className="w-full absolute bottom-32 md:bottom-24 flex justify-center items-center text-slate-50">
        <AboutMeScroll />
      </div>
    </div>
  );
}
