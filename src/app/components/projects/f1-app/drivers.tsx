import { Driver } from "@/app/types/projectTypes";

/**
 * F1 driver standings component.
 *
 * @returns {JSX.Element} Drivers component
 */
export default async function Drivers() {
	let driverData: Driver[] | null = null;
	let error: string | null = null;
	let season = "";

	try {
		const data = await getDriverData();
		season = data.season;
		if (data.driverData instanceof Array && data.driverData.length > 0) {
			driverData = data.driverData;
		} else {
			error = "No standings found";
		}
	} catch (err: any) {
		error = "Failed to fetch driver standings data";
	}

	if (error) {
		return <div className="min-h-screen w-full text-slate-50">Error: {error}</div>;
	}

	if (!driverData || driverData.length === 0) {
		return <div className="min-h-screen w-full text-slate-50">No standings found</div>;
	}

	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<div className="container mx-auto p-4">
				<div className="mb-4 flex items-center justify-between">
					<h1 className="text-3xl font-bold">Formula 1 {season} Driver Standings</h1>
				</div>
				<ul className="grid gap-4">
					{driverData.map((driver, index) => {
						return (
							<li
								key={index}
								className="grid grid-cols-3 rounded-md border border-slate-50 bg-slate-950 p-4 shadow-md hover:bg-slate-800"
							>
								<div className="col-span-2">
									<h2 className="text-xl font-bold">
										{driver.position}. {driver.Driver.givenName} {driver.Driver.familyName}
									</h2>
									<div className="text-md">
										Points: {driver.points} | Wins: {driver.wins}
									</div>
									<div className="text-md">Constructor: {driver.Constructor.name}</div>
									<div className="text-md">Nationality: {driver.Driver.nationality}</div>
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
 * Fetches the driver standings data from external jolpica f1 API.
 *
 * @returns {Promise<Race[]>} A promise that resolves to an array of objects.
 * @throws {Error} If fetching the data fails or if the data format is invalid.
 */
async function getDriverData(): Promise<any> {
	const res = await fetch("https://api.jolpi.ca/ergast/f1/current/driverstandings.json", {
		cache: "no-store",
	});
	if (!res.ok) {
		throw new Error("Failed to fetch driver standings data");
	}
	const data = await res.json();

	if (
		data.MRData &&
		data.MRData.StandingsTable &&
		data.MRData.StandingsTable.StandingsLists instanceof Array &&
		data.MRData.StandingsTable.StandingsLists.length > 0
	) {
		const standingsList = data.MRData.StandingsTable.StandingsLists[0];
		const driverData = standingsList.DriverStandings.map((driver: any) => {
			return {
				position: driver.position,
				points: driver.points,
				wins: driver.wins,
				Driver: {
					givenName: driver.Driver.givenName,
					familyName: driver.Driver.familyName,
					nationality: driver.Driver.nationality,
				},
				Constructor: {
					name: driver.Constructors[0].name,
				},
			};
		});
		return { season: standingsList.season, driverData: driverData };
	} else {
		throw new Error("Invalid data format");
	}
}
