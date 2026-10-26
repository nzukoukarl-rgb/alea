import { SIM_VERSION, WORLD_VERSION } from "./sim/version.ts";

export const MAX_LIVES_PER_USER = 40;
export const MAX_STATE_BYTES = 64 * 1024;
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

export type LifeInput = {
  id: string;
  seed: number | null;
  alive: boolean;
  age: number;
  state: Record<string, unknown>;
  simulationVersion: number;
  worldVersion: number;
};

/** Validate a life sent by the client. Returns an error code (never a message with user data). */
export function validateLifeInput(input: unknown): LifeInput | { error: "shape" | "id" | "size" } {
  if (!input || typeof input !== "object") return { error: "shape" };
  const life = (input as { life?: unknown }).life;
  if (!life || typeof life !== "object" || Array.isArray(life)) return { error: "shape" };
  const l = life as Record<string, unknown>;
  if (typeof l.id !== "string" || !ID_RE.test(l.id)) return { error: "id" };
  if (typeof l.alive !== "boolean") return { error: "shape" };
  if (typeof l.age !== "number" || !Number.isFinite(l.age) || l.age < 0 || l.age > 150) return { error: "shape" };
  const seed = typeof l.seed === "number" && Number.isSafeInteger(l.seed) ? l.seed : null;
  let size = 0;
  try {
    size = JSON.stringify(l).length;
  } catch {
    return { error: "shape" };
  }
  if (size > MAX_STATE_BYTES) return { error: "size" };
  return {
    id: l.id,
    seed,
    alive: l.alive,
    age: Math.round(l.age),
    state: l,
    simulationVersion: SIM_VERSION,
    worldVersion: WORLD_VERSION,
  };
}

export function validateLifeId(input: unknown): string | null {
  const id = input && typeof input === "object" ? (input as { id?: unknown }).id : null;
  return typeof id === "string" && ID_RE.test(id) ? id : null;
}
