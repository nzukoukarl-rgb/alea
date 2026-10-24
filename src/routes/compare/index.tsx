import { createFileRoute, Link } from "@tanstack/react-router";
import { h1, PAGES } from "@/lib/compare";
import { socialMeta } from "@/lib/seo";

export const Route = createFileRoute("/compare/")({
  head: () => {
    const title = "Comparer Aléa aux autres simulations de vie · 2026";
    const description = "Aléa face à 1 sur 8 milliards, BitLife, in8b.com, les Sims 4, Paralives, inZOI et Reigns.";
    const social = socialMeta({ siteUrl: import.meta.env.VITE_SITE_URL, path: "/compare", title, description });
    return { meta: [{ title }, { name: "description", content: description }, ...social.meta], links: social.links };
  },
  component: Hub,
});

function Hub() {
  return (
    <section className="section">
      <p className="kicker">comparer</p>
      <h1>Aléa à côté des autres</h1>
      <p className="lede">Les plus proches sont les tirages de naissance. Les autres sont des vies que l'on joue autrement : maison, ville, trône, texte.</p>
      <div className="hub">
        {PAGES.map((page) => (
          <Link key={page.slug} to="/compare/$slug" params={{ slug: page.slug }} className="card">
            <h3>{page.other}</h3>
            <p className="muted">{page.blurb}</p>
            <p className="small">{h1(page)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
