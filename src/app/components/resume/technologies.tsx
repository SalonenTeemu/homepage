import makeId from "@/app/utils/utils";

export default function Technologies({
  params,
}: {
  params: {
    content: string[];
  };
}) {
  return (
    <div className="rounded p-4 mt-4 mb-4 border-2 border-slate-300 w-full flex flex-col hover:border-lime-500">
      <div className="flex flex-col text-left">
        <div className="pt-2 pb-2 flex flex-row flex-wrap">
          {params.content.map((x) => (
            <p
              key={`${x}-${makeId(5)}`}
              className="pl-3 pr-3 pt-1 pb-1 bg-lime-500 m-1 rounded-full text-slate-950 transition-none lg:transition ease-in-out hover:transform-none lg:hover:-translate-y-1 duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none"
            >
              {x}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
