import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const COUNTRIES = ["Algérie", "Brésil", "Inde", "Japon", "Mexique", "Sénégal", "France", "Philippines"];

export function TirageAnimation({ country, probability }: { country: string; probability: number }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? country : "…");
  const [done, setDone] = useState(Boolean(reduced));
  useEffect(() => {
    if (reduced) return;
    let i = 0;
    const timer = window.setInterval(() => {
      setShown(COUNTRIES[i++ % COUNTRIES.length]!);
      if (i > 12) {
        window.clearInterval(timer);
        setShown(country);
        setDone(true);
      }
    }, 95);
    return () => window.clearInterval(timer);
  }, [country, reduced]);
  return (
    <div className={`draw ${done && country === "Algérie" ? "draw--algeria" : ""}`} aria-live="polite">
      <span className="draw__label">lieu de naissance · tirage pondéré</span>
      <motion.strong animate={reduced ? undefined : { y: done ? 0 : [0, -4, 0] }} transition={{ repeat: done ? 0 : Infinity, duration: 0.28 }}>
        {shown}
      </motion.strong>
      <span className="draw__probability">{probability.toFixed(2).replace(".", ",")} % de probabilité</span>
      {done && country === "Algérie" ? <span className="confetti" aria-hidden="true">✦ · ˚ ✧ · ✦</span> : null}
    </div>
  );
}
