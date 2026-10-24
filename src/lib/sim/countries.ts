export type Country = {
  iso: string;
  name: string;
  region: string;
  births: number;
  le: number;
  u5: number;
  gini: number;
  gdpPpp: number;
  school: number;
  fragility: number;
  lat: number;
  lon: number;
};

/** Ordres de grandeur autour de 2023, naissances en milliers. ONU, OMS, Banque mondiale. */
export const COUNTRIES: Country[] = [
  { iso: "in", name: "Inde", region: "sa", births: 23200, le: 72.0, u5: 28.0, gini: 32.8, gdpPpp: 10160, school: 11.9, fragility: 0, lat: 22.0, lon: 79.0 },
  { iso: "cn", name: "Chine", region: "ea", births: 9020, le: 78.0, u5: 7.0, gini: 37.1, gdpPpp: 24380, school: 14.0, fragility: 0, lat: 35.0, lon: 104.0 },
  { iso: "ng", name: "Nigéria", region: "wa", births: 7540, le: 54.5, u5: 107.0, gini: 35.1, gdpPpp: 6210, school: 8.0, fragility: 1, lat: 9.0, lon: 8.0 },
  { iso: "pk", name: "Pakistan", region: "sa", births: 6500, le: 67.6, u5: 61.0, gini: 29.6, gdpPpp: 6780, school: 8.5, fragility: 1, lat: 30.0, lon: 69.0 },
  { iso: "id", name: "Indonésie", region: "sea", births: 4450, le: 71.1, u5: 21.0, gini: 37.9, gdpPpp: 15420, school: 12.5, fragility: 0, lat: -2.0, lon: 118.0 },
  { iso: "cd", name: "République démocratique du Congo", region: "af", births: 4100, le: 61.0, u5: 75.0, gini: 42.1, gdpPpp: 1550, school: 7.0, fragility: 2, lat: -2.0, lon: 23.0 },
  { iso: "et", name: "Éthiopie", region: "af", births: 3800, le: 66.6, u5: 47.0, gini: 35.0, gdpPpp: 3200, school: 8.0, fragility: 1, lat: 9.0, lon: 39.0 },
  { iso: "us", name: "États-Unis", region: "na", births: 3660, le: 78.4, u5: 6.0, gini: 41.5, gdpPpp: 82770, school: 16.0, fragility: 0, lat: 39.0, lon: -98.0 },
  { iso: "bd", name: "Bangladesh", region: "sa", births: 3100, le: 74.7, u5: 29.0, gini: 31.8, gdpPpp: 8960, school: 11.0, fragility: 0, lat: 24.0, lon: 90.0 },
  { iso: "br", name: "Brésil", region: "latam", births: 2750, le: 75.5, u5: 14.0, gini: 52.0, gdpPpp: 20690, school: 12.0, fragility: 0, lat: -10.0, lon: -52.0 },
  { iso: "eg", name: "Égypte", region: "mena", births: 2400, le: 70.2, u5: 18.0, gini: 31.9, gdpPpp: 17600, school: 12.0, fragility: 0, lat: 26.0, lon: 30.0 },
  { iso: "tz", name: "Tanzanie", region: "af", births: 2300, le: 67.0, u5: 40.0, gini: 40.5, gdpPpp: 3800, school: 8.0, fragility: 0, lat: -6.0, lon: 35.0 },
  { iso: "mx", name: "Mexique", region: "latam", births: 1900, le: 75.0, u5: 13.0, gini: 43.5, gdpPpp: 24670, school: 12.0, fragility: 0, lat: 23.0, lon: -102.0 },
  { iso: "ph", name: "Philippines", region: "sea", births: 1750, le: 72.2, u5: 26.0, gini: 40.7, gdpPpp: 11600, school: 12.0, fragility: 0, lat: 12.0, lon: 122.0 },
  { iso: "ug", name: "Ouganda", region: "af", births: 1650, le: 66.7, u5: 42.0, gini: 42.7, gdpPpp: 3300, school: 8.0, fragility: 0, lat: 1.0, lon: 32.0 },
  { iso: "sd", name: "Soudan", region: "mena", births: 1550, le: 65.6, u5: 54.0, gini: 34.2, gdpPpp: 2800, school: 7.5, fragility: 3, lat: 15.0, lon: 30.0 },
  { iso: "ke", name: "Kenya", region: "af", births: 1500, le: 63.6, u5: 41.0, gini: 38.7, gdpPpp: 6800, school: 10.0, fragility: 0, lat: 0.5, lon: 38.0 },
  { iso: "af", name: "Afghanistan", region: "sa", births: 1400, le: 64.0, u5: 55.0, gini: 31.0, gdpPpp: 2100, school: 6.5, fragility: 3, lat: 33.0, lon: 66.0 },
  { iso: "vn", name: "Viêt Nam", region: "sea", births: 1400, le: 74.6, u5: 20.0, gini: 36.1, gdpPpp: 14900, school: 12.5, fragility: 0, lat: 16.0, lon: 108.0 },
  { iso: "ao", name: "Angola", region: "af", births: 1300, le: 64.0, u5: 69.0, gini: 51.3, gdpPpp: 7800, school: 7.0, fragility: 0, lat: -12.0, lon: 18.0 },
  { iso: "ru", name: "Russie", region: "eu", births: 1260, le: 73.0, u5: 5.0, gini: 36.0, gdpPpp: 41700, school: 14.0, fragility: 0, lat: 60.0, lon: 90.0 },
  { iso: "mz", name: "Mozambique", region: "af", births: 1200, le: 60.9, u5: 68.0, gini: 50.5, gdpPpp: 1600, school: 6.5, fragility: 1, lat: -18.0, lon: 35.0 },
  { iso: "ne", name: "Niger", region: "wa", births: 1100, le: 62.0, u5: 110.0, gini: 37.3, gdpPpp: 1700, school: 5.5, fragility: 1, lat: 17.0, lon: 9.0 },
  { iso: "iq", name: "Irak", region: "mena", births: 1100, le: 72.0, u5: 23.0, gini: 29.5, gdpPpp: 12900, school: 10.0, fragility: 2, lat: 33.0, lon: 44.0 },
  { iso: "za", name: "Afrique du Sud", region: "af", births: 1100, le: 66.1, u5: 33.0, gini: 63.0, gdpPpp: 15900, school: 12.0, fragility: 0, lat: -29.0, lon: 24.0 },
  { iso: "ir", name: "Iran", region: "mena", births: 1050, le: 75.0, u5: 13.0, gini: 40.9, gdpPpp: 18200, school: 12.5, fragility: 0, lat: 32.0, lon: 53.0 },
  { iso: "ci", name: "Côte d'Ivoire", region: "wa", births: 950, le: 61.0, u5: 72.0, gini: 37.2, gdpPpp: 6800, school: 8.0, fragility: 0, lat: 7.0, lon: -5.0 },
  { iso: "tr", name: "Turquie", region: "mena", births: 950, le: 78.5, u5: 9.0, gini: 41.9, gdpPpp: 41900, school: 13.0, fragility: 0, lat: 39.0, lon: 35.0 },
  { iso: "cm", name: "Cameroun", region: "af", births: 900, le: 63.0, u5: 70.0, gini: 46.6, gdpPpp: 4800, school: 9.0, fragility: 1, lat: 5.0, lon: 12.0 },
  { iso: "gh", name: "Ghana", region: "wa", births: 900, le: 65.5, u5: 42.0, gini: 43.5, gdpPpp: 7200, school: 10.0, fragility: 0, lat: 8.0, lon: -1.0 },
  { iso: "ye", name: "Yémen", region: "mena", births: 900, le: 66.0, u5: 55.0, gini: 36.7, gdpPpp: 1800, school: 7.0, fragility: 3, lat: 15.0, lon: 48.0 },
  { iso: "mm", name: "Myanmar", region: "sea", births: 900, le: 67.0, u5: 40.0, gini: 30.7, gdpPpp: 5300, school: 9.0, fragility: 2, lat: 21.0, lon: 96.0 },
  { iso: "dz", name: "Algérie", region: "mena", births: 900, le: 76.5, u5: 22.0, gini: 27.6, gdpPpp: 15700, school: 12.0, fragility: 0, lat: 28.0, lon: 2.0 },
  { iso: "mg", name: "Madagascar", region: "af", births: 850, le: 66.0, u5: 66.0, gini: 42.6, gdpPpp: 1900, school: 7.0, fragility: 0, lat: -19.0, lon: 47.0 },
  { iso: "ml", name: "Mali", region: "wa", births: 850, le: 60.5, u5: 90.0, gini: 36.1, gdpPpp: 2600, school: 6.0, fragility: 2, lat: 17.0, lon: -2.0 },
  { iso: "bf", name: "Burkina Faso", region: "wa", births: 800, le: 61.0, u5: 82.0, gini: 37.4, gdpPpp: 2700, school: 6.5, fragility: 2, lat: 12.0, lon: -1.0 },
  { iso: "jp", name: "Japon", region: "ea", births: 730, le: 84.0, u5: 2.0, gini: 32.9, gdpPpp: 52000, school: 15.0, fragility: 0, lat: 36.0, lon: 138.0 },
  { iso: "de", name: "Allemagne", region: "eu", births: 690, le: 81.2, u5: 4.0, gini: 31.7, gdpPpp: 69000, school: 15.0, fragility: 0, lat: 51.0, lon: 10.0 },
  { iso: "fr", name: "France", region: "eu", births: 680, le: 82.5, u5: 4.0, gini: 31.5, gdpPpp: 60300, school: 15.5, fragility: 0, lat: 46.0, lon: 2.0 },
  { iso: "gb", name: "Royaume-Uni", region: "eu", births: 670, le: 81.0, u5: 4.0, gini: 32.6, gdpPpp: 58900, school: 15.0, fragility: 0, lat: 54.0, lon: -2.0 },
  { iso: "ma", name: "Maroc", region: "mena", births: 650, le: 75.0, u5: 17.0, gini: 39.5, gdpPpp: 9800, school: 11.0, fragility: 0, lat: 32.0, lon: -6.0 },
  { iso: "co", name: "Colombie", region: "latam", births: 650, le: 77.2, u5: 12.0, gini: 54.2, gdpPpp: 20900, school: 12.5, fragility: 0, lat: 4.0, lon: -72.0 },
  { iso: "np", name: "Népal", region: "sa", births: 560, le: 70.5, u5: 28.0, gini: 30.0, gdpPpp: 5000, school: 10.0, fragility: 0, lat: 28.0, lon: 84.0 },
  { iso: "sa", name: "Arabie saoudite", region: "mena", births: 550, le: 77.9, u5: 7.0, gini: 35.0, gdpPpp: 61000, school: 13.0, fragility: 0, lat: 24.0, lon: 45.0 },
  { iso: "sn", name: "Sénégal", region: "wa", births: 550, le: 68.5, u5: 37.0, gini: 36.2, gdpPpp: 4500, school: 8.0, fragility: 0, lat: 14.0, lon: -14.0 },
  { iso: "ar", name: "Argentine", region: "latam", births: 520, le: 77.0, u5: 9.0, gini: 42.0, gdpPpp: 29900, school: 14.0, fragility: 0, lat: -34.0, lon: -64.0 },
  { iso: "pe", name: "Pérou", region: "latam", births: 520, le: 77.0, u5: 14.0, gini: 40.2, gdpPpp: 16300, school: 12.0, fragility: 0, lat: -9.0, lon: -75.0 },
  { iso: "th", name: "Thaïlande", region: "sea", births: 500, le: 79.7, u5: 8.0, gini: 34.9, gdpPpp: 22600, school: 13.5, fragility: 0, lat: 15.0, lon: 101.0 },
  { iso: "it", name: "Italie", region: "eu", births: 390, le: 83.0, u5: 3.0, gini: 34.8, gdpPpp: 58300, school: 14.5, fragility: 0, lat: 43.0, lon: 12.0 },
  { iso: "ca", name: "Canada", region: "na", births: 360, le: 82.0, u5: 5.0, gini: 31.7, gdpPpp: 62000, school: 16.0, fragility: 0, lat: 56.0, lon: -96.0 },
  { iso: "es", name: "Espagne", region: "eu", births: 330, le: 83.5, u5: 3.0, gini: 33.9, gdpPpp: 52000, school: 15.0, fragility: 0, lat: 40.0, lon: -4.0 },
  { iso: "au", name: "Australie", region: "oc", births: 300, le: 83.2, u5: 4.0, gini: 34.3, gdpPpp: 68000, school: 16.0, fragility: 0, lat: -25.0, lon: 134.0 },
  { iso: "ua", name: "Ukraine", region: "eu", births: 280, le: 73.0, u5: 8.0, gini: 25.6, gdpPpp: 18000, school: 13.0, fragility: 2, lat: 49.0, lon: 31.0 },
  { iso: "pl", name: "Pologne", region: "eu", births: 270, le: 78.5, u5: 4.0, gini: 28.8, gdpPpp: 49000, school: 15.0, fragility: 0, lat: 52.0, lon: 20.0 },
  { iso: "kr", name: "Corée du Sud", region: "ea", births: 230, le: 83.5, u5: 3.0, gini: 31.4, gdpPpp: 56000, school: 16.0, fragility: 0, lat: 36.0, lon: 128.0 },
];

export function byIso(iso: string): Country | undefined {
  const key = iso.trim().toLowerCase();
  return COUNTRIES.find((c) => c.iso === key);
}

export function totalBirths(): number {
  return COUNTRIES.reduce((s, c) => s + c.births, 0);
}
