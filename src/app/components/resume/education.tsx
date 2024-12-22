import { EducationType } from "@/app/types/resumeTypes";
import Link from "next/link";

/**
 * Component for displaying education information.
 *
 * @param param0 content: EducationType
 * @returns {JSX.Element} The education component
 */
export default function Education({
  params,
}: {
  params: {
    content: EducationType;
  };
}) {
  return (
    <div className="rounded p-4 mt-4 mb-4 border-2 border-slate-300 w-full flex flex-col hover:border-lime-500">
      <div className="flex flex-col text-left">
        <p className="pl-0 pt-2">{params.content.university}</p>
        <p className="pl-0">{params.content.level}</p>
        <p className="pl-0 pb-2 text-slate-300">{params.content.years}</p>
        {params.content.major && (
          <p className="pl-0 pb-2">Major: {params.content.major}</p>
        )}
        {params.content.minor && (
          <p className="pl-0 pb-2">Minor: {params.content.minor}</p>
        )}
        {params.content.thesis && (
          <p className="pl-0 pb-2">Thesis:{" "}
            <Link
              href="https://trepo.tuni.fi/handle/10024/157793"
              className="text-lime-500 hover:text-slate-50 selection:text-slate-950"
            >
              {params.content.thesis}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
