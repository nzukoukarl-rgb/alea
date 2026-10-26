import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LifeView } from "@/components/life-view";
import type { LifeState } from "@/lib/sim/engine";
import { sampleLives, useAlea } from "@/lib/store";

export const Route = createFileRoute("/vie/$id")({
  head: () => ({
    meta: [
      { title: "Une vie · Aléa" },
      { name: "description", content: "Le registre d'une vie tirée au sort, et la voix qui ne peut écrire que ce qui y figure." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LifePage,
});

function LifePage() {
  const { id } = Route.useParams();
  const stored = useAlea((s) => s.lives.find((life) => life.id === id));
  const saveLife = useAlea((s) => s.saveLife);
  const [ready, setReady] = useState(false);
  const [local, setLocal] = useState<LifeState | null>(null);
  useEffect(() => setReady(true), []);

  const archive = sampleLives().find((life) => life.id === id);
  const life = local ?? (ready ? stored : undefined) ?? archive;

  if (!ready && !archive) {
    return (
      <section className="section">
        <p className="kicker">registre</p>
        <h1>Ouverture…</h1>
      </section>
    );
  }
  if (!life) {
    return (
      <section className="section">
        <h1>Cette vie n'est pas ici</h1>
        <p className="muted">Elle n'est pas dans ce navigateur. Le tirage ne se recharge pas.</p>
        <Link to="/naitre" className="btn solid">
          Naître
        </Link>
      </section>
    );
  }
  return (
    <LifeView
      life={life}
      onChange={(next) => {
        setLocal(next);
        if (!next.archive) saveLife(next);
      }}
    />
  );
}
