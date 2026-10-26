import { COUNTRIES, type Country } from "./countries.ts";

export type Pace = "chapitres" | "annees";
export type Priority = "lien" | "savoir" | "avoir" | "sante";
export type Sex = "f" | "m";
export type Cause =
  | "naissance"
  | "enfance"
  | "maladie"
  | "accident"
  | "coeur"
  | "cancer"
  | "violence"
  | "detresse"
  | "age";

export type ChoiceOpt = {
  title: string;
  hint: string;
  sante: number;
  lien: number;
  savoir: number;
  avoir: number;
  priority: Priority;
};

export type Kin = { name: string; country: string; sexLabel: string; years: number };

export type LogEntry = {
  ageFrom: number;
  ageTo: number;
  kind: string;
  register: string;
  choice: string | null;
  prose: string | null;
  echo: string | null;
  provider: string | null;
};

export type Then = { type: "choice"; age: number } | { type: "walk" } | { type: "dead" };

export type Phase =
  | { type: "voice"; index: number; then: Then }
  | { type: "choice"; age: number; options: ChoiceOpt[] }
  | { type: "walk" }
  | { type: "dead" };

export type LifeState = {
  id: string;
  seed: number;
  pace: Pace;
  priority: Priority;
  edu: boolean;
  statedOrigin: string | null;
  countryIso: string;
  countryName: string;
  region: string;
  le: number;
  u5: number;
  gini: number;
  gdpPpp: number;
  school: number;
  fragility: number;
  sex: Sex;
  name: string;
  percentile: number;
  age: number;
  alive: boolean;
  cause: Cause | null;
  sante: number;
  lien: number;
  savoir: number;
  avoir: number;
  companion: boolean;
  children: number;
  kin: Kin[];
  trail: string[];
  spanNotes: string[];
  spanFrom: number;
  log: LogEntry[];
  phase: Phase;
  voiceError: string | null;
  archive: boolean;
  archiveBlurb: string | null;
  rngCursor: number;
};

const MASK = (1n << 64n) - 1n;

export function parsePace(raw: string): Pace {
  const v = raw.trim().toLowerCase();
  if (v === "annees" || v === "années" || v === "annee" || v === "an" || v === "vigile") return "annees";
  return "chapitres";
}

export function parsePriority(raw: string): Priority {
  const v = raw.trim().toLowerCase();
  if (v === "savoir" || v === "ecole" || v === "école") return "savoir";
  if (v === "avoir" || v === "revenu") return "avoir";
  if (v === "sante" || v === "santé") return "sante";
  return "lien";
}

export function sexLabel(sex: Sex): string {
  return sex === "f" ? "féminin" : "masculin";
}

export function causeLabel(cause: Cause): string {
  switch (cause) {
    case "naissance":
      return "complication autour de la naissance";
    case "enfance":
      return "maladie de la petite enfance";
    case "maladie":
      return "maladie";
    case "accident":
      return "accident";
    case "coeur":
      return "maladie cardiovasculaire";
    case "cancer":
      return "cancer";
    case "violence":
      return "mort violente, sans scène";
    case "detresse":
      return "mort liée à la détresse, sans détail";
    case "age":
      return "grand âge";
  }
}

export function priorityLabel(p: Priority): string {
  if (p === "sante") return "santé";
  return p;
}

function roll(state: LifeState): number {
  let x = (BigInt(state.seed) + BigInt(state.rngCursor) * 0x9e3779b97f4a7c15n) & MASK;
  state.rngCursor += 1;
  x = (x + 0x9e3779b97f4a7c15n) & MASK;
  let z = x;
  z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & MASK;
  z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & MASK;
  z = z ^ (z >> 31n);
  return Number(z >> 11n) / 9007199254740992;
}

function clampU8(value: number): number {
  return Math.round(Math.min(100, Math.max(0, value)));
}

function addClamp(value: number, delta: number): number {
  return Math.min(100, Math.max(0, value + delta));
}

export function grouped(n: number): string {
  const digits = Math.round(n).toString();
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    const fromEnd = digits.length - i;
    if (i > 0 && fromEnd % 3 === 0) out += "\u202f";
    out += digits[i];
  }
  return out;
}

export function decile(percentile: number): number {
  return Math.floor(Math.min(99, percentile) / 10) + 1;
}

export function tone(v: number): "good" | "warn" | "bad" {
  if (v >= 67) return "good";
  if (v >= 40) return "warn";
  return "bad";
}

export function incomePerPerson(life: LifeState): number {
  const z = Math.min(0.98, Math.max(0.02, life.percentile / 100));
  const g = Math.min(0.65, Math.max(0.25, life.gini / 100));
  const mult = (z / 0.5) ** (g * 4);
  return Math.round(Math.min(400000, Math.max(200, life.gdpPpp * mult)));
}

function applyCountry(state: LifeState, country: Country) {
  state.countryIso = country.iso;
  state.countryName = country.name;
  state.region = country.region;
  state.le = country.le;
  state.u5 = country.u5;
  state.gini = country.gini;
  state.gdpPpp = country.gdpPpp;
  state.school = country.school;
  state.fragility = country.fragility;
}

function pickCountry(state: LifeState): Country {
  const total = COUNTRIES.reduce((s, c) => s + c.births, 0);
  let ticket = Math.floor(roll(state) * total);
  if (ticket >= total) ticket = total - 1;
  for (const country of COUNTRIES) {
    if (ticket < country.births) return country;
    ticket -= country.births;
  }
  return COUNTRIES[COUNTRIES.length - 1]!;
}

function samplePercentile(state: LifeState, gini: number): number {
  const u = Math.min(0.999, Math.max(0.001, roll(state)));
  const g = Math.min(0.65, Math.max(0.25, gini / 100));
  return Math.round(Math.min(99, Math.max(1, u ** (1 + g * 2.2) * 100)));
}

const NAMES: Record<string, Record<Sex, string[]>> = {
  sa: { f: ["Amina", "Priya", "Anika", "Fatima", "Meera", "Zara"], m: ["Arjun", "Hassan", "Ravi", "Imran", "Kabir", "Neel"] },
  ea: { f: ["Hana", "Mei", "Yuna", "Aiko", "Lin", "Sora"], m: ["Haru", "Wei", "Minho", "Ren", "Tao", "Kenji"] },
  sea: { f: ["Sari", "Linh", "May", "Ayu", "Putri", "Hoa"], m: ["Budi", "Minh", "Arif", "Duy", "Rizal", "Kiet"] },
  wa: { f: ["Awa", "Fatou", "Amina", "Mariam", "Aïcha", "Binta"], m: ["Ibrahim", "Kwame", "Moussa", "Oumar", "Sekou", "Chinedu"] },
  af: { f: ["Grace", "Mireille", "Amina", "Nadia", "Neema", "Lalaina"], m: ["Emmanuel", "Idriss", "Jean", "Joseph", "Baraka", "Andry"] },
  mena: { f: ["Layla", "Nour", "Yasmin", "Maryam", "Salma", "Dina"], m: ["Omar", "Yusuf", "Karim", "Ali", "Hassan", "Tariq"] },
  latam: { f: ["Lucía", "Camila", "Valentina", "Sofía", "Marina", "Ana"], m: ["Mateo", "Luis", "Diego", "Andrés", "João", "Pedro"] },
  na: { f: ["Maya", "Hannah", "Chloe", "Aisha", "Nora", "Evelyn"], m: ["Noah", "Liam", "Elias", "Jamal", "Owen", "Leo"] },
  oc: { f: ["Freya", "Charlotte", "Aria", "Matilda", "Ruby", "Isla"], m: ["Jack", "Oliver", "Henry", "Noah", "Archie", "Finn"] },
  eu: { f: ["Camille", "Léa", "Inès", "Chloé", "Jeanne", "Louise"], m: ["Louis", "Adam", "Gabriel", "Hugo", "Arthur", "Sacha"] },
};

function pickName(state: LifeState, region: string, sex: Sex): string {
  const list = NAMES[region]?.[sex] ?? NAMES.eu![sex];
  const index = Math.floor(roll(state) * list.length) % list.length;
  return list[index]!;
}

function note(state: LifeState, text: string) {
  state.spanNotes.push(text);
  state.trail.push(`Année ${state.age} · ${text}`);
}

function nudge(state: LifeState, sante: number, lien: number, savoir: number, avoir: number) {
  state.sante = addClamp(state.sante, sante);
  state.lien = addClamp(state.lien, lien);
  state.savoir = addClamp(state.savoir, savoir);
  state.avoir = addClamp(state.avoir, avoir);
}

function isCheckpoint(age: number): boolean {
  return age === 5 || age === 15 || age === 30 || age === 50 || age === 70;
}

export function optionsFor(age: number): ChoiceOpt[] {
  const rows: Array<[string, string, number, number, number, number, Priority]> =
    age === 5
      ? [
          ["Rester près des siens", "Le lien monte. L'école peut attendre.", 2, 8, -2, 0, "lien"],
          ["Entrer à l'école, si elle est là", "Le savoir monte. Le foyer s'éloigne un peu.", 0, -2, 10, -1, "savoir"],
          ["Aider déjà à la maison", "Le revenu du foyer souffle. Le corps et l'école paient.", -2, 3, -4, 5, "avoir"],
        ]
      : age === 15
        ? [
            ["Pousser les études", "Encore du savoir. L'argent vient plus tard.", 0, -1, 8, -3, "savoir"],
            ["Travailler tôt", "Le revenu arrive. L'école se ferme.", -3, 1, -6, 8, "avoir"],
            ["Ménager le corps", "La santé d'abord. On reste près des siens.", 6, 3, 0, -2, "sante"],
          ]
        : age === 30
          ? [
              ["Fonder une famille", "Le lien devient une maison. Le revenu se partage.", -1, 10, 0, -4, "lien"],
              ["Chercher un revenu plus stable", "L'avoir se consolide. Le lien attend.", -1, -2, 1, 8, "avoir"],
              ["Partir plus loin", "Un autre pays, peut-être. On laisse des gens.", -2, -8, 3, 4, "savoir"],
            ]
          : age === 50
            ? [
                ["S'occuper des aînés", "Le lien tient la maison. Le revenu baisse.", -2, 8, 0, -3, "lien"],
                ["Transmettre un métier", "Le savoir passe à quelqu'un.", 0, 2, 6, 2, "savoir"],
                ["Ralentir et se soigner", "La santé reprend un peu de place.", 8, 1, 0, -2, "sante"],
              ]
            : [
                ["Rester chez soi", "Le corps décide du rythme.", 4, -1, 0, 0, "sante"],
                ["Vivre avec les enfants", "Le lien se resserre.", 1, 8, 0, -1, "lien"],
                ["Écrire ce qui compte", "Une trace, pas un patrimoine.", 0, 2, 5, 0, "savoir"],
              ];
  return rows.map(([title, hint, sante, lien, savoir, avoir, priority]) => ({
    title,
    hint,
    sante,
    lien,
    savoir,
    avoir,
    priority,
  }));
}

export function autoIndex(options: ChoiceOpt[], priority: Priority): number {
  const direct = options.findIndex((o) => o.priority === priority);
  if (direct >= 0) return direct;
  let best = 0;
  let score = -999;
  options.forEach((o, i) => {
    const value = priority === "sante" ? o.sante : priority === "lien" ? o.lien : priority === "savoir" ? o.savoir : o.avoir;
    if (value > score) {
      score = value;
      best = i;
    }
  });
  return best;
}

function buildRegister(state: LifeState, choice?: string | null): string {
  const lines = [
    `Pays : ${state.countryName}. Sexe à la naissance : ${sexLabel(state.sex)}. Prénom : ${state.name}.`,
    `Période : de ${state.spanFrom} à ${state.age} ans. En vie à la fin de la période : ${state.alive ? "oui" : "non"}.`,
  ];
  if (state.cause) lines.push(`Cause indiquée : ${causeLabel(state.cause)}.`);
  lines.push(
    `Ordres de grandeur du pays : espérance ${Math.round(state.le)} ans, mortalité avant 5 ans ${Math.round(state.u5)} pour mille, PIB/hab. PPA environ ${grouped(state.gdpPpp)} $, Gini ${Math.round(state.gini)}.`,
  );
  lines.push(
    `Foyer : ${decile(state.percentile)}e décile. Revenu indicatif par personne : ${grouped(incomePerPerson(state))} $ PPA par an, modèle simplifié, pas un revenu réel.`,
  );
  lines.push(`Jauges : santé ${state.sante}, lien ${state.lien}, savoir ${state.savoir}, avoir ${state.avoir} (échelle 0 à 100).`);
  if (state.companion) lines.push("Une personne partage la vie.");
  if (state.children > 0) lines.push(`Enfants dans le foyer : ${state.children}.`);
  if (choice) lines.push(`Choix retenu : ${choice}.`);
  if (state.spanNotes.length === 0) lines.push("Faits notés : le temps passe, sans autre fait marquant.");
  else lines.push(`Faits notés : ${state.spanNotes.join(" ")}`);
  if (state.edu) lines.push("Mode classe : ne pas détailler la violence ni la détresse.");
  return lines.join("\n");
}

function openVoice(state: LifeState, kind: string, choice: string | null, then: Then) {
  const register = buildRegister(state, choice);
  state.log.push({
    ageFrom: state.spanFrom,
    ageTo: state.age,
    kind,
    register,
    choice,
    prose: null,
    echo: null,
    provider: null,
  });
  const index = state.log.length - 1;
  state.spanNotes = [];
  state.spanFrom = state.age;
  state.phase = { type: "voice", index, then };
}

function deathProbability(state: LifeState, age: number): number {
  const le = Math.max(35, state.le + (state.sex === "f" ? 2.5 : -2.5));
  if (age === 0) return Math.min(0.3, Math.max(0.002, (state.u5 / 1000) * 0.62));
  if (age < 5) return Math.min(0.08, Math.max(0.0004, (state.u5 / 1000) * 0.38 / 4));
  const k = 7;
  const s = (a: number) => Math.exp(-((a / le) ** k) * Math.LN2);
  const h = 1 - s(age + 1) / Math.max(1e-9, s(age));
  return Math.min(0.8, Math.max(0.0008, h));
}

function hazardHit(state: LifeState, age: number): boolean {
  return roll(state) < deathProbability(state, age);
}

function pickCause(state: LifeState, age: number): Cause {
  if (state.edu) {
    if (age === 0) return "naissance";
    if (age < 5) return "enfance";
    if (age > 75) return "age";
    return "maladie";
  }
  if (age === 0) return roll(state) < 0.55 ? "naissance" : "enfance";
  if (age < 5) return "enfance";
  const r = roll(state);
  if (age >= 15 && age < 50 && r < 0.025) return "detresse";
  if (age >= 55) {
    if (r < 0.34) return "coeur";
    if (r < 0.58) return "cancer";
    if (r < 0.78) return "age";
    if (r < 0.9) return "maladie";
    return "accident";
  }
  const violenceLine = 0.04 + state.fragility * 0.03;
  if (r < violenceLine) return "violence";
  if (r < violenceLine + 0.18) return "accident";
  return "maladie";
}

function kill(state: LifeState, age: number, cause: Cause) {
  state.age = age;
  state.alive = false;
  state.cause = cause;
  state.trail.push(`Année ${age} · fin · ${causeLabel(cause)}.`);
}

function onBirthday(state: LifeState) {
  const age = state.age;
  if (age === 6) {
    if (state.savoir >= 38 || state.school >= 11) {
      state.savoir = Math.min(100, state.savoir + 4);
      note(state, "L'école est ouverte.");
    } else note(state, "L'école manque, ou elle coûte trop.");
  } else if (age === 14 && state.avoir < 45) {
    state.sante = Math.max(0, state.sante - 3);
    note(state, "Un travail précoce apparaît dans le foyer.");
  } else if (age === 19 && state.savoir >= 55) {
    state.savoir = Math.min(100, state.savoir + 3);
    note(state, "Les études se prolongent.");
  } else if (age === 22) {
    note(state, "Un revenu propre commence, à la mesure du décile.");
  } else if (age === 27 && state.lien >= 50 && !state.companion && roll(state) < 0.55) {
    state.companion = true;
    note(state, "Une personne partage désormais la vie.");
  } else if ((age === 31 || age === 36) && state.companion && state.children < 4 && roll(state) < 0.5) {
    state.children += 1;
    state.lien = Math.min(100, state.lien + 2);
    note(state, "Un enfant naît dans le foyer.");
  } else if (age === 48 && state.sante < 55) {
    note(state, "La santé se fatigue.");
  } else if (age === 65) {
    state.sante = Math.max(0, state.sante - 4);
    note(state, "Le corps entre dans la vieillesse du registre.");
  }
}

function surviveBirth(state: LifeState): boolean {
  if (hazardHit(state, 0)) {
    kill(state, 0, pickCause(state, 0));
    return false;
  }
  state.trail.push(`Année 0 · naissance en ${state.countryName}.`);
  return true;
}

function advance(state: LifeState): boolean {
  const next = state.age + 1;
  if (next > 105 || hazardHit(state, next)) {
    const age = Math.min(next, 105);
    const cause = next > 105 ? "age" : pickCause(state, age);
    kill(state, age, cause);
    return false;
  }
  state.age = next;
  onBirthday(state);
  if (state.age % 10 === 0) {
    state.trail.push(
      `Année ${state.age} · le temps passe. Santé ${state.sante}, lien ${state.lien}, savoir ${state.savoir}, avoir ${state.avoir}.`,
    );
  }
  return true;
}

function blank(seed: number, pace: Pace, edu: boolean): LifeState {
  return {
    id: "",
    seed,
    pace,
    priority: "lien",
    edu,
    statedOrigin: null,
    countryIso: "",
    countryName: "",
    region: "",
    le: 70,
    u5: 20,
    gini: 35,
    gdpPpp: 10000,
    school: 10,
    fragility: 0,
    sex: "f",
    name: "",
    percentile: 50,
    age: 0,
    alive: true,
    cause: null,
    sante: 70,
    lien: 55,
    savoir: 30,
    avoir: 40,
    companion: false,
    children: 0,
    kin: [],
    trail: [],
    spanNotes: [],
    spanFrom: 0,
    log: [],
    phase: { type: "walk" },
    voiceError: null,
    archive: false,
    archiveBlurb: null,
    rngCursor: 0,
  };
}

function newLifeInner(seed: number, pace: Pace, edu: boolean, withKin: boolean): LifeState {
  const state = blank(seed, pace, edu);
  const country = pickCountry(state);
  applyCountry(state, country);
  state.sex = roll(state) < 0.488 ? "f" : "m";
  state.percentile = samplePercentile(state, country.gini);
  state.name = pickName(state, country.region, state.sex);
  state.sante = clampU8(78 - country.u5 / 8 + roll(state) * 18);
  state.lien = clampU8(40 + roll(state) * 35);
  state.savoir = clampU8((country.school / 16) * 35 + roll(state) * 15);
  state.avoir = state.percentile;
  if (withKin) {
    state.kin = [1, 2, 3].map((n) => glimpse(seed ^ Math.imul(n, 0x5a5a1234)));
  }
  if (!surviveBirth(state)) {
    openVoice(state, "mort", null, { type: "dead" });
    return state;
  }
  if (pace === "chapitres") {
    while (state.alive && !isCheckpoint(state.age)) {
      if (!advance(state)) break;
    }
  }
  if (state.alive) {
    const then: Then = pace === "annees" ? { type: "walk" } : { type: "choice", age: state.age };
    openVoice(state, "naissance", null, then);
  } else {
    openVoice(state, "mort", null, { type: "dead" });
  }
  return state;
}

function glimpse(seed: number): Kin {
  const life = newLifeInner(seed >>> 0, "chapitres", false, false);
  const name = life.name;
  const country = life.countryName;
  const sex = sexLabel(life.sex);
  playOut(life);
  return { name, country, sexLabel: sex, years: life.age };
}

export function newLife(seed: number, pace: Pace, edu: boolean): LifeState {
  return newLifeInner(seed >>> 0, pace, edu, true);
}

function applyThen(state: LifeState, then: Then) {
  state.voiceError = null;
  if (then.type === "dead") state.phase = { type: "dead" };
  else if (then.type === "walk") state.phase = { type: "walk" };
  else state.phase = { type: "choice", age: then.age, options: optionsFor(then.age) };
}

export function settleWithoutVoice(state: LifeState) {
  if (state.phase.type === "voice") applyThen(state, state.phase.then);
}

export function fulfill(state: LifeState, prose: string, echo: string, provider: string) {
  if (state.phase.type !== "voice") return;
  const entry = state.log[state.phase.index];
  if (entry) {
    entry.prose = prose;
    entry.echo = echo;
    entry.provider = provider;
  }
  applyThen(state, state.phase.then);
}

export function applyChoice(state: LifeState, index: number): string | null {
  if (state.phase.type !== "choice") return "Ce n'est pas le moment d'un choix.";
  const opt = state.phase.options[index];
  if (!opt) return "Ce choix n'existe pas.";
  const age = state.phase.age;
  nudge(state, opt.sante, opt.lien, opt.savoir, opt.avoir);
  note(state, `Choix : ${opt.title}.`);
  if (state.pace === "annees") {
    openVoice(state, "chapitre", opt.title, { type: "walk" });
    return null;
  }
  while (state.alive) {
    if (!advance(state)) break;
    if (isCheckpoint(state.age) || state.age > 110) break;
  }
  const then: Then = state.alive && isCheckpoint(state.age) && state.age > age ? { type: "choice", age: state.age } : { type: "dead" };
  openVoice(state, state.alive ? "chapitre" : "mort", opt.title, then);
  return null;
}

export function stepYear(state: LifeState): string | null {
  if (state.phase.type !== "walk") return "Ce n'est pas le moment d'avancer d'une année.";
  if (!state.alive) {
    state.phase = { type: "dead" };
    return null;
  }
  if (!advance(state)) {
    openVoice(state, "mort", null, { type: "dead" });
    return null;
  }
  if (isCheckpoint(state.age)) {
    state.phase = { type: "choice", age: state.age, options: optionsFor(state.age) };
  }
  return null;
}

export function playOut(state: LifeState) {
  for (let i = 0; i < 160; i++) {
    if (state.phase.type === "dead") return;
    if (state.phase.type === "voice") settleWithoutVoice(state);
    else if (state.phase.type === "choice") {
      if (applyChoice(state, 0)) return;
    } else if (stepYear(state)) return;
  }
}

export function verdict(life: LifeState): string {
  if (life.alive) return `La vie est en cours, à ${life.age} ans, en ${life.countryName}.`;
  const cmp =
    life.age + 3 < life.le
      ? "plus courte que l'espérance du pays"
      : life.age > life.le + 3
        ? "plus longue que l'espérance du pays"
        : "proche de l'espérance du pays";
  return `${life.age} ans en ${life.countryName}, une vie ${cmp}, où le registre situe l'espérance autour de ${Math.round(life.le)} ans. Santé ${life.sante}, lien ${life.lien}, savoir ${life.savoir}, avoir ${life.avoir}.`;
}

export function freshSeed(): number {
  const a = Math.floor(Math.random() * 0xffffffff);
  const b = Date.now() & 0xffff;
  return (a ^ (b << 8)) >>> 0;
}

export const DISCLAIMER =
  "For educational purposes only, not professional advice. À des fins éducatives seulement : ce n'est pas un conseil médical, financier ou juridique.";
