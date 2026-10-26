import { createFileRoute, Link } from "@tanstack/react-router";
import { BirthForm } from "@/components/birth-form";
import { byIso, totalBirths } from "@/lib/sim/countries";
import { grouped } from "@/lib/sim/engine";

export const Route = createFileRoute("/pays/$iso")({
  head: ({ params }) => {
    const c = byIso(params.iso);
    const name = c?.name ?? "Pays";
    return {
      meta: [
        { title: `${name} · si le tirage tombait ici · Aléa` },
        { name: "description", content: `Que dit le registre d'Aléa sur ${name} : naissances, espérance, mortalité des enfants. Le tirage reste aléatoire.` },
      ],
    };
  },
  component: CountryPage,
});

function CountryPage() {
  const { iso } = Route.useParams();
  const c = byIso(iso);
  if (!c) {
    return (
      <section className="section">
        <h1>Ce pays n'est pas dans les 55</h1>
        <Link to="/pays">Retour au tableau</Link>
      </section>
    );
  }
  const total = totalBirths();
  const share = `${((c.births / total) * 100).toFixed(1)} %`;
  const odds = `1 sur ${Math.max(1, Math.round(total / c.births))}`;
  return (
    <section className="section">
      <p className="crumbs">
        <Link to="/">Aléa</Link> / <Link to="/pays">Pays</Link> / {c.name}
      </p>
      <h1>{c.name}</h1>
      <p className="lede">
        {share} des naissances de ce registre. {odds}. Espérance autour de {Math.round(c.le)} ans. Cela ne vous fait pas naître ici : le bouton reste un
        tirage.
      </p>
      <div className="grid3">
        <article className="card">
          <p className="kicker">avant 5 ans</p>
          <p>{(c.u5 / 10).toFixed(1)} %</p>
        </article>
        <article className="card">
          <p className="kicker">PIB/hab. PPA</p>
          <p>{grouped(c.gdpPpp)} $</p>
        </article>
        <article className="card">
          <p className="kicker">Gini · années d'école</p>
          <p>
            {Math.round(c.gini)} · {Math.round(c.school)}
          </p>
        </article>
      </div>
      <p className="muted">Un décile bas, dans une vie, veut dire un foyer plus près du plancher de ce pays. Le chiffre exact est un modèle simplifié.</p>
      <BirthForm compact />
    </section>
  );
}
