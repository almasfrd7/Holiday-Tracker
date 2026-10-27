"use client";
// Phase 5: transport records, distance/duration via free OSM services, and a Google Maps link
import { useState } from "react";
import { useStore, uid, upsert, money } from "@/lib/store";
import { Transport, MODES } from "@/lib/types";

const blank: Transport = { id: "", mode: "car", origin: "", destination: "", departure: "", fare: 0 };

// Convert a place name to coordinates using Nominatim (OpenStreetMap)
async function geocode(q: string): Promise<[number, number]> {
  const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`);
  const j = await r.json();
  if (!j[0]) throw new Error(`Could not find "${q}"`);
  return [Number(j[0].lon), Number(j[0].lat)];
}

export default function TransportPage() {
  const { data, setData } = useStore();
  const [f, setF] = useState<Transport>(blank);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  // Ask the OSRM demo server for the real road distance and duration
  async function route() {
    if (!f.origin.trim() || !f.destination.trim()) return setErr("Enter origin and destination first.");
    setBusy(true); setErr("");
    try {
      const [a, b] = await Promise.all([geocode(f.origin), geocode(f.destination)]);
      const r = await fetch(`https://router.project-osrm.org/route/v1/driving/${a.join(",")};${b.join(",")}?overview=false`);
      const j = await r.json();
      const leg = j.routes?.[0];
      if (!leg) throw new Error("No road route found.");
      setF({ ...f, distanceKm: Math.round(leg.distance / 100) / 10, durationMin: Math.round(leg.duration / 60) });
    } catch (e: any) { setErr(e.message || "Routing failed. Try again later."); }
    setBusy(false);
  }

  function save() {
    if (!f.origin.trim() || !f.destination.trim()) return setErr("Enter origin and destination.");
    if (!(f.fare >= 0)) return setErr("Fare must be zero or more.");
    setErr(""); setData({ ...data, transports: upsert(data.transports, { ...f, id: f.id || uid() }) }); setF(blank);
  }

  // External navigation link (works without any API key)
  const navUrl = (t: Transport) => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(t.origin)}&destination=${encodeURIComponent(t.destination)}`;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Transport</h1>
      <section className="card grid gap-3 sm:grid-cols-2">
        <div><label className="lbl">Mode</label><select className="inp" value={f.mode} onChange={(e) => setF({ ...f, mode: e.target.value as Transport["mode"] })}>{MODES.map((m) => <option key={m}>{m}</option>)}</select></div>
        <div><label className="lbl">Departure</label><input className="inp" type="datetime-local" value={f.departure} onChange={(e) => setF({ ...f, departure: e.target.value })} /></div>
        <div><label className="lbl">Origin</label><input className="inp" value={f.origin} onChange={(e) => setF({ ...f, origin: e.target.value })} /></div>
        <div><label className="lbl">Destination</label><input className="inp" value={f.destination} onChange={(e) => setF({ ...f, destination: e.target.value })} /></div>
        <div><label className="lbl">Estimated fare (RM)</label><input className="inp" type="number" min={0} value={f.fare} onChange={(e) => setF({ ...f, fare: Number(e.target.value) })} /></div>
        <div className="flex items-end gap-2">
          <button className="btn2" onClick={route} disabled={busy}>{busy ? "Calculating..." : "Get road distance"}</button>
        </div>
        {f.distanceKm !== undefined && <p className="text-sm sm:col-span-2">Road distance {f.distanceKm} km · about {f.durationMin} min driving</p>}
        <div className="flex gap-2 sm:col-span-2">
          <button className="btn" onClick={save}>{f.id ? "Update transport" : "Add transport"}</button>
          {f.id && <button className="btn2" onClick={() => setF(blank)}>Cancel edit</button>}
          {err && <span className="self-center text-sm text-red-600">{err}</span>}
        </div>
      </section>

      <ul className="space-y-2">
        {data.transports.length === 0 && <p className="text-sm text-slate-500">No transport added yet.</p>}
        {data.transports.map((t) => (
          <li key={t.id} className="card flex items-start justify-between gap-3">
            <div className="text-sm">
              <div className="font-medium">{t.origin} to {t.destination}</div>
              <div className="text-slate-500">{t.mode}{t.departure && ` · ${t.departure.replace("T", " ")}`} · {money(t.fare)}</div>
              {t.distanceKm !== undefined && <div className="text-slate-500">{t.distanceKm} km · {t.durationMin} min</div>}
              <a className="text-teal-700 underline" href={navUrl(t)} target="_blank" rel="noreferrer">Open in Google Maps</a>
            </div>
            <div className="flex gap-1">
              <button className="btn2" onClick={() => setF(t)}>Edit</button>
              <button className="btn2" onClick={() => setData({ ...data, transports: data.transports.filter((x) => x.id !== t.id) })}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
