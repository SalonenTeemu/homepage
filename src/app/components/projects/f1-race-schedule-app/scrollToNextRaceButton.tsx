"use client";

interface ScrollToNextRaceButtonProps {
  nextRaceIndex: number;
}

/**
 * Button to scroll to the next upcoming race.
 *
 * @param param0 nextRaceIndex: Index of the race to scroll to
 * @returns {JSX.Element} ScrollToNextRaceButton component
 */
export default function ScrollToNextRaceButton({
  nextRaceIndex,
}: ScrollToNextRaceButtonProps) {
  function scrollToNextRace() {
    const nextRaceElement = document.getElementById(`race${nextRaceIndex + 1}`);
    if (nextRaceElement) {
      nextRaceElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <button
      className="px-2 py-1.5 text-slate-50 rounded-md border border-slate-50 hover:text-lime-500 hover:border-lime-500 transition-none md:transition ease-in-out md:hover:-translate-y-1 duration-150 motion-reduce:transition-none"
      onClick={scrollToNextRace}
    >
      Show Next Race
    </button>
  );
}
