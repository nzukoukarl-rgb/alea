/**
 * Non-secret defaults for the AI providers (server-only).
 *
 * API keys must NEVER be written in this file or anywhere in the repository.
 * Provide them through real environment variables (see `.env.example`) or the
 * git-ignored `.grok/server-secrets.json`. `loadSecrets()` reads them in that
 * order and skips any empty value.
 *
 * Model names below are only defaults: override them with `*_MODEL` variables
 * and check them against each provider's current model list before launch.
 */
export const bundledSecrets = {
  AI_PROVIDER: "gemini",
  AI_FALLBACK_PROVIDERS: "",
  GEMINI_API_KEY: "",
  OPENROUTER_API_KEY: "",
  GROQ_API_KEY: "",
  GEMINI_MODEL: "gemini-3.8-flash",
  GEMINI_MODELS: "gemini-3.8-flash,gemini-3.5-flash,gemini-flash-latest",
  GROQ_MODEL: "qwen/qwen3.8-27b",
  OPENROUTER_MODEL: "meta-llama/llama-3.3-70b-instruct:free",
  XAI_MODEL: "grok-4.5",
} as const;
