# Alea v3 — données et déploiement

## Données

L’endpoint `GET /api/realtime?country=Algeria` renvoie `pib`, `esperance`, `gini`, `inflation`, `updatedAt` et `source`. Les indicateurs de PIB et d’espérance utilisent l’API Indicators v2 de la Banque mondiale. Le coefficient de Gini est chargé depuis le Grapher CSV d’Our World in Data. Les requêtes sont limitées à sept secondes et les valeurs sont conservées en mémoire pendant une heure. Un pays non pris en charge renvoie `400`; une source indisponible utilise le fallback local et marque `degraded: true`.

La référence démographique est le portail UN World Population Prospects 2024. Le crate `src/engine/alea-core` expose le calcul normalisé et le tirage pondéré; il peut être compilé vers WASM avec `wasm-pack build src/engine/alea-core --target web`. Le runtime actuel conserve volontairement le moteur TS existant comme fallback, ce qui évite de bloquer un déploiement Vercel sur la présence d’un toolchain Rust.

## Voix

Les appels IA ont maintenant un timeout de 30 secondes et deux tentatives pour les erreurs transitoires. Si le serveur échoue, `src/lib/voice-client.ts` lit le registre immutable avec `SpeechSynthesis` lorsqu’il est disponible. Le bouton « Réessayer la voix » efface l’erreur et relance l’effet serveur; « Continuer sans phrase » reste disponible.

## Déploiement

Installer avec `pnpm install`, vérifier avec `pnpm typecheck`, `pnpm test`, puis construire avec `pnpm build`. Le projet utilise le preset Nitro Vercel déjà présent dans `vite.config.ts`. Pour un déploiement manuel, lancer `vercel deploy --prod` depuis la racine. Les clés IA restent des variables d’environnement Vercel et ne sont jamais placées dans le client.

Sources officielles : [World Bank Indicators API](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation), [OWID Chart API](https://docs.owid.io/projects/etl/api/chart-api/), [UN WPP 2024](https://population.un.org/wpp/), [MDN Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API), [Workflow SDK](https://github.com/vercel/workflow).
