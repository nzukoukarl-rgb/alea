import { readFileSync } from "node:fs";
import { join } from "node:path";
import { bundledSecrets } from "./bundled-secrets.server.ts";

export type SecretBag = {
  AI_PROVIDER?: string;
  AI_FALLBACK_PROVIDERS?: string;
  GEMINI_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  GROQ_API_KEY?: string;
  XAI_API_KEY?: string;
  GEMINI_MODEL?: string;
  GEMINI_MODELS?: string;
  GROQ_MODEL?: string;
  OPENROUTER_MODEL?: string;
  XAI_MODEL?: string;
  GEMINI_BASE_URL?: string;
  OPENROUTER_BASE_URL?: string;
  GROQ_BASE_URL?: string;
  XAI_BASE_URL?: string;
};

function fromFile(): SecretBag {
  try {
    const parsed = JSON.parse(readFileSync(join(process.cwd(), ".grok", "server-secrets.json"), "utf8")) as SecretBag;
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    /* the bundled copy remains */
  }
  return {};
}

/** Server-only. A real environment variable wins, then the secret file, then the bundled copy. */
export function loadSecrets(): SecretBag {
  const file = fromFile() as Record<string, string | undefined>;
  const packed = bundledSecrets as Record<string, string | undefined>;
  const names = [
    "AI_PROVIDER",
    "AI_FALLBACK_PROVIDERS",
    "GEMINI_API_KEY",
    "OPENROUTER_API_KEY",
    "GROQ_API_KEY",
    "GEMINI_MODEL",
    "GEMINI_MODELS",
    "GROQ_MODEL",
    "OPENROUTER_MODEL",
    "XAI_MODEL",
    "GEMINI_BASE_URL",
    "OPENROUTER_BASE_URL",
    "GROQ_BASE_URL",
    "XAI_BASE_URL",
  ] as const;
  const out: SecretBag = {};
  for (const name of names) {
    const env = process.env[name]?.trim();
    const fileValue = file[name]?.trim();
    const packedValue = packed[name]?.trim();
    const value = env || fileValue || packedValue;
    if (value) out[name] = value;
  }
  const xai = process.env.XAI_API_KEY?.trim();
  if (xai) out.XAI_API_KEY = xai;
  return out;
}
