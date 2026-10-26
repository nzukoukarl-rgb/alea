# ADR 0002 : les migrations de base sont hors du build

**Date** : 24 octobre 2026. **Statut** : acceptée.

## Contexte
`npm run build` appliquait les migrations dès que `DATABASE_URL` était défini. Or Vercel exécute le build pour la production, les aperçus et les reconstructions, et le projet a des variables `DATABASE_URL` pour les trois cibles.

## Décision
Le build produit un artefact et n'a aucun effet externe. Les migrations sont une étape explicite (`npm run db:migrate`, ou l'action GitHub manuelle `Migrate database`), lancée avant le déploiement d'une version qui en apporte une. `/api/health` signale `schema: outdated` quand une migration attendue (`src/lib/schema-version.ts`, synchronisée par test avec `migrations/`) manque. Le migrateur refuse d'adopter des tables existantes au premier passage (base partagée).

## Conséquences
Un déploiement sans sa migration est visible dans la santé au lieu de casser une requête. Le retour arrière applicatif ne défait pas une migration : écrire des migrations additives.
