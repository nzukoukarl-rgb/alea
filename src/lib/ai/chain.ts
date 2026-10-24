import {
  geminiText,
  openaiText,
  parseVoiceJson,
  promptFor,
  statusFailure,
  type AiFailure,
  type Narrative,
  type NarrativeRequest,
} from "./parse.ts";

export type ProviderKind = "gemini" | "openrouter" | "groq" | "xai";

export type ProviderConfig = {
  kind: ProviderKind;
  key: string;
  model: string;
  base: string;
  /** Extra Gemini model names tried before leaving this provider. */
  models?: string[];
};

export const PROVIDER_KINDS: ProviderKind[] = ["gemini", "openrouter", "groq", "xai"];

export type AiEnv = Record<string, string | undefined>;

export type AiPlan = {
  /** The provider selected by AI_PROVIDER (default gemini), or null when the value is unknown. */
  primary: ProviderKind | null;
  /** Explicit fallbacks from AI_FALLBACK_PROVIDERS that are actually usable. Empty by default. */
  fallbacks: ProviderKind[];
  /** Providers to call, in order: the primary, then the usable fallbacks. */
  providers: ProviderConfig[];
  /** Fatal configuration problems. Names only: never a key or a value. */
  issues: string[];
  /** Non-fatal problems (a fallback that is unknown or has no key). */
  warnings: string[];
  ready: boolean;
};

const KEY_NAME: Record<ProviderKind, string> = {
  gemini: "GEMINI_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
  groq: "GROQ_API_KEY",
  xai: "XAI_API_KEY",
};

const isKind = (v: string): v is ProviderKind => (PROVIDER_KINDS as string[]).includes(v);

function specFor(kind: ProviderKind, env: AiEnv): ProviderConfig | null {
  const key = env[KEY_NAME[kind]]?.trim();
  if (!key) return null;
  const models = (env.GEMINI_MODELS || "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  switch (kind) {
    case "gemini":
      return {
        kind,
        key,
        model: env.GEMINI_MODEL?.trim() || "gemini-3.8-flash",
        base: env.GEMINI_BASE_URL?.trim() || "https://generativelanguage.googleapis.com",
        models,
      };
    case "openrouter":
      return {
        kind,
        key,
        model: env.OPENROUTER_MODEL?.trim() || "meta-llama/llama-3.3-70b-instruct:free",
        base: env.OPENROUTER_BASE_URL?.trim() || "https://openrouter.ai/api/v1",
      };
    case "groq":
      return {
        kind,
        key,
        model: env.GROQ_MODEL?.trim() || "qwen/qwen3.8-27b",
        base: env.GROQ_BASE_URL?.trim() || "https://api.groq.com/openai/v1",
      };
    case "xai":
      return {
        kind,
        key,
        model: env.XAI_MODEL?.trim() || "grok-4.5",
        base: env.XAI_BASE_URL?.trim() || "https://api.x.ai/v1",
      };
  }
}

/**
 * Deterministic provider policy.
 * - AI_PROVIDER picks the one provider (default gemini). Its key is required: when it is missing the
 *   plan is not ready. No other provider is ever substituted silently.
 * - AI_FALLBACK_PROVIDERS is an optional, explicit, comma-separated list tried in order after a failure.
 *   It is empty by default, so a narrative never changes voice unless you asked for it.
 */
export function planProviders(env: AiEnv): AiPlan {
  const issues: string[] = [];
  const warnings: string[] = [];
  const raw = (env.AI_PROVIDER || "gemini").trim().toLowerCase();
  if (!isKind(raw)) {
    issues.push("AI_PROVIDER is not one of gemini, openrouter, groq, xai.");
    return { primary: null, fallbacks: [], providers: [], issues, warnings, ready: false };
  }
  const primary = specFor(raw, env);
  if (!primary) {
    issues.push(`${KEY_NAME[raw]} is missing but AI_PROVIDER=${raw}.`);
    return { primary: raw, fallbacks: [], providers: [], issues, warnings, ready: false };
  }
  const providers: ProviderConfig[] = [primary];
  const fallbacks: ProviderKind[] = [];
  for (const item of (env.AI_FALLBACK_PROVIDERS || "").split(",")) {
    const name = item.trim().toLowerCase();
    if (!name || name === raw || fallbacks.includes(name as ProviderKind)) continue;
    if (!isKind(name)) {
      warnings.push("AI_FALLBACK_PROVIDERS contains an unknown provider name; it is ignored.");
      continue;
    }
    const spec = specFor(name, env);
    if (!spec) {
      warnings.push(`${KEY_NAME[name]} is missing, so fallback ${name} is ignored.`);
      continue;
    }
    providers.push(spec);
    fallbacks.push(name);
  }
  return { primary: raw, fallbacks, providers, issues, warnings, ready: true };
}

type FetchLike = (url: string, init: RequestInit) => Promise<{ status: number; json: () => Promise<unknown> }>;

const TIMEOUT_MS = 18_000;

export async function narrateWith(
  providers: ProviderConfig[],
  req: NarrativeRequest,
  fetchImpl: FetchLike = defaultFetch,
): Promise<{ ok: true; narrative: Narrative } | { ok: false; failure: AiFailure }> {
  if (providers.length === 0) return { ok: false, failure: "unavailable" };
  let last: AiFailure = "unavailable";
  for (let i = 0; i < providers.length; i++) {
    const result = await callProvider(providers[i]!, req, fetchImpl);
    if (result.ok) return result;
    last = result.failure;
    if (last === "unavailable") break;
  }
  return { ok: false, failure: last };
}

async function callProvider(
  provider: ProviderConfig,
  req: NarrativeRequest,
  fetchImpl: FetchLike,
): Promise<{ ok: true; narrative: Narrative } | { ok: false; failure: AiFailure }> {
  if (provider.kind === "gemini") {
    const models = [provider.model, ...(provider.models ?? [])].filter((m, i, a) => m && a.indexOf(m) === i);
    let last: AiFailure = "provider";
    for (const model of models) {
      const result = await callGemini({ ...provider, model }, req, fetchImpl);
      if (result.ok) return result;
      last = result.failure;
      if (last === "timeout" || last === "network" || last === "rate" || last === "refused") return result;
    }
    return { ok: false, failure: last };
  }
  return callChat(provider, req, fetchImpl);
}

async function callGemini(
  provider: ProviderConfig,
  req: NarrativeRequest,
  fetchImpl: FetchLike,
): Promise<{ ok: true; narrative: Narrative } | { ok: false; failure: AiFailure }> {
  const base = provider.base.replace(/\/$/, "");
  const url = `${base}/v1beta/models/${provider.model}:generateContent`;
  let response: { status: number; json: () => Promise<unknown> };
  try {
    response = await fetchImpl(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": provider.key,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: promptFor(req) }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });
  } catch (err) {
    return { ok: false, failure: err instanceof Error && err.name === "TimeoutError" ? "timeout" : "network" };
  }
  if (response.status !== 200) return { ok: false, failure: statusFailure(response.status) };
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return { ok: false, failure: "malformed" };
  }
  const text = geminiText(body);
  if (typeof text !== "string") return { ok: false, failure: text };
  const parsed = parseVoiceJson(text);
  if (typeof parsed === "string") return { ok: false, failure: parsed };
  return { ok: true, narrative: { ...parsed, provider: "gemini" } };
}

async function callChat(
  provider: ProviderConfig,
  req: NarrativeRequest,
  fetchImpl: FetchLike,
): Promise<{ ok: true; narrative: Narrative } | { ok: false; failure: AiFailure }> {
  const base = provider.base.replace(/\/$/, "");
  const headers: Record<string, string> = {
    "content-type": "application/json",
    authorization: `Bearer ${provider.key}`,
  };
  if (provider.kind === "openrouter") {
    headers["HTTP-Referer"] = "https://alea.local";
    headers["X-Title"] = "Alea";
  }
  let response: { status: number; json: () => Promise<unknown> };
  try {
    response = await fetchImpl(`${base}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: provider.model,
        temperature: 0.7,
        max_tokens: 700,
        messages: [
          { role: "system", content: 'Tu réponds uniquement en JSON {"prose","echo"}.' },
          { role: "user", content: promptFor(req) },
        ],
      }),
    });
  } catch (err) {
    return { ok: false, failure: err instanceof Error && err.name === "TimeoutError" ? "timeout" : "network" };
  }
  if (response.status !== 200) return { ok: false, failure: statusFailure(response.status) };
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return { ok: false, failure: "malformed" };
  }
  const text = openaiText(body);
  if (typeof text !== "string") return { ok: false, failure: text };
  const parsed = parseVoiceJson(text);
  if (typeof parsed === "string") return { ok: false, failure: parsed };
  return { ok: true, narrative: { ...parsed, provider: provider.kind } };
}

async function defaultFetch(url: string, init: RequestInit) {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
  return { status: response.status, json: () => response.json() as Promise<unknown> };
}

export function geminiEndpoint(base: string, model: string): string {
  return `${base.replace(/\/$/, "")}/v1beta/models/${model}:generateContent`;
}
