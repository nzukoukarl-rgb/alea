import { createFileRoute } from "@tanstack/react-router";
import { SEED_CANDLES, useAlea } from "@/lib/store";

export const Route = createFileRoute("/memorial")({
  head: () => ({
    meta: [
      { title: "Mémorial · Aléa" },
      { name: "description", content: "Vies déposées, avec un mot. Registre éducatif, pas un hommage officiel." },
    ],
  }),
  component: MemorialPage,
});

function MemorialPage() {
  const candles = useAlea((s) => s.candles);
  const shown = candles.length > 0 ? candles : SEED_CANDLES;
  return (
    <section className="section">
      <p className="kicker">mémorial</p>
      <h1>Des vies déjà refermées</h1>
      <p className="muted">On peut laisser un mot à la fin d'une vie. On n'allume rien d'autre.</p>
      <div className="stack">
        {shown.map((m) => (
          <article className="post" key={m.note + m.country + m.years}>
            <p className="kicker">
              {m.country} · {m.years} ans · {m.author}
            </p>
            <p>{m.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
