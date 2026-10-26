import { makeBirthIdentity } from "@/engine/alea-core";
import { getRealtimeData, type RealtimeData } from "@/lib/realtime";
import { newLifeWithProfile, type BirthProfile, type LifeState, type Pace } from "@/lib/sim/engine";

export async function fetchRealtimeSnapshot(country: string): Promise<RealtimeData> {
  if (typeof window === "undefined") return getRealtimeData(country);
  const response = await fetch(`/api/realtime?country=${encodeURIComponent(country)}`);
  if (!response.ok) throw new Error(`realtime-${response.status}`);
  return response.json() as Promise<RealtimeData>;
}

export async function createBirthProfile(seed: number, wasmCountry?: string): Promise<BirthProfile> {
  const identity = makeBirthIdentity(seed, wasmCountry);
  const real = await fetchRealtimeSnapshot(identity.country.name);
  return { ...identity, realtime: real, datasetVersion: "wpp-2024-culture-v1" };
}

export async function createLifeFromProfile(profile: BirthProfile, seed: number, pace: Pace, edu: boolean): Promise<LifeState> {
  return newLifeWithProfile(seed, pace, edu, profile);
}
