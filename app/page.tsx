"use client";
// Dashboard: create/edit the trip and see a summary
import { useState, useEffect } from "react";
import { useStore, money } from "@/lib/store";
import { Trip } from "@/lib/types";
import { STATES } from "@/lib/holidays";

export default function Dashboard() {
  const { data, setData, ready } = useStore();
  const [f, setF] = useState<Trip>({ destination: "", startDate: "", endDate: "", budget: 0, state: "" });
  const [err, setErr] = useState("");

  // Load the saved trip into the form
  useEffect(() => { if (data.trip) setF(data.trip); }, [data.trip]);

  function save() {
    // Validation (Phase 7)
    if (!f.destination.trim()) return setErr("Enter a destination.");
    if (!f.startDate || !f.endDate) return setErr("Choose start and end dates.");
    if (f.endDate < f.startDate) return setErr("End date must not be before start date.");
    if (!(f.budget >= 0)) return setErr("Budget must be zero or more.");
    setErr(""); setData({ ...data, trip: f });
  }

  if (!ready) return null;
  const planned = data.expenses.reduce((s, e) => s + e.planned, 0);
  const actual = data.expenses.reduce((s, e) => s + e.actual, 0);
  const set = (k: keyof Trip, v: string | number) => setF({ ...f, [k]: v });

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">{data.trip ? data.trip.destination : "Plan your trip"}</h1>
      <section className="card grid gap-3 sm:grid-cols-2">
        <div><label className="lbl">Destination</label><input className="inp" value={f.destination} onChange={(e) => set("destination", e.target.value)} /></div>
        <div><label className="lbl">Budget (RM)</label><input className="inp" type="number" min={0} value={f.budget} onChange={(e) => set("budget", Number(e.target.value))} /></div>
        <div><label className="lbl">Start date</label><input className="inp" type="date" value={f.startDate} onChange={(e) => set("startDate", e.target.value)} /></div>
        <div><label className="lbl">End date</label><input className="inp" type="date" value={f.endDate} onChange={(e) => set("endDate", e.target.value)} /></div>
        <div><label className="lbl">State (for public holidays)</label>
          <select className="inp" value={f.state} onChange={(e) => set("state", e.target.value)}>
            <option value="">All states</option>{STATES.map((s) => <option key={s}>{s}</option>)}
          </select></div>
        <div className="flex items-end"><button className="btn" onClick={save}>Save trip</button></div>
        {err && <p className="text-sm text-red-600 sm:col-span-2">{err}</p>}
      </section>

      {data.trip ? (
        <section className="grid gap-3 sm:grid-cols-4">
          {[["Activities", data.activities.length], ["Budget", money(data.trip.budget)], ["Planned", money(planned)], ["Spent", money(actual)]].map(([k, v]) => (
            <div key={k} className="card"><div className="text-xs text-slate-500">{k}</div><div className="text-lg font-semibold">{v}</div></div>
          ))}
        </section>
      ) : <p className="text-sm text-slate-500">Save a trip to start adding activities and expenses.</p>}
    </div>
  );
}
