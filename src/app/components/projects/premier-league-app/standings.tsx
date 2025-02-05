import Image from "next/image";
import { Competition, Team } from "@/app/types/projectTypes";

/**
 * Fetches the competition and standings data from external football-data.org API.
 *
 * @returns {Promise<{ competition: Competition, standings: Team[] }>} The competition and standings data
 * @throws {Error} If fetching the data fails or if the data format is invalid
 */
async function getCompetitionAndStandingsData(): Promise<{
	competition: Competition;
	standings: Team[];
}> {
	const apiKey = process.env.FOOTBALL_DATA_API_KEY;
	if (!apiKey) {
		throw new Error("API key is not defined.");
	}

	const res = await fetch("https://api.football-data.org/v4/competitions/PL/standings", {
		next: { revalidate: 3600 },
		headers: {
			"X-Auth-Token": apiKey,
		},
	});
	if (!res.ok) {
		throw new Error("Failed to fetch standings data");
	}

	const data = await res.json();

	if (data.standings && data.standings[0].table && data.competition && data.season && data.area && data.filters) {
		const standings = data.standings[0].table.map((PLteam: any) => ({
			name: PLteam.team.name,
			position: PLteam.position,
			crest: PLteam.team.crest,
			playedGames: PLteam.playedGames,
			won: PLteam.won,
			draw: PLteam.draw,
			lost: PLteam.lost,
			points: PLteam.points,
			goalsFor: PLteam.goalsFor,
			goalsAgainst: PLteam.goalsAgainst,
			goalDifference: PLteam.goalDifference,
		}));

		const competition = {
			name: data.competition.name,
			flag: data.area.flag,
			emblem: data.competition.emblem,
			season: data.filters.season,
			currentMatchday: data.season.currentMatchday,
		};

		console.log("Fetched standings data successfully");
		return { competition, standings };
	} else {
		throw new Error("Invalid data format");
	}
}

/**
 * Standings table component that displays the Premier League standings.
 *
 * @param param0 competition: Competition object, standings: Team array
 * @returns {JSX.Element} The standings table component
 */
function StandingsTable({ competition, standings }: { competition: Competition; standings: Team[] }) {
	return (
		<div className="mb-8">
			<div className="mb-1 flex items-center justify-between">
				<div className="flex items-center">
					<Image src={competition?.flag} alt={`${competition?.name} flag`} className="mr-4 h-12 w-12" />
					<h1 className="text-3xl font-bold">
						{competition?.name} Season {competition?.season}/{parseInt(competition?.season) + 1} Standings
					</h1>
				</div>
				<Image src={competition?.emblem} alt={`${competition?.name} emblem`} className="h-24 w-24" />
			</div>

			<table className="w-full table-auto border-collapse text-center">
				<thead className="bg-slate-800 text-slate-50">
					<tr>
						<th className="border border-slate-700 px-4 py-2">Position</th>
						<th className="border border-slate-700 px-4 py-2">Team</th>
						<th className="border border-slate-700 px-4 py-2">Played</th>
						<th className="border border-slate-700 px-4 py-2">Won</th>
						<th className="border border-slate-700 px-4 py-2">Drawn</th>
						<th className="border border-slate-700 px-4 py-2">Lost</th>
						<th className="border border-slate-700 px-4 py-2">GF</th>
						<th className="border border-slate-700 px-4 py-2">GA</th>
						<th className="border border-slate-700 px-4 py-2">GD</th>
						<th className="border border-slate-700 px-4 py-2">Points</th>
					</tr>
				</thead>
				<tbody className="border-slate-700 bg-slate-900 text-slate-50">
					{standings.map((team, index) => (
						<tr key={index} className="border border-slate-700 hover:bg-slate-800">
							<td className="border border-slate-700 px-4 py-2">{team.position}</td>
							<td className="flex items-center px-4 py-2">
								<Image src={team.crest} alt={`${team.name} crest`} className="mr-2 h-6 w-6" />
								{team.name}
							</td>
							<td className="border border-slate-700 px-4 py-2">{team.playedGames}</td>
							<td className="border border-slate-700 px-4 py-2">{team.won}</td>
							<td className="border border-slate-700 px-4 py-2">{team.draw}</td>
							<td className="border border-slate-700 px-4 py-2">{team.lost}</td>
							<td className="border border-slate-700 px-4 py-2">{team.goalsFor}</td>
							<td className="border border-slate-700 px-4 py-2">{team.goalsAgainst}</td>
							<td className="border border-slate-700 px-4 py-2">{team.goalDifference}</td>
							<td className="border border-slate-700 px-4 py-2 font-bold">{team.points}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

/**
 * Standings component that fetches and displays the Premier League standings.
 *
 * @returns {JSX.Element} The Standings component
 */
export default async function Standings() {
	let error: string | null = null;
	let competition: Competition | null = null;
	let standings: Team[] | null = null;
	try {
		const compAndStandingsData = await getCompetitionAndStandingsData();
		competition = compAndStandingsData.competition;
		standings = compAndStandingsData.standings;
	} catch (err: any) {
		console.error("Error fetching data:", err);
		error = err.message || "Failed to fetch standings data";
	}

	if (error) {
		return <div className="text-slate-50">Error: {error}</div>;
	}

	if (!competition || !standings || standings.length === 0) {
		return <div className="text-slate-50">No standings found.</div>;
	}

	return <StandingsTable competition={competition} standings={standings} />;
}
