import { RaceType } from "../types/projectTypes";

/**
 * Generates a random alphanumeric ID of a specified length.
 * @param {number} length - The length of the generated ID.
 * @returns {string} The generated ID.
 */
export function makeId(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

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
 * @param {RaceType[]} races - An array of Race objects representing the race schedule.
 * @returns {number} The index of the next race, or -1 if there are no future races.
 */
export function getNextRaceIndex(races: RaceType[]): number {
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
 * Formats the date and time of a Premier League match.
 * @param {string} utcDate - The date and time of the match in UTC format.
 * @returns {string} The formatted date and time of the match.
 */
export function formatMatchDate(utcDate: string): string {
  const localDate = new Date(utcDate);

  const day = localDate.getDate();
  const month = localDate.getMonth() + 1;
  const year = localDate.getFullYear();

  const hours = localDate.getHours();
  const minutes = localDate.getMinutes();

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Get the weekday name
  const weekdayName = weekdays[localDate.getDay()];

  // Ensure two digits for day, month, hours, and minutes
  const formattedDay = day.toString().padStart(2, "0");
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${weekdayName} ${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}`;
}

/**
 * Formats the date and time of a race.
 * @param {string} date - The date of the race.
 * @param {string} time - The time of the race.
 * @returns {Object} An object containing the formatted date and time.
 */
export function formatRaceDate(date: string, time: string): any {
  const utcDateTime = new Date(`${date}T${time}`);

  // Check if the date is greater than or equal to October 27th when clocks are turned
  const isAfterClockChange =
    utcDateTime >= new Date(`${utcDateTime.getUTCFullYear()}-10-27T00:00:00`);

  // Adjust the offset accordingly
  const offset = isAfterClockChange ? 2 : 3;

  const localDateTime = new Date(
    utcDateTime.getTime() + offset * 60 * 60 * 1000
  );

  const formattedDate = `${("0" + localDateTime.getUTCDate()).slice(-2)}.${(
    "0" +
    (localDateTime.getUTCMonth() + 1)
  ).slice(-2)}.${localDateTime.getUTCFullYear()}`;

  const formattedTime = `${("0" + localDateTime.getUTCHours()).slice(-2)}:${(
    "0" + localDateTime.getUTCMinutes()
  ).slice(-2)}`;

  return { date: formattedDate, time: formattedTime };
}
