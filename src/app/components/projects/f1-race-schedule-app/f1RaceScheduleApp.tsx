import { RaceType } from "@/app/types/projectTypes";
import {
  isRaceFinished,
  getNextRaceIndex,
  formatRaceDate,
} from "../../../utils/utils";
import ScrollToNextRaceButton from "@/app/components/projects/f1-race-schedule-app/scrollToNextRaceButton";

export default async function F1RaceScheduleApp() {
  let raceScheduleData: RaceType[] | null = null;
  let error: string | null = null;

  try {
    const data = await getRaceScheduleData();
    if (data instanceof Array && data.length > 0) {
      raceScheduleData = data;
    } else {
      throw new Error("No races found");
    }
  } catch (err: any) {
    console.error("Error fetching data:", err);
    error = err.message || "Failed to fetch race schedule data";
  }

  if (error) {
    return <div className="text-slate-50">Error: {error}</div>;
  }

  if (!raceScheduleData || raceScheduleData.length === 0) {
    return <div className="text-slate-50">No races found</div>;
  }

  const nextRaceIndex = getNextRaceIndex(raceScheduleData);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Formula 1 2024 Schedule</h1>
        <div className="flex flex-wrap items-center">
          <div className="flex items-center mr-4 mt-1">
            <div className="w-8 h-8 rounded-md bg-zinc-700 border border-slate-50 mr-2"></div>
            <span>Finished Race</span>
          </div>
          <div className="flex items-center mr-4 mt-1">
            <div className="w-8 h-8 rounded-md bg-lime-500 border border-slate-50 mr-2"></div>
            <span>Next Race</span>
          </div>
          <div className="flex items-center mr-4 mt-1">
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
          const formattedDateTime = formatRaceDate(race.date, race.time);
          return (
            <li
              key={index}
              id={`race${index + 1}`}
              className={`border p-4 rounded-md ${
                isRaceFinished(race.date) ? "bg-zinc-700" : ""
              } ${index === nextRaceIndex ? "bg-lime-500 text-slate-950" : ""}`}
            >
              <h2 className="text-xl font-bold">
                {race.round}. {race.raceName}
              </h2>
              <p>Date: {formattedDateTime.date}</p>
              <p>Time: {formattedDateTime.time}</p>
              <p>
                Location: {race.Circuit.Location.locality},{" "}
                {race.Circuit.Location.country}
              </p>
              <p>Circuit: {race.Circuit.circuitName}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Fetches the race schedule data from external ergast f1 API.
 * @returns {Promise<RaceType[]>} A promise that resolves to an array of Race objects.
 * @throws {Error} If fetching the data fails or if the data format is invalid.
 */
async function getRaceScheduleData(): Promise<RaceType[]> {
  const res = await fetch("https://ergast.com/api/f1/current.json", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch race data");
  }
  const data = await res.json();
  console.log("Fetched race data");

  if (data.MRData && data.MRData.RaceTable && data.MRData.RaceTable.Races) {
    return data.MRData.RaceTable.Races.map((race: RaceType) => ({
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
