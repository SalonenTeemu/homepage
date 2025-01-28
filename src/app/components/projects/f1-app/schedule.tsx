import { Race } from "@/app/types/projectTypes";
import {
  isRaceFinished,
  getNextRaceIndex,
  formatTime,
  formatDate,
} from "@/app/utils/f1AppUtils";
import ScrollToNextRaceButton from "@/app/components/projects/f1-app/scrollToNextRaceButton";

/**
 * The F1 Race Schedule component.
 *
 * @returns {JSX.Element} Race schedule component
 */
export default async function Schedule() {
  let raceScheduleData: Race[] | null = null;
  let error: string | null = null;

  try {
    const data = await getRaceScheduleData();
    if (data instanceof Array && data.length > 0) {
      raceScheduleData = data;
    } else {
      error = "No races found";
    }
  } catch (err: any) {
    console.log("Error fetching data");
    error = "Failed to fetch race schedule data";
  }

  if (error) {
    return (
      <div className="w-full min-h-screen text-slate-50">Error: {error}</div>
    );
  }

  if (!raceScheduleData || raceScheduleData.length === 0) {
    return (
      <div className="w-full min-h-screen text-slate-50">No races found</div>
    );
  }

  const nextRaceIndex = getNextRaceIndex(raceScheduleData);

  return (
    <main className="w-full min-h-screen relative bg-slate-950 text-slate-50 selection:bg-lime-500 scroll-smooth">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">
            Formula 1 {raceScheduleData[0].season} Race Schedule
          </h1>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <div className="w-8 h-8 rounded-md bg-zinc-700 border border-slate-50 mr-2"></div>
              <span>Finished Race</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-8 h-8 rounded-md bg-lime-500 border border-slate-50 mr-2"></div>
              <span>Next Race</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-8 h-8 rounded-md bg-slate-950 border border-slate-50 mr-2"></div>
              <span>Upcoming Race</span>
            </div>
            {nextRaceIndex !== null && (
              <div className="flex items-center mt-1">
                <ScrollToNextRaceButton nextRaceIndex={nextRaceIndex} />
              </div>
            )}
          </div>
        </div>
        <ul className="grid gap-4">
          {raceScheduleData.map((race, index) => {
            const formattedDate = formatDate(race.date);
            const formattedTime = formatTime(race.time);

            return (
              <li
                key={index}
                id={`race${index + 1}`}
                className={`border p-4 rounded-md ${
                  isRaceFinished(race.date) ? "bg-zinc-700" : ""
                } ${
                  index === nextRaceIndex
                    ? "bg-lime-500 text-slate-950"
                    : "hover:bg-slate-800"
                }`}>
                <h2 className="text-xl font-bold">
                  {race.round}. {race.raceName}
                </h2>
                <div className="text-md">Date: {formattedDate}</div>
                {formattedTime && (
                  <div className="text-md">Time: {formattedTime}</div>
                )}

                <div className="text-md">
                  Location: {race.Circuit.Location.locality},{" "}
                  {race.Circuit.Location.country}
                </div>
                <div className="text-md">
                  Circuit: {race.Circuit.circuitName}
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
 * Fetches the race schedule data from external jolpica f1 API.
 *
 * @returns {Promise<Race[]>} A promise that resolves to an array of Race objects.
 * @throws {Error} If fetching the data fails or if the data format is invalid.
 */
async function getRaceScheduleData(): Promise<Race[]> {
  const res = await fetch("https://api.jolpi.ca/ergast/f1/current.json", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch race data");
  }
  const data = await res.json();
  console.log("Fetched race data");

  if (data.MRData && data.MRData.RaceTable && data.MRData.RaceTable.Races) {
    return data.MRData.RaceTable.Races.map((race: Race) => ({
      season: race.season,
      round: race.round,
      raceName: race.raceName,
      date: race.date,
      time: race.time,
      Circuit: {
        circuitName: race.Circuit.circuitName,
        Location: {
          locality: race.Circuit.Location.locality,
          country: race.Circuit.Location.country,
        },
      },
    }));
  } else {
    throw new Error("Invalid data format");
  }
}
