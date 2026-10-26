import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { COUNTRIES, totalBirths } from "@/lib/sim/countries";
import { grouped } from "@/lib/sim/engine";

export const Route = createFileRoute("/pays")({
  head: () => ({
    meta: [
      { title: "Statistiques des pays couverts · Aléa" },
      { name: "description", content: "Part des naissances, espérance de vie, mortalité des enfants et revenu par habitant. Chiffres éducatifs arrondis." },
    ],
  }),
  component: CountriesPage,
});

function CountriesPage() {
  const [q, setQ] = useState("");
  const total = totalBirths();
  const query = q.trim().toLowerCase();
  const rows = COUNTRIES.filter((c) => !query || c.name.toLowerCase().includes(query) || c.iso.includes(query));
  return (
    <section className="section">
      <h1>Si le tirage tombait ici</h1>
      <p className="lede">
        Les pays affichés sont pondérés par les naissances disponibles dans le registre. Les poids sont renormalisés et les sources sont indiquées comme des ordres de grandeur éducatifs.
      </p>
      <form
        className="row"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <input value={q} placeholder="Filtrer un pays" style={{ maxWidth: 280 }} onChange={(event) => setQ(event.target.value)} />
      </form>
      <div className="scroll card">
        <table>
          <thead>
            <tr>
              <th>Pays</th>
              <th>Part des naissances</th>
              <th>Dans ce registre</th>
              <th>Espérance</th>
              <th>Avant 5 ans</th>
              <th>PIB/hab. PPA</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.iso}>
                <td>
                  <Link to="/pays/$iso" params={{ iso: c.iso }}>
                    {c.name}
                  </Link>
                </td>
                <td>{((c.births / total) * 100).toFixed(1)} %</td>
                <td>1 sur {Math.max(1, Math.round(total / c.births))}</td>
                <td>{Math.round(c.le)} ans</td>
                <td>{(c.u5 / 10).toFixed(1)} %</td>
                <td>{grouped(c.gdpPpp)} $</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small">Avant 5 ans : décès pour 100 naissances, ordre de grandeur. Le revenu plus bas dans une vie est un modèle, pas cette colonne.</p>
    </section>
  );
}
