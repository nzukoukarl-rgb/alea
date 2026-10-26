import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BirthForm } from "@/components/birth-form";
import { COUNTRIES } from "@/lib/sim/countries";
import { SEED_CANDLES, useAlea } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Home,
});

const THEMES = ["Famille", "École", "Travail", "Départ", "Soin", "Hasard", "Faim", "Ville"];

function Home() {
  const candles = useAlea((s) => s.candles);
  const [ready, setReady] = useState(false);
  const [births, setBirths] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const theme = THEMES[Math.floor((Date.now() / 86400000) % THEMES.length)] ?? "Hasard";
  const shown = (ready ? candles : SEED_CANDLES).slice(0, 3);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    const t0 = Date.now();
    const id = window.setInterval(() => {
      const seconds = (Date.now() - t0) / 1000;
      setBirths(Math.floor(seconds * 4.2));
      setDeaths(Math.floor(seconds * 1.9));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <section className="hero">
        <div>
          <p className="kicker">simulation de vie · registre éducatif · 55 pays</p>
          <h1 className="display">Aléa</h1>
          <p className="lede">
            En ce moment, des enfants naissent. Vous n'en choisissez aucun. Aléa en tire un au sort, selon le poids des naissances, puis vous
            laisse vivre cette vie jusqu'au bout.
          </p>
          <div className="row">
            <BirthForm compact />
            <Link to="/naitre" className="btn line">
              Régler le pas avant
            </Link>
          </div>
          <p className="small">Où vous naîtrez, vous ne pouvez pas le choisir. Tout comme vous ne l'avez pas choisi.</p>
        </div>
        <div className="stack">
          <div className="card">
            <p className="kicker">
              <span className="pulse" />
              depuis que cette page est ouverte
            </p>
            <div className="live">
              <div>
                <b>{births}</b>
                <span className="small">naissances dans le monde</span>
              </div>
              <div>
                <b>{deaths}</b>
                <span className="small">départs, ordre de grandeur</span>
              </div>
            </div>
            <p className="small">Environ 4,2 naissances et 1,9 décès par seconde. Compteur local, pas un flux officiel.</p>
          </div>
          <svg className="map" viewBox="0 0 360 180" role="img" aria-label="Répartition indicative des naissances">
            {COUNTRIES.map((c) => (
              <circle key={c.iso} cx={c.lon + 180} cy={90 - c.lat} r={Math.min(5.5, Math.max(1.1, c.births / 9000))} className="dot" />
            ))}
          </svg>
          <p className="kicker">Thème du jour · {theme}</p>
        </div>
      </section>
      <section className="section">
        <h2>Trois temps, une seule vie</h2>
        <div className="grid3">
          <article className="card">
            <h3>1 · Le tirage</h3>
            <p className="muted">Pays, sexe, décile. Le poids suit les naissances, pas la curiosité.</p>
          </article>
          <article className="card">
            <h3>2 · Les paliers</h3>
            <p className="muted">À 5, 15, 30, 50 et 70 ans, trois cartes. Une seule reste.</p>
          </article>
          <article className="card">
            <h3>3 · La voix</h3>
            <p className="muted">Un modèle écrit le chapitre à partir du registre. S'il se tait, aucun texte n'est inventé à sa place.</p>
          </article>
        </div>
      </section>
      <section className="section">
        <h2>Maison des vies</h2>
        <p className="muted">Quelques archives, pour que l'étagère ne soit pas vide. Les vôtres viendront après.</p>
        <div className="grid3">
          {shown.map((m) => (
            <article className="post" key={m.country + m.years + m.note}>
              <p className="kicker">
                {m.country} · {m.years} ans · {m.author}
              </p>
              <p>{m.note}</p>
            </article>
          ))}
        </div>
        <p>
          <Link to="/memorial">Entrer dans le mémorial</Link>
        </p>
      </section>
      <section className="section">
        <h2>À côté de quoi</h2>
        <p className="muted">Le même geste existe ailleurs, et d'autres jeux vivent une vie sans la tirer au sort.</p>
        <div className="row">
          <Link to="/compare" className="btn line">
            Toutes les comparaisons
          </Link>
          <Link to="/compare/$slug" params={{ slug: "alea-vs-1-sur-8-milliards" }}>
            Aléa et 1 sur 8 milliards
          </Link>
          <Link to="/compare/$slug" params={{ slug: "bitlife" }}>
            BitLife
          </Link>
        </div>
      </section>
    </>
  );
}
