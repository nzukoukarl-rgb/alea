import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ActeDeNaissance } from "@/components/birth/ActeDeNaissance";
import { freshSeed, newLife } from "@/lib/sim/engine";
import { useAlea } from "@/lib/store";

export const Route = createFileRoute("/naitre")({
  head: () => ({
    meta: [
      { title: "Acte de naissance · Aléa" },
      { name: "description", content: "Un acte de naissance tiré au hasard, avec les données qui situent une vie." },
    ],
  }),
  component: BirthPage,
});

function BirthPage() {
  const navigate = useNavigate();
  const saveLife = useAlea((state) => state.saveLife);
  function begin() {
    const life = newLife(freshSeed(), "chapitres", false);
    life.id = crypto.randomUUID();
    saveLife(life);
    void navigate({ to: "/vie/$id", params: { id: life.id } });
  }
  return (
    <section className="section birth-page">
      <div className="birth-intro"><p className="kicker">avant le premier souffle</p><h2>Le hasard a une adresse.</h2><p className="muted">Une fiche documentaire, puis une vie simulée. Les valeurs sont des ordres de grandeur éducatifs, pas une prédiction individuelle.</p></div>
      <ActeDeNaissance id="USA-2026-6059500" name="Emma Kelly" sex="féminin" country="Algérie" city="Oran" probability={0.69} incomeQuintile={2} parentAge={34} siblings={5} religion="protestantisme" roots="afro-américaines" lifeExpectancy={77} onStart={begin} />
    </section>
  );
}
