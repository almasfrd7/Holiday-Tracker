"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["/", "Dashboard"], ["/itinerary", "Itinerary"], ["/budget", "Budget"],
  ["/calendar", "Calendar"], ["/transport", "Transport"], ["/export", "Export"],
];

// Left nav on desktop, horizontal strip on mobile (Phase 7 responsive layout)
export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="border-b border-slate-200 bg-white md:w-52 md:border-b-0 md:border-r">
      <div className="p-4 text-lg font-semibold text-teal-800">Trip Planner</div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col">
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href}
            className={`whitespace-nowrap rounded px-3 py-2 text-sm ${path === href ? "bg-teal-50 font-medium text-teal-800" : "text-slate-600 hover:bg-slate-100"}`}>
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
