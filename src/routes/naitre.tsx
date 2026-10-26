import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ActeDeNaissance } from "@/components/birth/ActeDeNaissance";
import { initWasm, tirage_pays_pondere } from "@/engine/alea-core";
import { createBirthProfile, createLifeFromProfile } from "@/lib/lifeEngine";
import { freshSeed, sexLabel, type BirthProfile } from "@/lib/sim/engine";
import { useAlea } from "@/lib/store";

export const Route = createFileRoute("/naitre")({
  head: () => ({ meta: [{ title: "Acte de naissance · Aléa" }, { name: "description", content: "Un acte de naissance tiré au hasard, avec les données qui situent une vie." }] }),
  component: BirthPage,
});

function BirthPage() {
  const navigate = useNavigate();
  const saveLife = useAlea((state) => state.saveLife);
  const [seed, setSeed] = useState(() => freshSeed());
  const [profile, setProfile] = useState<BirthProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void initWasm();
    const wasmCountry = tirage_pays_pondere(seed);
    setProfile(null);
    setError(null);
    void createBirthProfile(seed, wasmCountry).then((next) => { if (!cancelled) setProfile(next); }).catch(() => { if (!cancelled) setError("Les données du registre sont momentanément indisponibles."); });
    return () => { cancelled = true; };
  }, [seed]);

  async function begin() {
    if (!profile) return;
    const life = await createLifeFromProfile(profile, seed, "chapitres", false);
    life.id = `life-${seed.toString(16)}`;
    saveLife(life);
    void navigate({ to: "/vie/$id", params: { id: life.id } });
  }

  return (
    <section className="section birth-page">
      <div className="birth-intro"><p className="kicker">avant le premier souffle</p><h2>Le hasard a une adresse.</h2><p className="muted">Un même tirage alimente l’acte, la culture locale et la simulation. Les valeurs sont des ordres de grandeur éducatifs.</p></div>
      {error ? <div className="banner bad">{error} <button className="btn line" type="button" onClick={() => setSeed(freshSeed())}>Nouveau tirage</button></div> : null}
      {!profile && !error ? <div className="birth-loading card" aria-live="polite">Le registre pondère les naissances…</div> : null}
      {profile ? <ActeDeNaissance id={`${profile.country.iso.toUpperCase()}-${seed.toString(16)}`} name={profile.name} sex={sexLabel(profile.sex)} country={profile.country.name} city={profile.city} probability={profile.probability} incomeQuintile={profile.incomeQuintile} parentAge={profile.parentAge} siblings={profile.siblings} religion={profile.religion} roots={profile.roots} lifeExpectancy={profile.realtime.esperance} degraded={profile.realtime.degraded} onStart={() => void begin()} /> : null}
    </section>
  );
}
