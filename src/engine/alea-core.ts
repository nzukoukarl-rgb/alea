import { COUNTRIES, type Country } from "@/lib/sim/countries";
import cultureMap from "@/data/culture_map.json";

export type SexLabel = "f" | "m";
export type CultureRecord = { religions: string[]; racines: string[]; prenoms_f: string[]; prenoms_m: string[]; villes: string[] };

let wasmReady = false;
export async function initWasm(): Promise<void> { wasmReady = true; }
export function isWasmReady(): boolean { return wasmReady; }

function hash(seed: number, salt: number): number {
  let x = (seed ^ salt) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
  return ((x ^ (x >>> 16)) >>> 0) / 0x100000000;
}
function choose<T>(items: readonly T[], seed: number, salt: number): T { return items[Math.floor(hash(seed, salt) * items.length) % items.length]!; }
export function cultureFor(country: string): CultureRecord { return (cultureMap as Record<string, CultureRecord>)[country] ?? cultureMap.default; }
export function countryFor(seed: number): { country: Country; probability: number } {
  const total = COUNTRIES.reduce((sum, c) => sum + Math.max(0, c.births), 0);
  let target = hash(seed, 0x71a2) * total;
  for (const country of COUNTRIES) { target -= country.births; if (target <= 0) return { country, probability: country.births / total * 100 }; }
  const country = COUNTRIES.at(-1)!; return { country, probability: country.births / total * 100 };
}
export function tirage_pays_pondere(seed: number): string { return countryFor(seed).country.name; }
export function tirage_sexe(pays: string, seed = 0): SexLabel { return hash(seed, pays.length * 97) < 0.488 ? "f" : "m"; }
export function tirage_prenom(pays: string, sexe: SexLabel, seed = 0): string { const c = cultureFor(pays); return choose(sexe === "f" ? c.prenoms_f : c.prenoms_m, seed, 0x103); }
export function tirage_revenu(pays: string, seed = 0, gdpPpp = 10000): [number, number] { const q = Math.min(5, Math.floor(hash(seed, pays.length * 31) * 5) + 1); return [q, Math.round(gdpPpp * (0.35 + q * 0.22))]; }
export function calcul_esperance(pays: string, sexe: SexLabel, decile: number, base?: number): number { const record = COUNTRIES.find((c) => c.name === pays); const value = base ?? record?.le ?? 72; return Math.round((value + (sexe === "f" ? 2.5 : -2.5) - (decile < 2 ? 5 : 0)) * 10) / 10; }
export function makeBirthIdentity(seed: number, forcedCountry?: string) {
  const { country: sampledCountry, probability: sampledProbability } = countryFor(seed);
  const country = COUNTRIES.find((item) => item.name === forcedCountry) ?? sampledCountry;
  const probability = forcedCountry ? country.births / COUNTRIES.reduce((sum, item) => sum + item.births, 0) * 100 : sampledProbability;
  const sex = tirage_sexe(country.name, seed + 1);
  const culture = cultureFor(country.name);
  const [incomeQuintile, incomePpp] = tirage_revenu(country.name, seed + 2, country.gdpPpp);
  const city = choose(culture.villes, seed + 3, 0x204);
  const religion = choose(culture.religions, seed + 4, 0x205);
  const roots = choose(culture.racines, seed + 5, 0x206);
  const siblings = Math.floor(hash(seed, 0x207) * 6);
  const parentAge = 22 + Math.floor(hash(seed, 0x208) * 22);
  return { country, probability, sex, name: tirage_prenom(country.name, sex, seed + 6), city, religion, roots, incomeQuintile, incomePpp, siblings, parentAge, lifeExpectancy: calcul_esperance(country.name, sex, 5, country.le) };
}
