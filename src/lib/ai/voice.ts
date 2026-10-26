import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { narrateWith, planProviders } from "./chain.ts";
import { userMessage, validateVoiceInput } from "./parse.ts";

const CAP = 24;

export type VoiceResult =
  | { ok: true; prose: string; echo: string; provider: string }
  | { ok: false; error: string };

export const narrateVoice = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown): { kind: string; register: string; choice: string | null } => {
    const parsed = validateVoiceInput(input);
    if (typeof parsed === "string") {
      const error = new Error(parsed);
      throw error;
    }
    return parsed;
  })
  .handler(async ({ data, context }): Promise<VoiceResult> => {
    try {
      const { loadSecrets } = await import("./secrets.server");
      const secrets = loadSecrets();
      const plan = planProviders(secrets);
      for (const warning of plan.warnings) console.warn("alea ai config:", warning);
      if (!plan.ready) {
        console.error("alea ai config:", plan.issues.join(" "));
        return { ok: false, error: userMessage("unavailable") };
      }
      const providers = plan.providers;
      const day = new Date().toISOString().slice(0, 10);
      const sql = await getSql();
      const rows = await sql<{ used: number }>`
        select used from voice_quota where user_id = ${context.userId} and day = ${day}
      `;
      const used = Number(rows[0]?.used ?? 0);
      if (used >= CAP) {
        return { ok: false, error: "Le registre a déjà assez parlé aujourd'hui. Revenez demain, ou lisez ce qui est écrit." };
      }
      const result = await narrateWith(providers, data);
      if (!result.ok) return { ok: false, error: userMessage(result.failure) };
      await sql`
        insert into voice_quota (user_id, day, used)
        values (${context.userId}, ${day}, 1)
        on conflict (user_id, day) do update set used = voice_quota.used + 1
      `;
      return {
        ok: true,
        prose: result.narrative.prose,
        echo: result.narrative.echo,
        provider: result.narrative.provider,
      };
    } catch (err) {
      console.error("alea voice", err instanceof Error ? err.name : "error");
      return { ok: false, error: userMessage("provider") };
    }
  });
