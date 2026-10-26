import { COUNTRIES } from "@/lib/sim/countries";

export type RealtimeData = { pib: number; esperance: number; gini: number; inflation: number; updatedAt: string; source: string; degraded?: boolean };
const TTL = 60 * 60 * 1000;
const cache = new Map<string, { expires: number; value: RealtimeData }>();
const FALLBACKS: Record<string, RealtimeData> = {
  Algeria: { pib: 13200, esperance: 76.4, gini: 27.6, inflation: 4.1, updatedAt: new Date().toISOString(), source: "fallback local", degraded: true },
  Brazil: { pib: 17800, esperance: 75.5, gini: 52, inflation: 4.8, updatedAt: new Date().toISOString(), source: "fallback local", degraded: true },
  France: { pib: 54800, esperance: 82.5, gini: 31.5, inflation: 2.4, updatedAt: new Date().toISOString(), source: "fallback local", degraded: true },
};
const ISO3: Record<string, string> = { Algeria: "DZA", Brazil: "BRA", France: "FRA", India: "IND", Japan: "JPN", Mexico: "MEX", Senegal: "SEN", Philippines: "PHL" };
function number(value: unknown, fallback: number) { const n = Number(value); return Number.isFinite(n) ? n : fallback; }
async function timedFetch(url: string, ms = 7000): Promise<Response> {
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), ms);
  try { return await fetch(url, { signal: controller.signal, headers: { accept: "application/json,text/csv" } }); } finally { clearTimeout(timer); }
}
async function worldBank(country: string): Promise<Partial<RealtimeData>> {
  const code = ISO3[country] ?? COUNTRIES.find((item) => item.name === country)?.iso.toUpperCase() ?? country.toUpperCase().slice(0, 3);
  const [gdp, le] = await Promise.all([
    timedFetch(`https://api.worldbank.org/v2/country/${encodeURIComponent(code)}/indicator/NY.GDP.PCAP.PP.CD?format=json&per_page=5`),
    timedFetch(`https://api.worldbank.org/v2/country/${encodeURIComponent(code)}/indicator/SP.DYN.LE00.IN?format=json&per_page=5`),
  ]);
  if (!gdp.ok || !le.ok) throw new Error("world-bank-unavailable");
  const gdpJson = await gdp.json() as [unknown, Array<{ value?: number | null; date?: string }>];
  const leJson = await le.json() as [unknown, Array<{ value?: number | null; date?: string }>];
  const latest = (rows: Array<{ value?: number | null; date?: string }>) => rows.find((r) => r.value != null);
  return { pib: number(latest(gdpJson[1] ?? [])?.value, FALLBACKS[country]?.pib ?? 10000), esperance: number(latest(leJson[1] ?? [])?.value, FALLBACKS[country]?.esperance ?? 72) };
}
async function owid(country: string): Promise<Partial<RealtimeData>> {
  const url = `https://ourworldindata.org/grapher/gini-coefficient-wb.csv?csvType=filtered&country=${encodeURIComponent(country)}`;
  const response = await timedFetch(url);
  if (!response.ok) throw new Error("owid-unavailable");
  const rows = (await response.text()).trim().split("\n").slice(1).map((row) => row.split(","));
  const matching = rows.filter((row) => row[0]?.toLowerCase() === country.toLowerCase());
  const row = matching.at(-1) ?? rows.at(-1);
  const value = Number(row?.[3] ?? row?.at(-1));
  return { gini: Number.isFinite(value) ? value * (value <= 1 ? 100 : 1) : FALLBACKS[country]?.gini ?? 35 };
}
export async function getRealtimeData(country: string): Promise<RealtimeData> {
  const normalized = country.trim();
  if (!normalized || !/^[\p{L} .'-]{2,60}$/u.test(normalized)) throw new Error("invalid-country");
  const cached = cache.get(normalized); if (cached && cached.expires > Date.now()) return cached.value;
  const fallback = FALLBACKS[normalized];
  if (!fallback && !ISO3[normalized] && !COUNTRIES.some((item) => item.name === normalized)) throw new Error("unknown-country");
  const [wb, gini] = await Promise.allSettled([worldBank(normalized), owid(normalized)]);
  const base = fallback ?? { pib: 10000, esperance: 72, gini: 35, inflation: 4, updatedAt: new Date().toISOString(), source: "sources externes" };
  const value: RealtimeData = { ...base, ...wb.status === "fulfilled" ? wb.value : {}, ...gini.status === "fulfilled" ? gini.value : {}, updatedAt: new Date().toISOString(), source: "World Bank + OWID", degraded: wb.status === "rejected" || gini.status === "rejected" };
  cache.set(normalized, { expires: Date.now() + TTL, value });
  return value;
}
export function clearRealtimeCache() { cache.clear(); }
export const realtimeCacheTtlMs = TTL;
