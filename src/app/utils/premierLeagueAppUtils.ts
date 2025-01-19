/**
 * Formats the date and time of a Premier League match.
 *
 * @param {string} utcDate The date and time of the match in UTC format
 * @returns {string} The formatted date and time of the match
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
