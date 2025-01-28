import Schedule from "@/app/components/projects/f1-app/schedule";

/**
 * The main component for the F1 App project.
 *
 * @returns {JSX.Element} The F1 App component
 */
export default function f1App() {
  return (
    <main className="w-full min-h-screen relative bg-slate-950 text-slate-50 selection:bg-lime-500 scroll-smooth">
      <div className="container mx-auto p-4">
        <Schedule />
      </div>
    </main>
  );
}
