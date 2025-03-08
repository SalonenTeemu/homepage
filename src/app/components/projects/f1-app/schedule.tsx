import { Race } from "@/app/types/projectTypes";
import { isRaceFinished, getNextRaceIndex, formatTime, formatDate } from "@/app/utils/projectsUtils/f1AppUtils";
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
	} catch {
		error = "Failed to fetch race schedule data";
	}

	if (error) {
		return <div className="min-h-screen w-full text-slate-50">Error: {error}</div>;
	}

	if (!raceScheduleData || raceScheduleData.length === 0) {
		return <div className="min-h-screen w-full text-slate-50">No races found</div>;
	}

	const nextRaceIndex = getNextRaceIndex(raceScheduleData);

	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<div className="container mx-auto p-4">
				<div className="mb-4 flex items-center justify-between">
					<h1 className="text-3xl font-bold">Formula 1 {raceScheduleData[0].season} Race Schedule</h1>
					<div className="flex items-center">
						<div className="mr-4 flex items-center">
							<div className="mr-2 h-8 w-8 rounded-md border border-slate-50 bg-zinc-700"></div>
							<span>Finished Race</span>
						</div>
						<div className="mr-4 flex items-center">
							<div className="mr-2 h-8 w-8 rounded-md border border-slate-50 bg-lime-500"></div>
							<span>Next Race</span>
						</div>
						<div className="mr-4 flex items-center">
							<div className="mr-2 h-8 w-8 rounded-md border border-slate-50 bg-slate-950"></div>
							<span>Upcoming Race</span>
						</div>
						{nextRaceIndex !== null && (
							<div className="mt-1 flex items-center">
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
								className={`rounded-md border p-4 ${isRaceFinished(race.date) ? "bg-zinc-700" : ""} ${
									index === nextRaceIndex ? "bg-lime-500 text-slate-950" : "hover:bg-slate-800"
								}`}
							>
								<h2 className="text-xl font-bold">
									{race.round}. {race.raceName}
								</h2>
								<div className="text-md">Date: {formattedDate}</div>
								{formattedTime && <div className="text-md">Time: {formattedTime}</div>}

								<div className="text-md">
									Location: {race.Circuit.Location.locality}, {race.Circuit.Location.country}
								</div>
								<div className="text-md">Circuit: {race.Circuit.circuitName}</div>
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
