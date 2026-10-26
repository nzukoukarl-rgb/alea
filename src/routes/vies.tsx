import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { sampleLives, useAlea } from "@/lib/store";

export const Route = createFileRoute("/vies")({
  head: () => ({
    meta: [
      { title: "Vies · Aléa" },
      { name: "description", content: "Les vies déjà tirées sur cet appareil, et trois archives pour que l'étagère ne soit pas vide." },
    ],
  }),
  component: LivesPage,
});

function LivesPage() {
  const mine = useAlea((s) => s.lives);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const lives = [...sampleLives(), ...(ready ? mine : [])];
  return (
    <section className="section">
      <h1>Vos vies</h1>
      <p className="muted">Les trois premières sont des archives du registre. Les suivantes sont les vôtres, gardées dans ce navigateur.</p>
      {lives.length === 0 ? <p className="empty card">Aucune vie encore. Le tirage n'a pas eu lieu.</p> : null}
      <div className="grid2">
        {lives.map((life) => (
          <Link key={life.id} to="/vie/$id" params={{ id: life.id }} className="card">
            <p className="kicker">{life.archive ? "archive" : "vie"}</p>
            <h3>
              {life.name} · {life.countryName}
            </h3>
            <p className="muted">{life.alive ? "en cours" : `${life.age} ans`}</p>
          </Link>
        ))}
      </div>
      <p>
        <Link to="/naitre" className="btn solid">
          Naître
        </Link>
      </p>
    </section>
  );
}
