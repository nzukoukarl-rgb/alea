# Audit de mise en production

Mis à jour le 21 octobre 2026 après une relecture contradictoire. Niveaux : **EXISTS** (le code est là), **WIRED** (branché au chemin réel), **EXECUTED** (exécuté ici), **VERIFIED** (comportement constaté). « Réel » = vrai PostgreSQL 16 local ou vrai fournisseur.

## Matrice

| Composant | EXISTS | WIRED | EXECUTED | VERIFIED | Remarque |
| --- | --- | --- | --- | --- | --- |
| Gemini | oui | oui | **faux serveur local** | partiel | Chemin complet exercé (session, quota, adaptateur Gemini, réponse) contre un serveur simulé. **Jamais appelé avec une vraie clé** : lancer `npm run smoke:ai`. |
| Groq, OpenRouter, xAI | oui | oui | tests unitaires seulement | non | Même script de test réel à lancer pour chacun (`AI_PROVIDER=...`). |
| Politique de fournisseur | oui | oui | oui | oui | Défaut Gemini, pas de substitution silencieuse, repli explicite vide par défaut (tests). |
| PostgreSQL | oui | oui | **oui (réel)** | oui | Migrations appliquées, santé, inscription, session, quota. Idempotence des migrations non re-testée. |
| Auth (inscription, session) | oui | oui | oui (réel) | oui | Mauvais mot de passe 401, origine hostile 403, session conservée après redémarrage. |
| Vérification d'e-mail, mot de passe oublié | non | non | non | non | **Manquant.** |
| Quota de voix | oui | oui | oui (réel) | oui | Ligne par utilisateur et par jour en base ; les échecs fournisseur ne l'incrémentent pas. |
| Erreurs fournisseur | oui | oui | oui | oui | Un 429 donne une phrase fixe, sans texte du fournisseur ni clé. |
| Démarrage en production | oui | oui | oui | oui | Refus clair sans base, secret fort ou clé IA ; ouverture explicite possible. |
| `/api/health` | oui | oui | oui | oui | 200 avec tout prêt, 503 avec base injoignable (sans crash). |
| Sitemap, robots, pages de comparaison | oui | oui | oui | oui | URLs absolues, OG, canonical, JSON-LD, 404. |
| Déploiement Vercel | oui | oui | build seulement | build | Non déployé réellement. |
| Déploiement Node | oui | oui | oui | oui | Serveur lancé avec vrai Postgres. |
| Limitation de débit, CSP | non | non | non | non | À ajouter (proxy/CDN ; voir `SECURITY.md`). |
| Rust/Leptos | supprimé | n/a | n/a | n/a | Décision du 24 oct. 2026 : voir `docs/adr/0001-typescript-stack.md`. |

## Ce que couvrent les 88 tests (`npm test`)

Moteur de simulation, validation et analyse des réponses IA, adaptateurs et repli (faux `fetch`), politique de fournisseur, contrôle de démarrage, SEO, absence de clés dans le dépôt, passerelles d'authentification, données d'application. Ce sont des tests unitaires : ils ne remplacent pas le test réel du fournisseur ni un test navigateur.

## Les 13 échecs de `npm run test:platform`

Tous vérifient les réglages d'origine du modèle d'échafaudage, que ce projet a changés : marque (`Aléa` au lieu de `Wild Race` dans les cartes de partage, 9 tests), authentification activée au lieu de désactivée (`app-env`, 3 tests : 79, 180, 182), schéma d'authentification placé hors du dossier optionnel (1 test). Le test 186 (CLI via lien symbolique) a le même motif de sortie différente, sans cause isolée plus finement. **Aucune régression de l'application n'a été constatée**, mais ces tests sont à réécrire ou à retirer ; ils ne servent pas de garde de la prod.

## Corrigé depuis le premier audit

Clés retirées du code (+ test anti-fuite) ; secret d'authentification obligatoire ; sitemap/robots absolus ; OG et canonical ; 404 réel ; preset de déploiement configurable ; en-têtes de sécurité ; typecheck ; **politique de fournisseur explicite** (l'ancien repli implicite vers OpenRouter, Groq puis Gemini est supprimé, et une clé manquante pour le fournisseur choisi n'est plus contournée) ; **démarrage qui échoue vraiment en production** (le premier correctif ne faisait qu'écrire un message : mon affirmation précédente était trop optimiste) ; **`/api/health`** ; **`npm run smoke:ai`**.

## Reste à faire avant d'ouvrir au public

1. **Révoquer et recréer les clés Gemini et Groq** de l'ancienne archive.
2. Lancer `npm run smoke:ai` avec la vraie clé (puis chaque repli voulu) et confirmer les noms de modèles par défaut (`gemini-3.8-flash`, `qwen/qwen3.8-27b`, `grok-4.5` : non vérifiés auprès des fournisseurs).
3. Vérification d'adresse et réinitialisation du mot de passe (service de courriel).
4. Limitation de débit sur `/api/auth/*` et CSP.
5. ~~Migrations dans le build~~ : séparées (étape explicite `npm run db:migrate`, santé `schema`).
6. ~~Sort de `alea/`~~ : supprimé (ADR 0001).
7. Un test navigateur de bout en bout (parcours complet avec interface) : non fait.
8. Moteur : 55 pays au lieu de 172 ; comparaisons de concurrents non re-vérifiées une à une.

## Passe P0 du 24 octobre 2026 (après le déploiement sur Vercel)

- **Connexion « xAI » supprimée du code.** Les boutons « Continuer avec Google/X » passaient par le courtier d'authentification de Grok avec un client de prévisualisation partagé, codé en dur, qui appartient à xAI et ne peut pas fonctionner sur Vercel. Retirés : liste de fournisseurs vide, identifiants partagés effacés de `src/lib/auth/preview.ts`, plus de repli sur le courtier dans `server.ts`, boutons retirés de `login.tsx`. La connexion se fait par e-mail et mot de passe uniquement. Un test (`no-broker.test.ts`) échoue si une adresse du courtier ou un client partagé réapparaît. Vérifié en local sur un vrai PostgreSQL : inscription 200, connexion 200, session lue, l'ancien flux `grok-google` répond 404.
- **Protection contre une base partagée** (cas `axiom-db`). `create table if not exists` ignore sans bruit une table déjà occupée par une autre application. La migration refuse maintenant de s'exécuter au premier passage si une table `user`, `session`, `account`, `verification` ou `voice_quota` existe déjà (contournement explicite : `ALEA_ADOPT_EXISTING_TABLES=1`). Vérifié sur une base simulant un voisin : refus, code de sortie 1.
- **Script de vérification en lecture seule** : `DATABASE_URL=... node scripts/verify-db-schema.mjs` liste les tables, compare les colonnes aux migrations et signale toute table étrangère (code 0 si propre). **À lancer sur la base de production : le résultat n'est pas connu.** Une protection au premier passage ne dit rien sur une base déjà migrée.
- **Dépôt Git.** Les déploiements des quatre autres projets n'ont aucune métadonnée Git, celui d'Aléa en a. Les réglages Git de chaque projet ne sont pas lisibles par l'API utilisée : à confirmer dans Settings, Git, avant tout `git push` sur `axiom-mobile`.
- **Reste de l'échafaudage Grok dans l'exécution** (hors authentification, non retiré) : plugin PWA et pages `/__grok/*`, middleware d'identité de partage, noms de cookies `__Host-grok-auth.*`, adaptateur xAI optionnel. À traiter dans une passe dédiée.
- **Non fait** : vies enregistrées par utilisateur en base (P0.9), rotation des clés, appel Gemini réel.

## Passe du 24 octobre 2026 (2) : décisions du lead, vies par compte, refonte visuelle

Vérifié sur un vrai PostgreSQL 16 (base vide, serveur Node de production) :

- **Rust supprimé** (ADR 0001) et **migrations sorties du build** (ADR 0002) : le build ne touche plus la base (aucune ligne `[migrate]`, base restée vide), `npm run db:migrate` applique les 4 migrations à la demande, `/api/health` renvoie `schema: ok` puis `outdated` si une migration attendue manque.
- **Vies enregistrées par compte** (table `life`, versionnée : `simulation_version`, `world_version`, `seed`, `state`) : enregistrement refusé sans session (Unauthorized), accepté avec session, identifiant invalide refusé, liste correcte pour le propriétaire, **vide pour un autre utilisateur**, suppression de la vie d'autrui sans effet. Synchronisation côté navigateur (`lives-sync.tsx`) vérifiée au typecheck seulement : **pas de test navigateur**.
- **Limitation de débit** en base : 8 essais de connexion par minute et par IP (les 8 premiers 401, ensuite 429), 6 inscriptions par heure ; compteurs en base (valable entre instances serverless).
- **Archives unifiées** : l'accueil, le Mémorial et l'onglet Vies affichent les mêmes trois archives.
- **Refonte visuelle** : opale, orange désert, pourpre mystique ; Fraunces, Hanken Grotesk, JetBrains Mono ; contrastes AA mesurés (`docs/DESIGN-SYSTEM.md`). Rendu non vérifié visuellement ici (pas de navigateur) : à regarder sur l'écran.

Toujours **non fait** : création de la base Neon dédiée (aucun outil du connecteur ne peut la provisionner), rotation des clés, appel Gemini réel, vérification d'adresse et mot de passe oublié (aucun service d'e-mail), connexion Google (exige un client OAuth propre à Aléa), images, audio, 172 pays.
