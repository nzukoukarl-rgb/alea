# Déploiement

## Prérequis communs

1. Une base **Postgres** (Neon, Supabase, etc.) et son `DATABASE_URL`.
2. Un secret d'authentification : `openssl rand -hex 32` → `BETTER_AUTH_SECRET`.
3. L'URL publique : `SITE_URL`, `VITE_SITE_URL` et `BETTER_AUTH_URL` (même valeur, avec `https://`).
4. Au moins une clé IA (`GEMINI_API_KEY` par défaut).
5. Les variables `VITE_*` sont lues **au build** : les définir avant `npm run build`.

## Option A : Vercel (par défaut, vérifié)

Importer le dépôt, définir les variables ci-dessus dans le tableau de bord, déployer. `vercel.json` installe sans devDependencies ; le build a été vérifié avec cette commande. Le build n'applique plus de migrations : lancer `npm run db:migrate` une fois par nouvelle base, puis à chaque migration ajoutée.

## Option B : serveur Node / Docker (build vérifié, serveur non testé avec une vraie base)

```bash
npm ci
NITRO_PRESET=node-server SITE_URL=https://… VITE_SITE_URL=https://… npm run build
DATABASE_URL=… BETTER_AUTH_SECRET=… BETTER_AUTH_URL=https://… PORT=3000 node .output/server/index.mjs
```

En production, ce serveur **refuse de démarrer** (plugin `server/plugins/boot-check.ts`, message explicite, sans valeur de secret) si `DATABASE_URL` est absent, si `BETTER_AUTH_SECRET` fait moins de 32 caractères, ou si la clé du fournisseur IA choisi manque (`ALLOW_START_WITHOUT_AI=1` pour passer outre). Placer un proxy HTTPS (Caddy, Nginx) devant.

Migrations : **le build ne touche plus jamais à la base.** Les migrations sont une étape explicite, à lancer AVANT de déployer une version qui en apporte une nouvelle : `DATABASE_URL='postgres://…' npm run db:migrate` (ou l'action GitHub « Migrate database », lancement manuel avec le secret `DATABASE_URL`). `GET /api/health` renvoie `schema: "outdated"` et 503 tant qu'une migration attendue manque, ce qui rend l'oubli visible. Sur une base partagée, la migration refuse de démarrer (voir `docs/SECURITY.md`).

## Liste de contrôle avant ouverture

- [ ] **Clés révoquées puis recréées** (voir `docs/PRODUCTION-AUDIT.md`, point 1).
- [ ] `npm run ci` vert.
- [ ] `npm run smoke:ai` réussi avec la vraie clé de production (et avec chaque fournisseur de repli listé).
- [ ] `GET /api/health` renvoie 200 sur le déploiement.
- [ ] Variables de production définies ; `BETTER_AUTH_SECRET` identique sur toutes les instances.
- [ ] Inscription par courriel testée en production (voir limites d'authentification dans `docs/SECURITY.md`).
- [ ] `https://votre-domaine/sitemap.xml` et `/robots.txt` affichent des URLs absolues à votre domaine.
- [ ] Une voix IA générée de bout en bout avec la vraie clé ; quotas du fournisseur vérifiés.
- [ ] Noms de modèles par défaut vérifiés chez chaque fournisseur (`*_MODEL`).
- [ ] Sauvegardes de la base et alerte sur les erreurs 5xx.
