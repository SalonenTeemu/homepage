import { Race } from "../types/projectTypes";

/**
 * Checks if a race is finished based on its date.
 *
 * @param {string} raceDate The date of the race
 * @returns {boolean} True if the race is finished, otherwise false
 */
export function isRaceFinished(raceDate: string): boolean {
	const currentDate = new Date();
	const raceDateTime = new Date(raceDate);
	return currentDate > raceDateTime;
}

/**
 * Finds the index of the next race in the schedule.
 *
 * @param {Race[]} races Array of Race objects representing the race schedule
 * @returns {number} The index of the next race, or -1 if there are no future races
 */
export function getNextRaceIndex(races: Race[]): number {
	const currentDate = new Date();
	for (let i = 0; i < races.length; i++) {
		const raceDateTime = new Date(races[i].date);
		if (currentDate.getTime() <= raceDateTime.getTime()) {
			return i;
		}
	}
	return -1;
}

/**
 * Formats the date and time of a race.
 *
 * @param {string} date The date of the race
 * @param {string} time The time of the race
 * @returns {Object} An object containing the formatted date and time
 */
export function formatRaceDate(date: string, time: string): any {
	const utcDateTime = new Date(`${date}T${time}`);

	// Check if the date is greater than or equal to October 27th when clocks are turned
	const isAfterClockChange = utcDateTime >= new Date(`${utcDateTime.getUTCFullYear()}-10-27T00:00:00`);

	// Adjust the offset accordingly
	const offset = isAfterClockChange ? 2 : 3;

	const localDateTime = new Date(utcDateTime.getTime() + offset * 60 * 60 * 1000);

	const formattedDate = `${("0" + localDateTime.getUTCDate()).slice(-2)}/${(
		"0" +
		(localDateTime.getUTCMonth() + 1)
	).slice(-2)}/${localDateTime.getUTCFullYear()}`;

	const formattedTime = `${("0" + localDateTime.getUTCHours()).slice(-2)}:${(
		"0" + localDateTime.getUTCMinutes()
	).slice(-2)}`;

	return { date: formattedDate, time: formattedTime };
}
