import { Activity, Expense } from "./types";

// Wrap a value for CSV: double any quotes and quote the whole cell
const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

// Build a CSV file in the browser and trigger a download.
// The BOM (\uFEFF) makes Excel read UTF-8 correctly.
export function downloadCsv(filename: string, header: string[], rows: (string | number)[][]) {
  const csv = "\uFEFF" + [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export const itineraryRows = (acts: Activity[]) =>
  [...acts].sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))
    .map((a) => [a.date, a.start, a.end, a.title, a.category, a.location, a.notes]);

export const expenseRows = (ex: Expense[]) =>
  ex.map((e) => [e.name, e.category, e.planned.toFixed(2), e.actual.toFixed(2)]);
