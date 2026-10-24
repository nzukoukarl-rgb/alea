import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LifeState } from "@/lib/sim/engine";
import { newLife, playOut, verdict } from "@/lib/sim/engine";

export type Candle = { author: string; note: string; country: string; years: number };

export const SEED_CANDLES: Candle[] = [
  { author: "Archive", note: "Quarante-et-un ans. Le registre dit une vie plus courte que l'espérance du pays.", country: "Nigéria", years: 41 },
  { author: "Archive", note: "Soixante-dix-huit ans, proche de l'espérance. On a laissé un mot, pas une bougie.", country: "France", years: 78 },
  { author: "Classe", note: "Mode classe. La fin est une maladie, sans scène.", country: "Inde", years: 54 },
];

let samples: LifeState[] | null = null;

export function sampleLives(): LifeState[] {
  if (samples) return samples;
  samples = [7, 19, 88].map((seed) => {
    const life = newLife(seed, "chapitres", seed === 88);
    life.id = `archive-${seed}`;
    life.archive = true;
    playOut(life);
    life.archiveBlurb = verdict(life);
    return life;
  });
  return samples;
}

type AleaState = {
  theme: "dark" | "light";
  edu: boolean;
  lives: LifeState[];
  candles: Candle[];
  setTheme: (theme: "dark" | "light") => void;
  setEdu: (edu: boolean) => void;
  saveLife: (life: LifeState) => void;
  publish: (id: string, author: string, note: string) => void;
};

export const useAlea = create<AleaState>()(
  persist(
    (set) => ({
      theme: "dark",
      edu: false,
      lives: [],
      candles: SEED_CANDLES,
      setTheme: (theme) => set({ theme }),
      setEdu: (edu) => set({ edu }),
      saveLife: (life) =>
        set((state) => ({
          lives: [life, ...state.lives.filter((item) => item.id !== life.id)].slice(0, 40),
        })),
      publish: (id, author, note) =>
        set((state) => {
          const life = state.lives.find((item) => item.id === id);
          if (!life || life.alive) return state;
          const candle: Candle = {
            author: author.trim().slice(0, 40) || "Anonyme",
            note: note.trim().slice(0, 240),
            country: life.countryName,
            years: life.age,
          };
          if (!candle.note) return state;
          return {
            candles: [candle, ...state.candles].slice(0, 24),
            lives: state.lives.map((item) => (item.id === id ? { ...item, archive: true, archiveBlurb: candle.note } : item)),
          };
        }),
    }),
    { name: "alea.v1" },
  ),
);
