import { motion, useReducedMotion } from "framer-motion";
import { Card2_5D } from "@/components/effects/Card2_5D";
import { TirageAnimation } from "./TirageLieu";

export type BirthCertificateProps = {
  id: string; name: string; sex: string; country: string; city: string; probability: number; incomeQuintile: number; parentAge: number; siblings: number; religion: string; roots: string; lifeExpectancy: number; degraded?: boolean; onStart?: () => void;
};

export function BirthCertificate({ id, name, sex, country, city, probability, incomeQuintile, parentAge, siblings, religion, roots, lifeExpectancy, degraded = false, onStart }: BirthCertificateProps) {
  const reduced = useReducedMotion();
  return (
    <article className="birth-stage" aria-labelledby="birth-title">
      <div className="birth-orbit" aria-hidden="true"><span /><span /><span /></div>
      <Card2_5D className="birth-certificate">
        <header className="birth-certificate__masthead"><div><span className="stamp-mark">A</span><span>ALÉA · REGISTRE MONDIAL</span></div><span className="birth-certificate__number">N° {id}</span></header>
        <div className="birth-certificate__rule" />
        <p className="mono-label">ACTE DE NAISSANCE · TIRAGE {new Date().getFullYear()}</p>
        <motion.h1 id="birth-title" initial={reduced ? false : { opacity: 0, y: 20 }} animate={reduced ? undefined : { opacity: 1, y: 0 }} transition={{ delay: .12, duration: .28, ease: [0.22, 1, 0.36, 1] }}>{name}</motion.h1>
        <p className="birth-certificate__sub">Une identité n’est pas choisie. Elle est située.</p>
        <TirageAnimation country={country} probability={probability} />
        <div className="birth-grid"><Field label="sexe" value={sex} /><Field label="pays de naissance" value={country} /><Field label="lieu précis" value={city} /><Field label="revenu familial" value={`quintile ${incomeQuintile} / 5`} /><Field label="âge d’un parent" value={`${parentAge} ans`} /><Field label="frères et sœurs" value={`${siblings}`} /><Field label="religion déclarée" value={religion} /><Field label="racines familiales" value={roots} /><Field label="espérance de vie ONU" value={`${Math.round(lifeExpectancy)} ans`} /></div>
        <footer className="birth-certificate__footer"><span className="mono-label">{degraded ? "FALLBACK LOCAL · SOURCES EXTERNES INDISPONIBLES" : "DONNÉES TEMPS RÉEL · WORLD BANK · OWID"}</span><button className="btn birth-cta" type="button" onClick={onStart}>Commencer cette vie <span>↗</span></button></footer>
      </Card2_5D>
      <div className="pixel-shelf" aria-hidden="true"><span className="pixel-diamond" /><span className="pixel-person" /><span className="pixel-star" /><span className="pixel-person pixel-person--alt" /><i /></div>
    </article>
  );
}
function Field({ label, value }: { label: string; value: string }) { return <div className="birth-field"><span className="mono-label">{label}</span><strong>{value}</strong></div>; }
export { BirthCertificate as ActeDeNaissance };
