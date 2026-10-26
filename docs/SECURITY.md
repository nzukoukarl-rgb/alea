# Sécurité

- **Secrets** : jamais dans le dépôt. Ordre de lecture : variables d'environnement, puis `.grok/server-secrets.json` (ignoré par git), puis valeurs par défaut sans clé. Le test `src/lib/ai/no-secrets.test.ts` échoue si une clé de fournisseur apparaît dans un fichier du dépôt.
- **Politique de fournisseur** : `AI_PROVIDER` décide, jamais de substitution silencieuse ; repli seulement via `AI_FALLBACK_PROVIDERS` (vide par défaut), car changer de modèle en cours de route change le ton et le format du récit.
- **Appels IA** : uniquement côté serveur (`narrateVoice`), session obligatoire, plafond de 24 voix par utilisateur et par jour, erreurs à phrase fixe sans corps brut.
- **Authentification** : Better Auth, e-mail et mot de passe uniquement (aucun courtier tiers). En production avec base de données, `BETTER_AUTH_SECRET` est obligatoire (32 caractères ou plus) : le serveur refuse de démarrer sinon (contrôle au boot, vérifié).
- **En-têtes** : `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` sur toutes les routes (builds Nitro).
- **Non fait volontairement** : pas de `Content-Security-Policy` ni de `frame-ancestors`, car l'application injecte des scripts en ligne (hydratation, chrome PWA) et peut être intégrée dans un aperçu. À ajouter avec des nonces si l'intégration n'est plus nécessaire.
- **Limites connues** :
  - la connexion par courriel et mot de passe est activée, mais **sans vérification d'adresse ni réinitialisation du mot de passe** (aucun service d'envoi de courriel n'est configuré) : un mot de passe oublié n'est pas récupérable ;
  - pas de limitation de débit par IP sur `/api/auth/*` : à placer au niveau du proxy ou du CDN ;
  - la connexion fédérée héritée de l'échafaudage Grok dépend d'un courtier externe (`GROK_AUTH_*`) ; son fonctionnement hors de cette plateforme n'a pas été vérifié.
- **Base partagée** : la migration refuse d'adopter des tables existantes au premier passage ; `scripts/verify-db-schema.mjs` contrôle une base en lecture seule.
