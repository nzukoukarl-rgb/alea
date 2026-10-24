import { createFileRoute } from "@tanstack/react-router";
import { PAGES } from "@/lib/compare";
import { buildSitemap, resolveSiteUrl } from "@/lib/seo";
import { COUNTRIES } from "@/lib/sim/countries";

const PATHS = ["/", "/naitre", "/vies", "/pays", "/memorial", "/compare", "/ecoute", "/confidentialite", "/conditions", "/inscription"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => {
        const urls = [
          ...PATHS,
          ...PAGES.map((p) => `/compare/${p.slug}`),
          ...COUNTRIES.map((c) => `/pays/${c.iso}`),
        ];
        const body = buildSitemap(resolveSiteUrl(process.env.SITE_URL, request.url), urls);
        return new Response(body, {
          headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" },
        });
      },
    },
  },
});
