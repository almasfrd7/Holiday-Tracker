"use client";
// Phase 2: activities with CRUD, categories, date filter and a chronological daily view
import { useState } from "react";
import { useStore, uid, upsert } from "@/lib/store";
import { Activity, ACTIVITY_CATS } from "@/lib/types";

const blank = (date = ""): Activity => ({ id: "", title: "", date, start: "09:00", end: "10:00", location: "", notes: "", category: "sightseeing" });

export default function Itinerary() {
  const { data, setData } = useStore();
  const [f, setF] = useState<Activity>(blank(data.trip?.startDate));
  const [filter, setFilter] = useState("");
  const [err, setErr] = useState("");

  function save() {
    if (!f.title.trim()) return setErr("Enter a title.");
    if (!f.date) return setErr("Choose a date.");
    if (data.trip && (f.date < data.trip.startDate || f.date > data.trip.endDate)) return setErr("Date is outside the trip dates.");
    if (f.end <= f.start) return setErr("End time must be after start time.");
    setErr("");
    setData({ ...data, activities: upsert(data.activities, { ...f, id: f.id || uid() }) });
    setF(blank(f.date)); // keep the date for quick entry of the next item
  }
  const remove = (id: string) => setData({ ...data, activities: data.activities.filter((a) => a.id !== id) });

  // Filter, sort chronologically, then group by date
  const list = data.activities.filter((a) => !filter || a.date === filter).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  const days = Array.from(new Set(list.map((a) => a.date)));
  const set = (k: keyof Activity, v: string) => setF({ ...f, [k]: v });

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Itinerary</h1>
      <section className="card grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2"><label className="lbl">Title</label><input className="inp" value={f.title} onChange={(e) => set("title", e.target.value)} /></div>
        <div><label className="lbl">Category</label><select className="inp" value={f.category} onChange={(e) => set("category", e.target.value)}>{ACTIVITY_CATS.map((c) => <option key={c}>{c}</option>)}</select></div>
        <div><label className="lbl">Date</label><input className="inp" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} /></div>
        <div><label className="lbl">Start</label><input className="inp" type="time" value={f.start} onChange={(e) => set("start", e.target.value)} /></div>
        <div><label className="lbl">End</label><input className="inp" type="time" value={f.end} onChange={(e) => set("end", e.target.value)} /></div>
        <div className="sm:col-span-3"><label className="lbl">Location</label><input className="inp" value={f.location} onChange={(e) => set("location", e.target.value)} /></div>
        <div className="sm:col-span-3"><label className="lbl">Notes</label><textarea className="inp" rows={2} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></div>
        <div className="flex gap-2 sm:col-span-3">
          <button className="btn" onClick={save}>{f.id ? "Update activity" : "Add activity"}</button>
          {f.id && <button className="btn2" onClick={() => setF(blank(f.date))}>Cancel edit</button>}
          {err && <span className="self-center text-sm text-red-600">{err}</span>}
        </div>
      </section>

      <div className="flex items-center gap-2">
        <label className="text-sm">Filter by date</label>
        <input className="inp w-auto" type="date" value={filter} onChange={(e) => setFilter(e.target.value)} />
        {filter && <button className="btn2" onClick={() => setFilter("")}>Clear</button>}
      </div>

      {days.length === 0 && <p className="text-sm text-slate-500">No activities yet. Add one above.</p>}
      {days.map((d) => (
        <section key={d}>
          <h2 className="mb-2 font-medium">{new Date(d + "T00:00").toDateString()}</h2>
          <ul className="space-y-2">
            {list.filter((a) => a.date === d).map((a) => (
              <li key={a.id} className="card flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500">{a.start}–{a.end} · {a.category}</div>
                  <div className="font-medium">{a.title}</div>
                  {a.location && <div className="text-sm">{a.location}</div>}
                  {a.notes && <div className="text-sm text-slate-500">{a.notes}</div>}
                </div>
                <div className="flex gap-1">
                  <button className="btn2" onClick={() => setF(a)}>Edit</button>
                  <button className="btn2" onClick={() => remove(a.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
