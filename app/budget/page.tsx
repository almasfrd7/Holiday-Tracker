"use client";
// Phase 3: expenses with planned vs actual, totals, per-category bars and overrun warnings
import { useState } from "react";
import { useStore, uid, upsert, money } from "@/lib/store";
import { Expense, EXPENSE_CATS } from "@/lib/types";

const blank: Expense = { id: "", name: "", category: "food", planned: 0, actual: 0 };

export default function Budget() {
  const { data, setData } = useStore();
  const [f, setF] = useState<Expense>(blank);
  const [err, setErr] = useState("");
  const budget = data.trip?.budget ?? 0;

  function save() {
    if (!f.name.trim()) return setErr("Enter a name.");
    if (!(f.planned >= 0) || !(f.actual >= 0)) return setErr("Amounts must be zero or more.");
    setErr(""); setData({ ...data, expenses: upsert(data.expenses, { ...f, id: f.id || uid() }) }); setF(blank);
  }

  // Totals (Phase 3 calculations)
  const planned = data.expenses.reduce((s, e) => s + e.planned, 0);
  const actual = data.expenses.reduce((s, e) => s + e.actual, 0);
  const remaining = budget - actual;
  const byCat = EXPENSE_CATS.map((c) => ({ c, total: data.expenses.filter((e) => e.category === c).reduce((s, e) => s + e.actual, 0) }));
  const max = Math.max(1, ...byCat.map((x) => x.total));

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Budget</h1>
      {!data.trip && <p className="text-sm text-amber-700">Set a trip budget on the Dashboard first.</p>}

      <section className="grid gap-3 sm:grid-cols-4">
        {[["Budget", budget], ["Planned", planned], ["Spent", actual], ["Remaining", remaining]].map(([k, v]) => (
          <div key={k as string} className={`card ${k === "Remaining" && remaining < 0 ? "border-red-400 bg-red-50" : ""}`}>
            <div className="text-xs text-slate-500">{k}</div><div className="font-semibold">{money(v as number)}</div>
          </div>
        ))}
      </section>
      {(actual > budget || planned > budget) && budget > 0 && (
        <p className="rounded bg-red-50 p-3 text-sm text-red-700">
          {actual > budget ? `Spending is over budget by ${money(actual - budget)}.` : `Planned costs exceed the budget by ${money(planned - budget)}.`}
        </p>
      )}

      <section className="card grid gap-3 sm:grid-cols-4">
        <div className="sm:col-span-2"><label className="lbl">Item</label><input className="inp" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className="lbl">Category</label><select className="inp" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as Expense["category"] })}>{EXPENSE_CATS.map((c) => <option key={c}>{c}</option>)}</select></div>
        <div className="sm:col-span-2"><label className="lbl">Planned (RM)</label><input className="inp" type="number" min={0} value={f.planned} onChange={(e) => setF({ ...f, planned: Number(e.target.value) })} /></div>
        <div className="sm:col-span-2"><label className="lbl">Actual (RM)</label><input className="inp" type="number" min={0} value={f.actual} onChange={(e) => setF({ ...f, actual: Number(e.target.value) })} /></div>
        <div className="flex gap-2 sm:col-span-4">
          <button className="btn" onClick={save}>{f.id ? "Update expense" : "Add expense"}</button>
          {f.id && <button className="btn2" onClick={() => setF(blank)}>Cancel edit</button>}
          {err && <span className="self-center text-sm text-red-600">{err}</span>}
        </div>
      </section>

      <section className="card space-y-2">
        <h2 className="font-medium">Spending by category</h2>
        {byCat.map(({ c, total }) => (
          <div key={c} className="text-sm">
            <div className="flex justify-between"><span>{c}</span><span>{money(total)}</span></div>
            <div className="h-2 rounded bg-slate-100"><div className="h-2 rounded bg-teal-600" style={{ width: `${(total / max) * 100}%` }} /></div>
          </div>
        ))}
      </section>

      <ul className="space-y-2">
        {data.expenses.length === 0 && <p className="text-sm text-slate-500">No expenses yet.</p>}
        {data.expenses.map((e) => (
          <li key={e.id} className={`card flex items-center justify-between ${e.actual > e.planned && e.planned > 0 ? "border-red-300" : ""}`}>
            <div>
              <div className="font-medium">{e.name} <span className="text-sm font-normal text-slate-500">({e.category})</span></div>
              <div className="text-sm">Planned {money(e.planned)} · Actual {money(e.actual)}{e.actual > e.planned && e.planned > 0 && <span className="text-red-600"> · over by {money(e.actual - e.planned)}</span>}</div>
            </div>
            <div className="flex gap-1">
              <button className="btn2" onClick={() => setF(e)}>Edit</button>
              <button className="btn2" onClick={() => setData({ ...data, expenses: data.expenses.filter((x) => x.id !== e.id) })}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
