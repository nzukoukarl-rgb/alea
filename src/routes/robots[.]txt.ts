import { createFileRoute } from "@tanstack/react-router";
import { buildRobots, resolveSiteUrl } from "@/lib/seo";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) =>
        new Response(buildRobots(resolveSiteUrl(process.env.SITE_URL, request.url)), {
          headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
        }),
    },
  },
});
