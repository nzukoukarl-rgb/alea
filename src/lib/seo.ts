/** SEO helpers shared by the sitemap, robots.txt and page heads. Pure and testable. */

/** Normalise a configured site URL: absolute http(s), no trailing slash. Returns undefined if unusable. */
export function normalizeSiteUrl(raw: string | undefined | null): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

/** Configured SITE_URL first, then the origin of the incoming request. */
export function resolveSiteUrl(configured: string | undefined, requestUrl: string): string {
  return normalizeSiteUrl(configured) ?? new URL(requestUrl).origin;
}

const escapeXml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** sitemap.xml with absolute <loc> values, as the protocol requires. */
export function buildSitemap(siteUrl: string, paths: string[]): string {
  const base = siteUrl.replace(/\/+$/, "");
  const unique = [...new Set(paths)];
  const rows = unique.map((p) => `  <url><loc>${escapeXml(base + (p.startsWith("/") ? p : `/${p}`))}</loc></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</urlset>\n`;
}

/** robots.txt with an absolute Sitemap line; private areas are kept out of the index. */
export function buildRobots(siteUrl: string): string {
  const base = siteUrl.replace(/\/+$/, "");
  return `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /compte\n\nSitemap: ${base}/sitemap.xml\n`;
}

/** Open Graph + canonical meta for a page. Absolute URL tags are only emitted when the site URL is known. */
export function socialMeta(opts: {
  siteUrl: string | undefined;
  path: string;
  title: string;
  description: string;
  image?: string;
}): { meta: Record<string, string>[]; links: Record<string, string>[] } {
  const site = normalizeSiteUrl(opts.siteUrl);
  const meta: Record<string, string>[] = [
    { property: "og:title", content: opts.title },
    { property: "og:description", content: opts.description },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  const links: Record<string, string>[] = [];
  if (site) {
    const url = site + opts.path;
    meta.push({ property: "og:url", content: url });
    meta.push({ property: "og:image", content: site + (opts.image ?? "/og.jpg") });
    links.push({ rel: "canonical", href: url });
  }
  return { meta, links };
}
