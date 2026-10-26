# TODO Alea v3

- [ ] Le timeout voix serveur atteint 30 secondes; les erreurs Gemini déclenchent une stratégie de retry et le client propose Web Speech API.
- [ ] `/naitre` affiche un acte de naissance rose/noir avec identifiant, nom, sexe, pays, ville, quintile, parents, fratrie, religion, racines et espérance de vie.
- [ ] `BirthCertificate` et `TirageAnimation` existent dans `src/components/birth` avec animation de machine à sous et tirage Algérie à 0,69 %.
- [ ] `Card2_5D` fournit l’inclinaison, le soulèvement au survol et un mode réduit pour les animations.
- [ ] Le moteur temps réel renvoie `pib`, `esperance`, `gini`, `inflation`, utilise les sources World Bank/OWID, un cache d’une heure et des valeurs de secours.
- [ ] Le crate Rust/WASM contient le calcul de probabilités et ses tests unitaires; l’application garde un fallback TS si le WASM n’est pas compilé.
- [ ] Les tests couvrent calcul, fallback vocal, route realtime, pays inconnu, source indisponible et cache.
- [ ] La route `/api/health` reste compatible avec le contrat existant.
- [ ] README, documentation des sources et procédures Vercel/GitHub sont à jour.
