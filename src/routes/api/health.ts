import { createFileRoute } from "@tanstack/react-router";

/** Liveness + readiness. Reports booleans and provider names only, never keys or connection strings. */
export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        let db: "ok" | "error" = "ok";
        try {
          const { getSql } = await import("@/lib/db");
          const sql = await getSql();
          await sql`select 1 as ok`;
        } catch {
          db = "error";
        }
        const { loadSecrets } = await import("@/lib/ai/secrets.server");
        const { planProviders } = await import("@/lib/ai/chain");
        const plan = planProviders(loadSecrets());
        const ok = db === "ok" && plan.ready;
        return Response.json(
          { status: ok ? "ok" : "degraded", db, ai: { provider: plan.primary, fallbacks: plan.fallbacks, ready: plan.ready } },
          { status: ok ? 200 : 503, headers: { "cache-control": "no-store" } },
        );
      },
    },
  },
});
