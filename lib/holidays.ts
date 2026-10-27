// Malaysian public holidays for 2026. Islamic/lunar dates are approximate and
// are officially confirmed late in the year, so verify against gov.my before travelling.
// `states` omitted = nationwide; otherwise only those states observe it.
export interface Holiday { date: string; name: string; states?: string[]; }
export const STATES = ["Johor","Kedah","Kelantan","Melaka","Negeri Sembilan","Pahang","Perak","Perlis","Penang","Sabah","Sarawak","Selangor","Terengganu","Kuala Lumpur","Putrajaya","Labuan"];

export const HOLIDAYS: Holiday[] = [
  { date: "2026-01-01", name: "New Year's Day", states: ["Johor","Melaka","Negeri Sembilan","Pahang","Penang","Perak","Sabah","Sarawak","Selangor","Kuala Lumpur","Putrajaya","Labuan"] },
  { date: "2026-02-01", name: "Federal Territory Day", states: ["Kuala Lumpur","Putrajaya","Labuan"] },
  { date: "2026-02-17", name: "Chinese New Year" },
  { date: "2026-02-18", name: "Chinese New Year (day 2)" },
  { date: "2026-03-21", name: "Hari Raya Aidilfitri (approx.)" },
  { date: "2026-03-22", name: "Hari Raya Aidilfitri (day 2, approx.)" },
  { date: "2026-05-01", name: "Labour Day" },
  { date: "2026-05-27", name: "Hari Raya Aidiladha (approx.)" },
  { date: "2026-05-31", name: "Wesak Day" },
  { date: "2026-06-01", name: "Agong's Birthday" },
  { date: "2026-06-17", name: "Awal Muharram (approx.)" },
  { date: "2026-07-11", name: "Penang Governor's Birthday", states: ["Penang"] },
  { date: "2026-08-25", name: "Maulidur Rasul (approx.)" },
  { date: "2026-08-31", name: "Merdeka Day" },
  { date: "2026-09-16", name: "Malaysia Day" },
  { date: "2026-11-08", name: "Deepavali (approx.)" },
  { date: "2026-12-11", name: "Sultan of Selangor's Birthday", states: ["Selangor","Kuala Lumpur"] },
  { date: "2026-12-25", name: "Christmas Day" },
];

// Holidays on a date that apply to the chosen state (state "" = show all)
export const holidaysOn = (date: string, state: string) =>
  HOLIDAYS.filter((h) => h.date === date && (!h.states || !state || h.states.includes(state)));
