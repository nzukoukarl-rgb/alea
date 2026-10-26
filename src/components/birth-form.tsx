import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { freshSeed, newLife, parsePace, parsePriority, type Pace, type Priority } from "@/lib/sim/engine";
import { useAlea } from "@/lib/store";

export function BirthForm({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const edu = useAlea((s) => s.edu);
  const saveLife = useAlea((s) => s.saveLife);
  const [pace, setPace] = useState<Pace>("chapitres");
  const [priority, setPriority] = useState<Priority>("lien");
  const [origin, setOrigin] = useState("");

  function born(event: React.FormEvent) {
    event.preventDefault();
    const life = newLife(freshSeed(), pace, edu);
    life.id = crypto.randomUUID();
    life.priority = priority;
    const clean = origin.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 60);
    life.statedOrigin = clean.length >= 2 ? clean : null;
    saveLife(life);
    void navigate({ to: "/vie/$id", params: { id: life.id } });
  }

  if (compact) {
    return (
      <form onSubmit={born} className="row">
        <button className="btn solid" type="submit">
          Naître
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={born} className="card stack">
      <div className="field">
        <label>
          Pas
          <select
            value={pace}
            onChange={(event) => setPace(parsePace(event.target.value))}
          >
            <option value="chapitres">Chapitres · d'un palier à l'autre</option>
            <option value="annees">Années · une à la fois</option>
          </select>
        </label>
      </div>
      <div className="field">
        <label>
          Si vous laissez choisir
          <select value={priority} onChange={(event) => setPriority(parsePriority(event.target.value))}>
            <option value="lien">Protéger le lien</option>
            <option value="savoir">Protéger le savoir</option>
            <option value="avoir">Protéger l'avoir</option>
            <option value="sante">Protéger la santé</option>
          </select>
        </label>
      </div>
      <div className="field">
        <label>
          Votre pays réel, si vous voulez le noter (il ne change pas le tirage)
          <input value={origin} maxLength={60} placeholder="facultatif" onChange={(event) => setOrigin(event.target.value)} />
        </label>
      </div>
      <button className="btn solid" type="submit">
        Naître quand même au hasard
      </button>
    </form>
  );
}
