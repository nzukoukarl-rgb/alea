# ADR 0001 : TypeScript est la seule pile d'Aléa

**Date** : 24 octobre 2026. **Statut** : acceptée.

## Contexte
Le brief initial demandait Rust/Leptos. La seule version exécutée en production est TypeScript (TanStack Start, React, Better Auth, Postgres). Une crate Rust incomplète (`alea/`, sans `main.rs`, sans configuration `cargo-leptos`) coexistait dans le dépôt et laissait croire que Leptos était la cible active.

## Décision
- La crate Rust est supprimée. Un artefact incomplet n'est pas une option d'architecture, c'est de la dette.
- Aléa n'est pas réécrit en Rust maintenant.
- Une migration vers Rust/Leptos reste possible plus tard, mais elle exigera un ADR dédié avec son périmètre, son coût et un plan de bascule des données ; elle ne se prépare pas par du code mort.

## Conséquences
La documentation et le brief décrivent la pile réelle. Le moteur de simulation reste isolé de l'interface (`src/lib/sim`), ce qui garde une éventuelle portation praticable.
