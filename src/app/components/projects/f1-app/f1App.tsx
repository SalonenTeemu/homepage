import Schedule from "@/app/components/projects/f1-app/schedule";

/**
 * The main component for the F1 App project.
 *
 * @returns {JSX.Element} The F1 App component
 */
export default function f1App() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<div className="container mx-auto p-4">
				<Schedule />
			</div>
		</main>
	);
}
