import { createFileRoute } from "@tanstack/react-router";
import { getRealtimeData } from "@/lib/realtime";

export const Route = createFileRoute("/api/realtime")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const country = new URL(request.url).searchParams.get("country") ?? "";
        try {
          return Response.json(await getRealtimeData(country), { headers: { "cache-control": "public, s-maxage=3600, stale-while-revalidate=300" } });
        } catch (error) {
          const code = error instanceof Error ? error.message : "unknown";
          const status = code === "unknown-country" || code === "invalid-country" ? 400 : 503;
          return Response.json({ error: code, message: status === 400 ? "Pays inconnu ou paramètre invalide." : "Les sources sont momentanément indisponibles." }, { status });
        }
      },
    },
  },
});
