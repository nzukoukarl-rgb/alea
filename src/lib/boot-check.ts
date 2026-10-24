import { planProviders, type AiEnv } from "./ai/chain.ts";

/**
 * Fatal start-up problems for a production server. Returns messages only (no values, no keys).
 * Outside production it returns nothing, so local development keeps working with PGLite and no keys.
 */
export function bootProblems(env: Record<string, string | undefined>, ai: AiEnv): string[] {
  if (env.NODE_ENV !== "production") return [];
  const out: string[] = [];
  if (!env.DATABASE_URL?.trim()) {
    out.push("DATABASE_URL is required in production (a real Postgres database; PGLite is for local development only).");
  }
  const secret = env.BETTER_AUTH_SECRET?.trim();
  if (!secret || secret.length < 32) {
    out.push("BETTER_AUTH_SECRET is required in production and must be at least 32 characters (openssl rand -hex 32).");
  }
  if (env.ALLOW_START_WITHOUT_AI !== "1") {
    const plan = planProviders(ai);
    if (!plan.ready) out.push(...plan.issues, "Set the key, or ALLOW_START_WITHOUT_AI=1 to start without the AI voice.");
  }
  return out;
}
