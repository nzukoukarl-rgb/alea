#!/usr/bin/env node
/**
 * Real-provider smoke test (Gate 1 proof). Calls the configured provider once, through the same
 * code path as the app, and prints provider, latency and the start of the answer. No key is printed.
 *
 *   GEMINI_API_KEY=... node --experimental-strip-types scripts/smoke-ai.mjs
 *   AI_PROVIDER=groq GROQ_API_KEY=... node --experimental-strip-types scripts/smoke-ai.mjs
 *
 * Exit code 0 only if a real narrative came back.
 */
import { narrateWith, planProviders } from "../src/lib/ai/chain.ts";
import { loadSecrets } from "../src/lib/ai/secrets.server.ts";

const plan = planProviders(loadSecrets());
for (const w of plan.warnings) console.warn("warning:", w);
if (!plan.ready) {
  console.error("NOT READY:", plan.issues.join(" "));
  process.exit(1);
}
console.log(`provider=${plan.primary} model=${plan.providers[0].model} fallbacks=[${plan.fallbacks.join(",")}]`);
const started = Date.now();
const result = await narrateWith(plan.providers, {
  kind: "naissance",
  register: "Naissance en 2026, Cameroun. Santé 62, Lien 70, Savoir 20, Avoir 25. Famille de quatre personnes, ville moyenne.",
  choice: null,
});
const ms = Date.now() - started;
if (!result.ok) {
  console.error(`FAILED after ${ms} ms: ${result.failure}`);
  process.exit(2);
}
console.log(`OK in ${ms} ms via ${result.narrative.provider}`);
console.log(result.narrative.prose.slice(0, 300));
