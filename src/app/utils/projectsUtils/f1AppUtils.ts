import { Race } from "../../types/projectTypes";

/**
 * Checks if a race is finished based on its date.
 * @param {string} raceDate - The date of the race.
 * @returns {boolean} True if the race is finished, otherwise false.
 */
export function isRaceFinished(raceDate: string): boolean {
	const currentDate = new Date();
	const raceDateTime = new Date(raceDate);
	return currentDate > raceDateTime;
}

/**
 * Finds the index of the next race in the schedule.
 * @param {Race[]} races - An array of Race objects representing the race schedule.
 * @returns {number} The index of the next race, or -1 if there are no future races.
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
 * Formats a UTC date string to a more readable format.
 * @param utcDate The UTC date string to format.
 * @returns The formatted date string.
 */
export function formatDate(utcDate: string): string {
	const localDate = new Date(utcDate);

	const day = localDate.getDate();
	const month = localDate.getMonth() + 1;
	const year = localDate.getFullYear();

	const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	const weekdayName = weekdays[localDate.getDay()];

	const formattedDay = day.toString().padStart(2, "0");
	const formattedMonth = month.toString().padStart(2, "0");

	return `${weekdayName} ${formattedDay}/${formattedMonth}/${year}`;
}

/**
 * Formats a time string to a more readable format in the user's locale.
 * @param time The time string to format.
 * @returns The formatted time string.
 */
export function formatTime(time: string): any {
	const fullTime = `2025-03-16T${time}`;

	const date = new Date(fullTime);

	if (isNaN(date.getTime())) {
		return null;
	}

	const options: Intl.DateTimeFormatOptions = {
		hour: "2-digit",
		minute: "2-digit",
	};

	return date.toLocaleTimeString([], options);
}
