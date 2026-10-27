"use client";
// Phase 6: CSV export and a printable report (use the browser's "Save as PDF" in the print dialog)
import { useStore, money } from "@/lib/store";
import { downloadCsv, itineraryRows, expenseRows } from "@/lib/export";

export default function ExportPage() {
  const { data } = useStore();
  const planned = data.expenses.reduce((s, e) => s + e.planned, 0);
  const actual = data.expenses.reduce((s, e) => s + e.actual, 0);
  const acts = [...data.activities].sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Export</h1>
      <div className="no-print flex flex-wrap gap-2">
        <button className="btn" onClick={() => downloadCsv("itinerary.csv", ["Date","Start","End","Title","Category","Location","Notes"], itineraryRows(data.activities))}>Download itinerary CSV</button>
        <button className="btn" onClick={() => downloadCsv("expenses.csv", ["Item","Category","Planned (RM)","Actual (RM)"], expenseRows(data.expenses))}>Download expenses CSV</button>
        <button className="btn2" onClick={() => window.print()}>Print or save as PDF</button>
      </div>

      {/* Printable report: also lets you check dates, times and totals before exporting */}
      <section className="card space-y-4">
        <h2 className="text-lg font-semibold">{data.trip?.destination ?? "Trip"} {data.trip && `(${data.trip.startDate} to ${data.trip.endDate})`}</h2>
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left"><th>Date</th><th>Time</th><th>Activity</th><th>Category</th></tr></thead>
          <tbody>{acts.map((a) => <tr key={a.id} className="border-b"><td>{a.date}</td><td>{a.start}–{a.end}</td><td>{a.title}</td><td>{a.category}</td></tr>)}</tbody>
        </table>
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left"><th>Expense</th><th>Category</th><th className="text-right">Planned</th><th className="text-right">Actual</th></tr></thead>
          <tbody>
            {data.expenses.map((e) => <tr key={e.id} className="border-b"><td>{e.name}</td><td>{e.category}</td><td className="text-right">{money(e.planned)}</td><td className="text-right">{money(e.actual)}</td></tr>)}
            <tr className="font-semibold"><td colSpan={2}>Total</td><td className="text-right">{money(planned)}</td><td className="text-right">{money(actual)}</td></tr>
          </tbody>
        </table>
        <p className="text-sm">Budget {money(data.trip?.budget ?? 0)} · Remaining {money((data.trip?.budget ?? 0) - actual)}</p>
      </section>
    </div>
  );
}
