import "./globals.css";
import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import { StoreProvider } from "@/lib/store";

export const metadata = { title: "Trip Planner", description: "Plan itinerary, budget and transport" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800">
        <StoreProvider>
          <div className="min-h-screen md:flex">
            <Sidebar />
            <main className="flex-1 p-4 md:p-8">{children}</main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
