# Alea v3 — plan d’implémentation

Le projet fourni est un frontend TanStack Start/Vite avec Nitro (preset Vercel), pas un projet Next.js. Les routes demandées sont donc implémentées avec `createFileRoute` afin de préserver le runtime existant et `/api/health`.

## Approche

- Remplacer `/naitre` par un acte de naissance client riche, en gardant `BirthForm` disponible comme action « Commencer cette vie ».
- Extraire les éléments visuels dans `src/components/birth` et `src/components/effects`, avec Framer Motion et respect de `prefers-reduced-motion`.
- Ajouter `src/app/api/realtime/route.ts` comme module de route compatible avec TanStack/Nitro, plus une route miroir dans `src/routes/api/realtime.ts` pour le routage fichier.
- Ajouter un cache mémoire d’une heure, des délais réseau explicites, des valeurs de secours issues du jeu local et des sources World Bank/OWID documentées.
- Ajouter `src/engine/alea-core` comme crate Rust/WASM reproductible, avec une implémentation TypeScript légère utilisée tant que le build WASM n’est pas nécessaire au runtime Vercel.
- Ajouter les helpers de retry vocal et le fallback Web Speech API, sans bloquer le registre si Gemini dépasse 30 secondes.

## Direction artistique

**Styles envisagés :** acte administratif néon (0,07), laboratoire éditorial (0,04), dossier d’archive pop (0,08). Choix : acte administratif néon.

- **Design movement :** brutaliste éditorial, inspiré d’un document officiel sur fond nuit, traversé par un rose signal.
- **Principes :** contraste net, hiérarchie documentaire, mouvement court et lisible, détails monospace comme preuves.
- **Palette :** `#0A0A0B` pour le silence institutionnel, `#FF4D7A` comme signature émotionnelle, blanc cassé pour la lecture.
- **Layout :** grande carte inclinée, détails latéraux, sections qui se découvrent au scroll plutôt qu’une grille uniforme.
- **Signature :** ruban de probabilité, points de monde en parallaxe, sprites pixel sur une étagère.
- **Interaction :** chaque hover doit suggérer une carte qui se soulève; chaque erreur propose une action concrète.
- **Animation :** 2.5D légère, transitions de 400 ms, aucune boucle coûteuse sur mobile, réduction automatique si nécessaire.
- **Typographie :** serif de système pour le nom, monospace pour les labels, sans-serif pour les valeurs et actions.
- **Brand essence :** une expérience qui rend visible l’inégalité du hasard; précise, littéraire, inconfortablement honnête.
- **Voix :** « Un acte, pas un verdict. » / « Le lieu est tiré. La vie commence. »

## Structure

- `src/components/birth/ActeDeNaissance.tsx` : certificat et données de naissance.
- `src/components/birth/TirageLieu.tsx` : animation de tirage pays.
- `src/components/effects/Card2_5D.tsx` : wrapper d’inclinaison Framer Motion.
- `src/lib/realtime.ts` : cache, sources, normalisation et fallback.
- `src/app/api/realtime/route.ts` + `src/routes/api/realtime.ts` : endpoint temps réel.
- `src/engine/alea-core/` : crate Rust/WASM et tests Rust.
- `src/lib/ai/voice.ts` + `src/lib/voice-client.ts` : retry serveur et fallback navigateur.

## Contraintes conservées

Le schéma et la route `/api/health` existants restent inchangés. Aucune clé n’est embarquée dans le client. Les appels externes ont des délais, un cache et des valeurs de secours explicites.
