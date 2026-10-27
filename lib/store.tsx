"use client";
// Global state kept in React context and mirrored to localStorage (Phase 6)
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AppData } from "./types";

const KEY = "trip-planner-v1";
const empty: AppData = { trip: null, activities: [], expenses: [], transports: [] };
const Ctx = createContext<{ data: AppData; setData: (d: AppData) => void; ready: boolean }>({ data: empty, setData: () => {}, ready: false });

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(empty);
  const [ready, setReady] = useState(false); // avoids SSR/localStorage mismatch

  // Restore saved data once on first load
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setData({ ...empty, ...JSON.parse(raw) }); } catch {}
    setReady(true);
  }, []);
  // Save on every change (only after restore, so we never overwrite with empty data)
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(data)); }, [data, ready]);

  return <Ctx.Provider value={{ data, setData, ready }}>{children}</Ctx.Provider>;
}
export const useStore = () => useContext(Ctx);

// Small helpers for list CRUD
export const uid = () => Math.random().toString(36).slice(2, 10);
export const upsert = <T extends { id: string }>(list: T[], item: T) =>
  list.some((i) => i.id === item.id) ? list.map((i) => (i.id === item.id ? item : i)) : [...list, item];
export const money = (n: number) => "RM " + n.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
