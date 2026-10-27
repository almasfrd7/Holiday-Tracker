// Core data shapes used across the app
export type ActivityCategory = "sightseeing" | "food" | "shopping" | "accommodation";
export type ExpenseCategory = "transport" | "food" | "accommodation" | "activities";
export type TransportMode = "car" | "bus" | "train" | "flight" | "ride-hailing" | "walk";

export interface Trip { destination: string; startDate: string; endDate: string; budget: number; state: string; }
export interface Activity { id: string; title: string; date: string; start: string; end: string; location: string; notes: string; category: ActivityCategory; }
export interface Expense { id: string; name: string; category: ExpenseCategory; planned: number; actual: number; }
export interface Transport {
  id: string; mode: TransportMode; origin: string; destination: string;
  departure: string; fare: number; distanceKm?: number; durationMin?: number;
}
export interface AppData { trip: Trip | null; activities: Activity[]; expenses: Expense[]; transports: Transport[]; }

export const ACTIVITY_CATS: ActivityCategory[] = ["sightseeing", "food", "shopping", "accommodation"];
export const EXPENSE_CATS: ExpenseCategory[] = ["transport", "food", "accommodation", "activities"];
export const MODES: TransportMode[] = ["car", "bus", "train", "flight", "ride-hailing", "walk"];
