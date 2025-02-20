import MatchesView from "@/app/components/projects/premier-league-app/matchesView";
import { Competition, Match } from "@/app/types/projectTypes";
import logger from "@/app/lib/logger";

/**
 * Fetches the match data from external football-data.org API.
 *
 * @returns {Promise<{ competition: Competition, matches: Match[] }>} The competition and match data
 * @throws {Error} If fetching the data fails or if the data format is invalid
 */
async function getMatchData(): Promise<{
	competition: Competition;
	matches: Match[];
}> {
	const apiKey = process.env.FOOTBALL_DATA_API_KEY;
	if (!apiKey) {
		logger.error("FOOTBALL_DATA_API_KEY is not defined.");
		throw new Error("API key is not defined.");
	}

	const res = await fetch("https://api.football-data.org/v4/competitions/PL/matches", {
		next: { revalidate: 3600 },
		headers: {
			"X-Auth-Token": apiKey,
		},
	});
	if (!res.ok) {
		logger.error("Failed to fetch match data from football-data.org API");
		throw new Error("Failed to retrieve match data");
	}

	const data = await res.json();

	if (data.matches && data.matches[0].season && data.competition && data.matches[0].area && data.filters) {
		const matches = data.matches.map((PLmatch: any) => ({
			matchday: PLmatch.matchday,
			date: PLmatch.utcDate,
			live: ["LIVE", "IN_PLAY", "PAUSED"].includes(PLmatch.status),
			homeTeam: {
				name: PLmatch.homeTeam.name,
				crest: PLmatch.homeTeam.crest,
				score: PLmatch.score.fullTime.home,
			},
			awayTeam: {
				name: PLmatch.awayTeam.name,
				crest: PLmatch.awayTeam.crest,
				score: PLmatch.score.fullTime.away,
			},
		}));
		const competition = {
			name: data.competition.name,
			flag: data.matches[0].area.flag,
			emblem: data.competition.emblem,
			season: data.filters.season,
			currentMatchday: data.matches[0].season.currentMatchday,
		};

		return { competition, matches };
	} else {
		logger.error("Failed to parse match data from football-data.org API");
		throw new Error("Failed to retrieve match data");
	}
}

/**
 * Matches component displaying the Premier League fixtures.
 *
 * @returns {JSX.Element} The matches component
 */
export default async function Matches() {
	let error: string | null = null;
	let competition: Competition | null = null;
	let matches: Match[] | null = null;
	try {
		const compAndMatchesData = await getMatchData();
		matches = compAndMatchesData.matches;
		competition = compAndMatchesData.competition;
	} catch (err: any) {
		error = err.message || "Failed to retrieve match data";
	}

	if (error) {
		return <div className="text-slate-50">Error: {error}</div>;
	}

	if (!competition || !matches || matches.length === 0) {
		return <div className="text-slate-50">No fixtures found.</div>;
	}

	return <MatchesView competition={competition} matches={matches} />;
}
