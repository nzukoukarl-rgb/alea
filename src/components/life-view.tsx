import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { narrateVoice } from "@/lib/ai/voice";
import {
  applyChoice,
  autoIndex,
  causeLabel,
  decile,
  fulfill,
  grouped,
  incomePerPerson,
  priorityLabel,
  settleWithoutVoice,
  sexLabel,
  stepYear,
  tone,
  verdict,
  type LifeState,
} from "@/lib/sim/engine";
import { useAlea } from "@/lib/store";

export function LifeView({ life, onChange }: { life: LifeState; onChange: (life: LifeState) => void }) {
  const [pending, setPending] = useState(false);
  const [note, setNote] = useState("");
  const publish = useAlea((s) => s.publish);
  const voice = life.phase.type === "voice" ? life.log[life.phase.index] : undefined;

  useEffect(() => {
    if (life.phase.type !== "voice" || life.archive) return;
    const entry = life.log[life.phase.index];
    if (!entry || entry.prose || life.voiceError) return;
    let cancel = false;
    setPending(true);
    narrateVoice({ data: { kind: entry.kind, register: entry.register, choice: entry.choice } })
      .then((result) => {
        if (cancel) return;
        const next = structuredClone(life);
        if (result.ok) fulfill(next, result.prose, result.echo, result.provider);
        else next.voiceError = result.error;
        onChange(next);
      })
      .catch((err: unknown) => {
        if (cancel) return;
        const next = structuredClone(life);
        const message = err instanceof Error ? err.message : "";
        next.voiceError = /unauthorized/i.test(message)
          ? "Connectez-vous pour entendre la voix. Le registre, lui, est déjà écrit."
          : "La voix n'a pas répondu. Le registre reste lisible.";
        onChange(next);
      })
      .finally(() => {
        if (!cancel) setPending(false);
      });
    return () => {
      cancel = true;
      setPending(false);
    };
    // Only when this passage is waiting. A new log index is a new request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [life.id, life.phase.type, life.phase.type === "voice" ? life.phase.index : -1, life.voiceError]);

  function mutate(fn: (draft: LifeState) => void) {
    const next = structuredClone(life);
    fn(next);
    onChange(next);
  }

  return (
    <div className="life">
      <aside>
        <p className="kicker">{life.archive ? "archive" : life.alive ? "en cours" : "close"}</p>
        <p className="age">
          {life.age}
          <small>ans</small>
        </p>
        <h1>
          {life.name}
          <br />
          <span className="muted">{life.countryName}</span>
        </h1>
        <p className="small">
          {sexLabel(life.sex)} · {decile(life.percentile)}e décile · environ {grouped(incomePerPerson(life))} $ PPA
        </p>
        <div className="bars">
          <Bar label="Santé" value={life.sante} />
          <Bar label="Lien" value={life.lien} />
          <Bar label="Savoir" value={life.savoir} />
          <Bar label="Avoir" value={life.avoir} />
        </div>
        <p className="small">Le mode automatique protège le {priorityLabel(life.priority)}.</p>
        {life.cause ? <p className="small">Cause du registre : {causeLabel(life.cause)}.</p> : null}
      </aside>
      <section className="stack">
        {pending ? <p className="banner ok">Le registre écrit…</p> : null}
        {life.voiceError ? <p className="banner bad">{life.voiceError}</p> : null}
        {voice?.prose ? (
          <article className="card">
            <p className="kicker">voix · {voice.provider ?? "modèle"}</p>
            <p className="voice">{voice.prose}</p>
            {voice.echo ? <p className="muted">{voice.echo}</p> : null}
          </article>
        ) : null}
        {life.phase.type === "voice" && life.voiceError ? (
          <div className="row">
            <button
              className="btn solid"
              type="button"
              onClick={() => mutate((draft) => { draft.voiceError = null; })}
            >
              Réessayer la voix
            </button>
            <button className="btn line" type="button" onClick={() => mutate((draft) => settleWithoutVoice(draft))}>
              Continuer sans phrase
            </button>
            <Link to="/login" className="btn line">
              Se connecter
            </Link>
          </div>
        ) : null}
        {life.phase.type === "choice" ? (
          <div className="choices">
            {life.phase.options.map((opt, index) => (
              <button key={opt.title} className="choice" type="button" onClick={() => mutate((draft) => { applyChoice(draft, index); })}>
                <h3>{opt.title}</h3>
                <p>{opt.hint}</p>
              </button>
            ))}
          </div>
        ) : null}
        {life.phase.type === "choice" ? (
          <button
            className="btn line"
            type="button"
            onClick={() =>
              mutate((draft) => {
                if (draft.phase.type === "choice") applyChoice(draft, autoIndex(draft.phase.options, draft.priority));
              })
            }
          >
            Laisser choisir
          </button>
        ) : null}
        {life.phase.type === "walk" ? (
          <button className="btn solid" type="button" onClick={() => mutate((draft) => { stepYear(draft); })}>
            Une année de plus
          </button>
        ) : null}
        {life.phase.type === "dead" ? (
          <article className="cert">
            <p className="kicker">verdict</p>
            <p>{life.archiveBlurb || verdict(life)}</p>
            <p className="disclaimer">For educational purposes only, not professional advice.</p>
            {!life.archive ? (
              <form
                className="stack"
                onSubmit={(event) => {
                  event.preventDefault();
                  publish(life.id, "Vous", note);
                }}
              >
                <label>
                  Un mot pour le mémorial
                  <textarea value={note} maxLength={240} onChange={(event) => setNote(event.target.value)} />
                </label>
                <button className="btn line" type="submit">
                  Déposer le mot
                </button>
              </form>
            ) : null}
            <p>
              <Link to="/naitre" className="btn solid">
                Une autre naissance
              </Link>
            </p>
          </article>
        ) : null}
        <details>
          <summary className="kicker">Registre</summary>
          <pre className="register">{voice?.register || life.trail.slice(-6).join("\n")}</pre>
        </details>
        {life.kin.length > 0 ? (
          <div>
            <p className="kicker">Nés à la même seconde, ailleurs</p>
            <ul className="trail">
              {life.kin.map((kin) => (
                <li key={kin.name + kin.country}>
                  {kin.name}, {kin.sexLabel}, {kin.country}, {kin.years} ans
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <ol className="trail">
          {life.trail.slice(-8).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="bar">
      <span>{label}</span>
      <span className="track">
        <i className={tone(value)} style={{ width: `${value}%` }} />
      </span>
      <span>{value}</span>
    </div>
  );
}
