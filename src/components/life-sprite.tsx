import { createAvatar } from "@dicebear/core";
import * as personas from "@dicebear/personas";
import type { Sex } from "@/lib/sim/engine";

export function LifeSprite({ sex, age, seed, label = "Personnage de la vie" }: { sex: Sex; age: number; seed: number; label?: string }) {
  const stage = age < 5 ? "0" : age < 15 ? "5" : age < 30 ? "15" : age < 60 ? "30" : "60";
  const dataUri = createAvatar(personas, { seed: `${seed}-${stage}-${sex}`, size: 72, radius: 12 }).toDataUri();
  return <div className={`life-sprite life-sprite--${stage} life-sprite--${sex}`} role="img" aria-label={`${label}, âge ${age} ans`}><img src={dataUri} alt="" aria-hidden="true" /><span className="sprite-pixel-glow" /></div>;
}
