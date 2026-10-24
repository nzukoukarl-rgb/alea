import { createFileRoute } from "@tanstack/react-router";
import { BirthForm } from "@/components/birth-form";

export const Route = createFileRoute("/naitre")({
  head: () => ({
    meta: [
      { title: "Naître · Aléa" },
      { name: "description", content: "Choisir le pas d'une vie tirée au sort, sans choisir le pays." },
    ],
  }),
  component: BirthPage,
});

function BirthPage() {
  return (
    <section className="section">
      <p className="kicker">avant le tirage</p>
      <h1>Régler le pas, pas le pays</h1>
      <p className="lede">Le pays reste au hasard. Vous choisissez seulement la longueur du pas, et ce que le mode automatique protège.</p>
      <BirthForm />
    </section>
  );
}
