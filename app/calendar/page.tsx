"use client";
// Phase 4: monthly calendar with activities and Malaysian (state-aware) public holidays
import { useState } from "react";
import { useStore, uid } from "@/lib/store";
import { holidaysOn } from "@/lib/holidays";

// Format a Date as YYYY-MM-DD using local time (avoids timezone shifts)
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function CalendarPage() {
  const { data, setData } = useStore();
  const [month, setMonth] = useState(() => { const d = data.trip?.startDate ? new Date(data.trip.startDate + "T00:00") : new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [sel, setSel] = useState("");
  const [title, setTitle] = useState("");
  const state = data.trip?.state ?? "";

  // Build the grid: leading blanks for the weekday offset, then each day
  const first = month.getDay();
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => iso(new Date(month.getFullYear(), month.getMonth(), i + 1)))];

  const selActs = data.activities.filter((a) => a.date === sel).sort((a, b) => a.start.localeCompare(b.start));
  const selHol = sel ? holidaysOn(sel, state) : [];

  // Quick add: creates a default 09:00–10:00 activity that can be refined on the Itinerary page
  function quickAdd() {
    if (!title.trim() || !sel) return;
    setData({ ...data, activities: [...data.activities, { id: uid(), title, date: sel, start: "09:00", end: "10:00", location: "", notes: "", category: "sightseeing" }] });
    setTitle("");
  }

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Calendar</h1>
      <div className="flex items-center gap-2">
        <button className="btn2" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>Previous</button>
        <div className="w-44 text-center font-medium">{month.toLocaleString("en-MY", { month: "long", year: "numeric" })}</div>
        <button className="btn2" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>Next</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d}>{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const acts = data.activities.filter((a) => a.date === d).length;
          const hol = holidaysOn(d, state).length > 0;
          return (
            <button key={d} onClick={() => setSel(d)}
              className={`min-h-16 rounded border p-1 text-left text-sm ${sel === d ? "border-teal-600 ring-2 ring-teal-600" : "border-slate-200"} ${hol ? "bg-amber-50" : "bg-white"}`}>
              <div>{Number(d.slice(8))}</div>
              {acts > 0 && <div className="text-xs text-teal-700">{acts} activit{acts > 1 ? "ies" : "y"}</div>}
              {hol && <div className="text-xs text-amber-700">Holiday</div>}
            </button>
          );
        })}
      </div>

      {sel && (
        <section className="card space-y-2">
          <h2 className="font-medium">{new Date(sel + "T00:00").toDateString()}</h2>
          {selHol.map((h) => <div key={h.name} className="text-sm text-amber-700">{h.name}{h.states ? ` (${h.states.join(", ")})` : ""}</div>)}
          {selActs.length === 0 && <div className="text-sm text-slate-500">Nothing planned.</div>}
          {selActs.map((a) => <div key={a.id} className="text-sm">{a.start} {a.title}</div>)}
          <div className="flex gap-2">
            <input className="inp" placeholder="Add an activity for this day" value={title} onChange={(e) => setTitle(e.target.value)} />
            <button className="btn" onClick={quickAdd}>Add</button>
          </div>
        </section>
      )}
    </div>
  );
}
