export type NarrativeRequest = {
  kind: string;
  register: string;
  choice: string | null;
};

export type Narrative = {
  prose: string;
  echo: string;
  provider: string;
};

export type AiFailure =
  | "timeout"
  | "rate"
  | "empty"
  | "malformed"
  | "provider"
  | "refused"
  | "unavailable"
  | "network";

export function userMessage(kind: AiFailure): string {
  switch (kind) {
    case "timeout":
      return "La voix a mis trop de temps. Rien n'a été inventé à sa place. Vous pouvez réessayer.";
    case "rate":
      return "La voix est trop demandée pour le moment. Réessayez dans un instant.";
    case "empty":
      return "La voix a répondu vide. Le registre n'a pas été remplacé. Réessayez.";
    case "malformed":
      return "La voix a répondu dans une forme illisible. Réessayez.";
    case "provider":
      return "La voix n'est pas disponible pour le moment. Le registre, lui, est intact.";
    case "refused":
      return "La voix s'est tue sur ce passage. Le registre reste lisible.";
    case "unavailable":
      return "La voix n'est pas configurée sur ce serveur. Le registre statistique fonctionne quand même.";
    case "network":
      return "La voix est injoignable. Réessayez.";
  }
}

export function promptFor(req: NarrativeRequest): string {
  return (
    "Tu es la voix d'Aléa, un récit de vie en français, au tutoiement, sobre et précis.\n" +
    "Tu n'ajoutes aucun fait, aucun chiffre, aucun proche, aucun pays qui ne figure pas dans le registre.\n" +
    "Pas de scène de violence, pas de détail médical cru, pas de méthode si le registre parle de détresse.\n" +
    "Si le registre dit une mort, tu la nommes en une phrase calme.\n" +
    "Réponds uniquement par un objet JSON avec les clés prose et echo.\n" +
    "prose : 80 à 130 mots. echo : une seule phrase courte.\n" +
    `TYPE: ${req.kind}\n` +
    `CHOIX: ${req.choice ?? "aucun"}\n` +
    `REGISTRE:\n${req.register}\n`
  );
}

function clip(s: string, max: number): string {
  const chars = [...s];
  if (chars.length <= max) return s;
  return chars.slice(0, max).join("") + "…";
}

export function parseVoiceJson(text: string): { prose: string; echo: string } | AiFailure {
  const trimmed = text.trim();
  const withoutFence = trimmed.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  const start = withoutFence.indexOf("{");
  const end = withoutFence.lastIndexOf("}");
  if (start < 0 || end < start) return "malformed";
  let value: unknown;
  try {
    value = JSON.parse(withoutFence.slice(start, end + 1));
  } catch {
    return "malformed";
  }
  if (!value || typeof value !== "object") return "malformed";
  const prose = String((value as { prose?: unknown }).prose ?? "").trim();
  if (!prose) return "empty";
  const echo = String((value as { echo?: unknown }).echo ?? "").trim();
  return { prose: clip(prose, 1600), echo: clip(echo, 280) };
}

export function geminiText(body: unknown): string | AiFailure {
  if (!body || typeof body !== "object") return "malformed";
  const record = body as {
    promptFeedback?: { blockReason?: string };
    candidates?: Array<{ finishReason?: string; content?: { parts?: Array<{ text?: string; thought?: boolean }> } }>;
  };
  if (record.promptFeedback?.blockReason) return "refused";
  const candidate = record.candidates?.[0];
  if (candidate?.finishReason === "SAFETY") return "refused";
  const parts = candidate?.content?.parts;
  if (!parts) return "malformed";
  const text = parts
    .filter((part) => part && !part.thought && typeof part.text === "string")
    .map((part) => part.text)
    .join("");
  if (!text.trim()) return "empty";
  return text;
}

export function openaiText(body: unknown): string | AiFailure {
  if (!body || typeof body !== "object") return "malformed";
  const content = (body as { choices?: Array<{ message?: { content?: unknown } }> }).choices?.[0]?.message?.content;
  if (typeof content !== "string") return content == null ? "empty" : "malformed";
  if (!content.trim()) return "empty";
  return content;
}

export function statusFailure(status: number): AiFailure {
  if (status === 408 || status === 504) return "timeout";
  if (status === 429) return "rate";
  return "provider";
}

const KINDS = new Set(["naissance", "chapitre", "mort"]);

export function validateVoiceInput(input: unknown): NarrativeRequest | string {
  if (!input || typeof input !== "object") return "La demande est illisible.";
  const raw = input as { kind?: unknown; register?: unknown; choice?: unknown };
  const kind = String(raw.kind ?? "").trim().slice(0, 40);
  if (!KINDS.has(kind)) return "Ce passage n'existe pas.";
  const register = String(raw.register ?? "").replace(/\u0000/g, "").trim().slice(0, 4000);
  if (register.length < 20) return "Le registre est trop court pour une voix.";
  const choice =
    raw.choice == null || String(raw.choice).trim() === ""
      ? null
      : String(raw.choice).replace(/\u0000/g, "").trim().slice(0, 120);
  return { kind, register, choice };
}
