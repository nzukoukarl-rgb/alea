import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { bySlug, h1, PAGES } from "@/lib/compare";
import { socialMeta } from "@/lib/seo";
import { DISCLAIMER } from "@/lib/sim/engine";
import { BirthForm } from "@/components/birth-form";

export const Route = createFileRoute("/compare/$slug")({
  // A real 404 status for unknown slugs (search engines drop them instead of indexing a soft 404).
  loader: ({ params }) => {
    if (!bySlug(params.slug)) throw notFound();
  },
  notFoundComponent: () => (
    <section className="section">
      <h1>Cette comparaison n'existe pas</h1>
      <Link to="/compare">Toutes les comparaisons</Link>
    </section>
  ),
  head: ({ params }) => {
    const page = bySlug(params.slug);
    const title = page ? h1(page) : "Comparaison · Aléa";
    const description = page?.description ?? "Comparaison introuvable.";
    const social = socialMeta({ siteUrl: import.meta.env.VITE_SITE_URL, path: `/compare/${params.slug}`, title, description });
    return {
      meta: [{ title }, { name: "description", content: description }, ...(page ? social.meta : [{ name: "robots", content: "noindex" }])],
      links: page ? social.links : [],
    };
  },
  component: One,
});

function One() {
  const { slug } = Route.useParams();
  const page = bySlug(slug);
  if (!page) {
    return (
      <section className="section">
        <h1>Cette comparaison n'existe pas</h1>
        <Link to="/compare">Toutes les comparaisons</Link>
      </section>
    );
  }
  const title = h1(page);
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Aléa", item: "/" },
      { "@type": "ListItem", position: 2, name: "Comparer", item: "/compare" },
      { "@type": "ListItem", position: 3, name: `Aléa vs ${page.other}`, item: `/compare/${page.slug}` },
    ],
  };
  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Aléa",
    description: "Simulation de vie gratuite : naître au hasard et vivre une seule vie.",
    brand: "Aléa",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  return (
    <article className="section">
      <script type="application/ld+json">{JSON.stringify([crumbs, faqLd, product])}</script>
      <p className="crumbs">
        <Link to="/">Aléa</Link> / <Link to="/compare">Comparer</Link> / {page.other}
      </p>
      <h1>{title}</h1>
      <p className="lede">{page.intro}</p>
      <div className="scroll card">
        <table>
          <thead>
            <tr>
              <th>Critère</th>
              <th>Aléa</th>
              <th>{page.other}</th>
            </tr>
          </thead>
          <tbody>
            {page.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.alea}</td>
                <td>{row.other}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="procon" style={{ marginTop: 16 }}>
        <div className="card">
          <h2>Aléa</h2>
          <p className="kicker">atouts</p>
          <ul>{page.prosAlea.map((s) => <li key={s}>{s}</li>)}</ul>
          <p className="kicker">limites</p>
          <ul>{page.consAlea.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
        <div className="card">
          <h2>{page.other}</h2>
          <p className="kicker">atouts</p>
          <ul>{page.prosOther.map((s) => <li key={s}>{s}</li>)}</ul>
          <p className="kicker">limites</p>
          <ul>{page.consOther.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </div>
      <h2>Verdict</h2>
      <p className="voice">{page.verdict}</p>
      <h2>Questions fréquentes</h2>
      {page.faqs.map((f) => (
        <article className="faq card" key={f.q}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </article>
      ))}
      <div className="row" style={{ marginTop: 18 }}>
        <BirthForm compact />
        <Link to="/inscription" className="btn line">
          Créer un compte
        </Link>
      </div>
      <div className="row" style={{ marginTop: 14 }}>
        {page.related.map((rel) => {
          const other = PAGES.find((p) => p.slug === rel);
          return other ? (
            <Link key={rel} to="/compare/$slug" params={{ slug: rel }} className="btn line">
              Aléa vs {other.other}
            </Link>
          ) : null;
        })}
        <Link to="/compare">Toutes les comparaisons</Link>
      </div>
      <p className="disclaimer">{DISCLAIMER}</p>
    </article>
  );
}
