export default function Hobbies({
  params,
}: {
  params: {
    content: string[];
  };
}) {
  return (
    <div className="rounded p-4 mt-4 mb-4 border-2 border-slate-300 w-full flex flex-col hover:border-lime-500">
      <div className="flex flex-col text-left">
        <ul className="list-disc ml-4">
          {params.content.map((x, i, arr) => {
            let className = "";

            if (i === 0) {
              className += "pt-2 pb-1";
            } else if (i === arr.length - 1) {
              className += "pb-2";
            } else {
              className += "pb-1";
            }
            return (
              <li key={`${x}-${i}`} className={className}>
                {x}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
