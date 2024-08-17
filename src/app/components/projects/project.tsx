import Link from "next/link";
import LinkIconWrapper from "@/app/components/about/linkIconWrapper";
import GitHubIcon from "@/app/assets/icons/gitHubIcon";
import { ProjectType } from "@/app/types/projectTypes";

export default function Project({
  params,
}: {
  params: {
    content: ProjectType;
  };
}) {
  return (
    <div className="flex justify-center">
      <div className="rounded p-4 mt-4 mb-4 border-2 border-slate-300 w-full md:w-full flex flex-col hover:border-lime-500">
        <div className="flex items-center pb-2">
          <h2 className="pt-2 pb-2 text-xl font-semibold mr-4 text-lime-500 hover:text-slate-50 selection:text-slate-950">
            <Link href={params.content.link}>{params.content.title}</Link>
          </h2>
          <LinkIconWrapper
            params={{
              href: params.content.gitHubLink,
              icon: <GitHubIcon />,
            }}
          />
        </div>
        <p className="pl-0 pb-2">{params.content.description}</p>
      </div>
    </div>
  );
}
