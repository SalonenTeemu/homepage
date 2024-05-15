import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full py-4 bg-slate-950 text-slate-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="text-md font-bold hover:text-lime-500 selection:text-slate-950">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/resume"
              className="text-md font-bold hover:text-lime-500 selection:text-slate-950"
            >
              Resume
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
