import { Constructor } from "@/app/types/projectTypes";

/**
 * F1 constructor standings component.
 *
 * @returns {JSX.Element} Constructors component
 */
export default async function Constructors() {
  let constructorData: Constructor[] | null = null;
  let error: string | null = null;
  let season = "";

  try {
    const data = await getConstructorData();
    season = data.season;
    if (
      data.constructorData instanceof Array &&
      data.constructorData.length > 0
    ) {
      constructorData = data.constructorData;
    } else {
      throw new Error("No standings found");
    }
  } catch (err: any) {
    console.log("Error fetching data");
    error = "Failed to fetch constructors standings data";
  }

  if (error) {
    return (
      <div className="w-full min-h-screen text-slate-50">Error: {error}</div>
    );
  }

  if (!constructorData || constructorData.length === 0) {
    return (
      <div className="w-full min-h-screen text-slate-50">
        No standings found
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen relative bg-slate-950 text-slate-50 selection:bg-lime-500 scroll-smooth">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">
            Formula 1 {season} Constructors Standings
          </h1>
        </div>
        <ul className="grid gap-4">
          {constructorData.map((constructor, index) => {
            return (
              <li
                key={index}
                className="bg-slate-950 border p-4 rounded-md border-slate-50 hover:bg-slate-800 shadow-md grid grid-cols-3">
                <div className="col-span-2">
                  <h2 className="text-xl font-bold">
                    {constructor.position}. {constructor.Constructor.name}
                  </h2>
                  <div className="text-md">
                    Points: {constructor.points} | Wins: {constructor.wins}
                  </div>
                  <div className="text-md">
                    Nationality: {constructor.Constructor.nationality}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

/**
 * Fetches the constructor standings data from external jolpica f1 API.
 * @returns {Promise<Race[]>} A promise that resolves to an array of objects.
 * @throws {Error} If fetching the data fails or if the data format is invalid.
 */
async function getConstructorData(): Promise<any> {
  const res = await fetch(
    "https://api.jolpi.ca/ergast/f1/current/constructorstandings.json",
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch constructor standings data");
  }
  const data = await res.json();
  console.log("Fetched constructor standings data");

  if (
    data.MRData &&
    data.MRData.StandingsTable &&
    data.MRData.StandingsTable.StandingsLists instanceof Array &&
    data.MRData.StandingsTable.StandingsLists.length > 0
  ) {
    const standingsList = data.MRData.StandingsTable.StandingsLists[0];
    const conData = standingsList.ConstructorStandings.map(
      (constructor: Constructor) => ({
        position: constructor.position,
        points: constructor.points,
        wins: constructor.wins,
        Constructor: {
          name: constructor.Constructor.name,
          nationality: constructor.Constructor.nationality,
        },
      })
    );
    return { season: standingsList.season, constructorData: conData };
  } else {
    return { season: "", constructorData: [] };
  }
}
