# Aléa

Simulation de vie : naître au hasard parmi les bébés d'aujourd'hui, vivre jusqu'au bout. Le moteur statistique décide des faits ; un modèle d'IA n'écrit que la voix. Aléa n'est pas le site officiel de « 1 sur 8 milliards ».

## Pile

TanStack Start (React 19) + Nitro, Better Auth, Postgres (PGLite embarqué en développement seulement), Tailwind 4. Node 22.
Décision d'architecture : TypeScript est la seule pile (`docs/adr/0001-typescript-stack.md`).

## Démarrage rapide

```bash
npm ci
cp .env.example .env     # puis renseigner les clés (jamais dans le code)
npm run dev              # http://localhost:8080
```

| Commande | Rôle |
| --- | --- |
| `npm test` (= `test:app`) | tests du moteur, des adaptateurs IA, du SEO et garde anti-fuite de clés |
| `npm run typecheck` | TypeScript strict |
| `npm run build` | build de production (sans toucher à la base) |
| `npm run db:migrate` | applique les migrations, étape explicite (voir `docs/DEPLOYMENT.md`) |
| `npm run verify:db` | contrôle en lecture seule de la base (tables, colonnes, tables étrangères) |
| `npm run smoke:ai` | appelle réellement le fournisseur configuré (clé requise), code de sortie 0 seulement si une narration revient |
| `npm run ci` | typecheck + tests + build, comme la CI GitHub |
| `npm run test:platform` | tests des scripts de l'échafaudage Grok (13 échecs connus : assertions sur les réglages d'origine du modèle, voir `docs/PRODUCTION-AUDIT.md`) |

## Variables d'environnement

Voir `.env.example`. Contrôle de santé : `GET /api/health` (200 si base et IA prêtes, 503 sinon, sans aucun secret). Obligatoires en production (le serveur refuse de démarrer sinon) : `DATABASE_URL`, `BETTER_AUTH_SECRET` (32 caractères ou plus), `BETTER_AUTH_URL`, `SITE_URL`, `VITE_SITE_URL`, et la clé du fournisseur IA choisi.

## Fournisseurs IA

Politique déterministe, définie dans `planProviders()` (`src/lib/ai/chain.ts`) :

- `AI_PROVIDER` (défaut `gemini`) choisit **le** fournisseur. Sa clé est obligatoire : si elle manque, la voix est indisponible et le serveur de production refuse de démarrer (sauf `ALLOW_START_WITHOUT_AI=1`). Aucun autre fournisseur n'est substitué en silence.
- `AI_FALLBACK_PROVIDERS` (liste séparée par des virgules, **vide par défaut**) active un repli explicite, essayé dans l'ordre après un échec. Un repli inconnu ou sans clé est ignoré avec un avertissement.
- Les appels restent côté serveur. Preuve avec une vraie clé : `npm run smoke:ai`.

## Documentation

- `docs/DEPLOYMENT.md` : déployer sur Vercel ou sur un serveur Node, liste de contrôle avant ouverture.
- `docs/SECURITY.md` : secrets, en-têtes, authentification, limites connues.
- `docs/PRODUCTION-AUDIT.md` : ce qui a été trouvé et corrigé, ce qui reste à faire.
- `docs/ARCHITECTURE.md` : modules et ajout d'un fournisseur.
- `docs/ORIGIN-NOTES.md` : notes de conception et relevé du site d'origine.
- `docs/DESIGN-SYSTEM.md` : palette, typographie et contrastes vérifiés.
- `docs/adr/` : décisions d'architecture.
