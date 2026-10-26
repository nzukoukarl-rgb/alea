import { motion, useReducedMotion } from "framer-motion";
import { Card2_5D } from "@/components/effects/Card2_5D";
import { TirageAnimation } from "./TirageLieu";

export type BirthCertificateProps = {
  id: string;
  name: string;
  sex?: string;
  country?: string;
  city?: string;
  probability?: number;
  incomeQuintile?: number;
  parentAge?: number;
  siblings?: number;
  religion?: string;
  roots?: string;
  lifeExpectancy?: number;
  onStart?: () => void;
};

export function BirthCertificate({ id, name, sex = "féminin", country = "Algérie", city = "Oran", probability = 0.69, incomeQuintile = 2, parentAge = 34, siblings = 5, religion = "protestantisme", roots = "afro-américaines", lifeExpectancy = 77, onStart }: BirthCertificateProps) {
  const reduced = useReducedMotion();
  return (
    <main className="birth-stage">
      <div className="birth-orbit" aria-hidden="true"><span /><span /><span /></div>
      <Card2_5D className="birth-certificate">
        <header className="birth-certificate__masthead">
          <div><span className="stamp-mark">A</span><span>ALÉA · REGISTRE MONDIAL</span></div>
          <span className="birth-certificate__number">N° {id}</span>
        </header>
        <div className="birth-certificate__rule" />
        <p className="mono-label">ACTE DE NAISSANCE · TIRAGE {new Date().getFullYear()}</p>
        <motion.h1 initial={reduced ? false : { opacity: 0, y: 20 }} animate={reduced ? undefined : { opacity: 1, y: 0 }} transition={{ delay: .12, duration: .55 }}>{name}</motion.h1>
        <p className="birth-certificate__sub">Une identité n’est pas choisie. Elle est située.</p>
        <TirageAnimation country={country} probability={probability} />
        <div className="birth-grid">
          <Field label="sexe" value={sex} /><Field label="pays de naissance" value={country} /><Field label="lieu précis" value={city} />
          <Field label="revenu familial" value={`quintile ${incomeQuintile} / 5`} /><Field label="âge d’un parent" value={`${parentAge} ans`} /><Field label="frères et sœurs" value={`${siblings}`} />
          <Field label="religion déclarée" value={religion} /><Field label="racines familiales" value={roots} /><Field label="espérance de vie ONU" value={`${lifeExpectancy} ans`} />
        </div>
        <footer className="birth-certificate__footer">
          <span className="mono-label">DONNÉES TEMPS RÉEL · WORLD BANK · MIS À JOUR IL Y A 12 MIN</span>
          <button className="btn birth-cta" type="button" onClick={onStart}>Commencer cette vie <span>↗</span></button>
        </footer>
      </Card2_5D>
      <div className="pixel-shelf" aria-hidden="true"><span>◈</span><span>♟</span><span>◇</span><span>♟</span><i /></div>
    </main>
  );
}
function Field({ label, value }: { label: string; value: string }) {
  return <div className="birth-field"><span className="mono-label">{label}</span><strong>{value}</strong></div>;
}
export { BirthCertificate as ActeDeNaissance };
