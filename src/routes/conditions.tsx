import { createFileRoute } from "@tanstack/react-router";
import { DISCLAIMER } from "@/lib/sim/engine";

export const Route = createFileRoute("/conditions")({
  head: () => ({
    meta: [
      { title: "Conditions · Aléa" },
      { name: "description", content: "Aléa est un registre éducatif. Ce n'est pas un conseil, ni le site officiel 1in8b.life." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <section className="section">
      <h1>Conditions</h1>
      <p>Aléa est une simulation. Les chiffres sont des ordres de grandeur arrondis, pas une prévision de votre vie.</p>
      <p>La voix peut se tromper de phrase. Elle n'a pas le droit d'ajouter un fait. Si elle se tait, le registre reste la seule source.</p>
      <p>Vous pouvez arrêter à tout moment. Rien ici n'est un service médical, financier ou juridique.</p>
      <p className="disclaimer">{DISCLAIMER}</p>
    </section>
  );
}
