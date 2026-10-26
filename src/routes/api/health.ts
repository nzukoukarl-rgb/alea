import { createFileRoute } from "@tanstack/react-router";

/** Liveness + readiness. Reports booleans and provider names only, never keys or connection strings. */
export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        let db: "ok" | "error" = "ok";
        let schema: "ok" | "outdated" | "unknown" = "unknown";
        try {
          const { getSql } = await import("@/lib/db");
          const { EXPECTED_MIGRATIONS } = await import("@/lib/schema-version");
          const sql = await getSql();
          await sql`select 1 as ok`;
          try {
            const rows = await sql<{ name: string }>`select name from _migrations`;
            const applied = new Set(rows.map((r) => r.name));
            schema = EXPECTED_MIGRATIONS.every((m) => applied.has(m)) ? "ok" : "outdated";
          } catch {
            schema = "outdated";
          }
        } catch {
          db = "error";
        }
        const { loadSecrets } = await import("@/lib/ai/secrets.server");
        const { planProviders } = await import("@/lib/ai/chain");
        const plan = planProviders(loadSecrets());
        const ok = db === "ok" && schema === "ok" && plan.ready;
        return Response.json(
          { status: ok ? "ok" : "degraded", db, schema, ai: { provider: plan.primary, fallbacks: plan.fallbacks, ready: plan.ready } },
          { status: ok ? 200 : 503, headers: { "cache-control": "no-store" } },
        );
      },
    },
  },
});
