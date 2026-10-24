import { createFileRoute } from "@tanstack/react-router";
import { DISCLAIMER } from "@/lib/sim/engine";

export const Route = createFileRoute("/ecoute")({
  head: () => ({
    meta: [
      { title: "Écoute · Aléa" },
      { name: "description", content: "Si une vie d'Aléa touche de trop près, des lignes d'écoute existent, hors du jeu." },
    ],
  }),
  component: ListenPage,
});

function ListenPage() {
  return (
    <section className="section">
      <h1>Si c'est trop près</h1>
      <p>Aléa nomme la mort, la pauvreté et parfois la détresse, en étiquettes. Ce n'est pas une scène, et ce n'est pas une aide.</p>
      <p>En France, le 3114 répond, 24 heures sur 24. Ailleurs, l'IASP tient une liste de lignes locales : iasp.info/suicidalthoughts.</p>
      <p>Le mode classe, en haut de page, retire les causes les plus lourdes du tirage.</p>
      <p className="disclaimer">{DISCLAIMER}</p>
    </section>
  );
}
