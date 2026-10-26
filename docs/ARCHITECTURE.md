# Aléa — architecture

Aléa est une simulation de naissance. Le tirage et les paliers tournent dans le navigateur. La voix, seule, part sur le serveur.

## Modules

- `src/lib/sim/countries.ts` — 55 pays, poids de naissances, ordres de grandeur publics.
- `src/lib/sim/engine.ts` — tirage, jauges, paliers, registre. Aucune phrase littéraire ici.
- `src/lib/ai/parse.ts` — validation, JSON de la voix, messages montrés à la personne.
- `src/lib/ai/chain.ts` — Gemini, OpenRouter, Groq, et xAI derrière la même fonction `narrateWith`.
- `src/lib/ai/secrets.server.ts` — lit l'environnement, puis `.grok/server-secrets.json` (ignoré par git), puis des valeurs par défaut sans clé (`bundled-secrets.server.ts`).
- `src/lib/ai/voice.ts` — fonction serveur `narrateVoice`, session exigée, plafond de 24 voix par jour.
- `src/lib/compare.ts` — pages `/compare`.
- `src/lib/seo.ts` — sitemap et robots absolus, métadonnées Open Graph et canonical (`SITE_URL`).
- `src/lib/store.ts` — vies et mémorial dans le navigateur.
- `src/routes/` — pages, `sitemap.xml`, `robots.txt`, `/api/auth`.

## Fournisseurs

`AI_PROVIDER` choisit le premier (défaut `gemini`). S'il échoue, l'ordre est OpenRouter, puis Groq, puis Gemini, sans doublon. xAI n'entre dans la chaîne que s'il est le fournisseur choisi. Une clé absente est sautée. Une clé vide ne compte pas.

Variables : `GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `GROQ_API_KEY`, `XAI_API_KEY`, `AI_PROVIDER`, `GEMINI_MODEL`, `GEMINI_MODELS` (liste séparée par des virgules), `GROQ_MODEL`, `OPENROUTER_MODEL`, `XAI_MODEL`, et les `*_BASE_URL` correspondants.

Ajouter un fournisseur : étendre `ProviderKind`, `fallbackKinds` si besoin, et une branche dans `narrateWith` qui renvoie `{ prose, echo }` ou un échec de `parse.ts`. Ne jamais renvoyer le corps d'erreur brut.

## Erreurs

Délai, quota, réponse vide, JSON illisible, statut HTTP, refus, absence de clé, réseau : chacun a une phrase fixe. Le serveur journalise un nom, pas la clé, pas le corps.

## Tests

`npm test` (= `test:app`) lance 80 tests : moteur, adaptateurs IA et repli, SEO, garde anti-fuite de clés. Les tests de l'échafaudage sont à part (`npm run test:platform`).
