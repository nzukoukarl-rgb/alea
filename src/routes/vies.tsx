import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LifeSprite } from "@/components/life-sprite";
import { initWasm, tirage_pays_pondere } from "@/engine/alea-core";
import { fetchRealtimeSnapshot } from "@/lib/lifeEngine";
import { sampleLives, useAlea } from "@/lib/store";
import type { LifeState } from "@/lib/sim/engine";

export const Route = createFileRoute("/vies")({ head: () => ({ meta: [{ title: "Vies · Aléa" }, { name: "description", content: "Les vies déjà tirées sur cet appareil, accompagnées d’un personnage qui vieillit." }] }), component: LivesPage });

function LivesPage() {
  const mine = useAlea((s) => s.lives); const [ready, setReady] = useState(false); const [realtime, setRealtime] = useState<Record<string, number>>({}); const [refreshing, setRefreshing] = useState(false);
  useEffect(() => { void initWasm(); setReady(true); }, []);
  const lives = [...sampleLives(), ...(ready ? mine : [])];
  async function refresh() { setRefreshing(true); const next: Record<string, number> = {}; await Promise.all(lives.map(async (life) => { try { next[life.countryName] = (await fetchRealtimeSnapshot(life.countryName)).pib; } catch { /* local snapshot remains visible */ } })); setRealtime(next); setRefreshing(false); }
  return <section className="section"><h1>Vos vies</h1><p className="muted">Chaque personnage est dérivé du seed de sa vie. Les indicateurs économiques peuvent être rechargés sans changer son identité.</p><div className="row"><button className="btn line" type="button" onClick={() => void refresh()} disabled={refreshing}>{refreshing ? "Actualisation…" : "Actualiser les données"}</button><span className="small">{Object.keys(realtime).length ? "snapshot realtime chargé" : "snapshot de la vie"}</span></div>
    {lives.length === 0 ? <p className="empty card">Aucune vie encore. Le tirage n'a pas eu lieu.</p> : null}
    <div className="grid2">{lives.map((life) => <LifeCard key={life.id} life={life} pib={realtime[life.countryName]} />)}</div>
    <p><Link to="/naitre" className="btn solid">Naître</Link></p></section>;
}
function LifeCard({ life, pib }: { life: LifeState; pib?: number }) {
  return <div className="card life-card"><Link to="/vie/$id" params={{ id: life.id }} className="life-card__link"><div><p className="kicker">{life.archive ? "archive" : "vie"}</p><h3>{life.name} · {life.countryName}</h3><p className="muted">{life.alive ? "en cours" : `${life.age} ans`} · {pib ? `${Math.round(pib).toLocaleString("fr-FR")} $ PPA` : "snapshot enregistré"}</p><p className="small">Moteur · {tirage_pays_pondere(life.seed)}</p></div><LifeSprite sex={life.sex} age={life.age} seed={life.seed} label={`Personnage de ${life.name}`} /></Link></div>;
}
