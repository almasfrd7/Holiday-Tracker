# Trip Planner

Next.js (App Router) + TypeScript + Tailwind app for planning a holiday: itinerary, budget, calendar with Malaysian public holidays, transport, and CSV/PDF export. Data is saved in your browser's localStorage.

## Run
    npm install
    npm run dev      # http://localhost:3000

## Notes
- Public holiday dates in `lib/holidays.ts` are for 2026; lunar/Islamic dates are approximate. Verify them and add other years.
- Road distance uses the free Nominatim and OSRM demo servers (fair use only). Swap in your own routing API for production.
- PDF export uses the browser print dialog (Save as PDF).

## Publish to GitHub
    git init && git add . && git commit -m "Initial commit"
    git branch -M main
    git remote add origin <your-repo-url> && git push -u origin main
