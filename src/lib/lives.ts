import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { MAX_LIVES_PER_USER, validateLifeId, validateLifeInput, type LifeInput } from "./lives-validate.ts";

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
export type SavedLife = { id: string; updatedAt: string; simulationVersion: number; worldVersion: number; state: Json };
export type LivesResult<T> = { ok: true; data: T } | { ok: false; error: string };

const FAIL = "Impossible d'enregistrer pour le moment.";

/** The signed-in user's saved lives, newest first. */
export const listMyLives = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<LivesResult<SavedLife[]>> => {
    try {
      const sql = await getSql();
      const rows = await sql<{ id: string; updated_at: Date; simulation_version: number; world_version: number; state: Json }>`
        select id, updated_at, simulation_version, world_version, state
        from life where user_id = ${context.userId}
        order by updated_at desc limit ${MAX_LIVES_PER_USER}
      `;
      return {
        ok: true,
        data: rows.map((r) => ({
          id: r.id,
          updatedAt: new Date(r.updated_at).toISOString(),
          simulationVersion: r.simulation_version,
          worldVersion: r.world_version,
          state: r.state,
        })),
      };
    } catch (err) {
      console.error("alea lives list", err instanceof Error ? err.name : "error");
      return { ok: false, error: FAIL };
    }
  });

/** Create or update one life for the signed-in user (keeps at most MAX_LIVES_PER_USER). */
export const saveMyLife = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown): LifeInput => {
    const parsed = validateLifeInput(input);
    if ("error" in parsed) throw new Error("invalid");
    return parsed;
  })
  .handler(async ({ data, context }): Promise<LivesResult<{ id: string }>> => {
    try {
      const sql = await getSql();
      await sql`
        insert into life (user_id, id, world_version, simulation_version, seed, alive, age, state)
        values (${context.userId}, ${data.id}, ${data.worldVersion}, ${data.simulationVersion}, ${data.seed},
                ${data.alive}, ${data.age}, ${JSON.stringify(data.state)}::jsonb)
        on conflict (user_id, id) do update set
          world_version = excluded.world_version, simulation_version = excluded.simulation_version,
          seed = excluded.seed, alive = excluded.alive, age = excluded.age,
          state = excluded.state, updated_at = now()
      `;
      await sql`
        delete from life where user_id = ${context.userId} and id in (
          select id from life where user_id = ${context.userId}
          order by updated_at desc offset ${MAX_LIVES_PER_USER}
        )
      `;
      return { ok: true, data: { id: data.id } };
    } catch (err) {
      console.error("alea lives save", err instanceof Error ? err.name : "error");
      return { ok: false, error: FAIL };
    }
  });

export const deleteMyLife = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown): { id: string } => {
    const id = validateLifeId(input);
    if (!id) throw new Error("invalid");
    return { id };
  })
  .handler(async ({ data, context }): Promise<LivesResult<{ id: string }>> => {
    try {
      const sql = await getSql();
      await sql`delete from life where user_id = ${context.userId} and id = ${data.id}`;
      return { ok: true, data: { id: data.id } };
    } catch (err) {
      console.error("alea lives delete", err instanceof Error ? err.name : "error");
      return { ok: false, error: FAIL };
    }
  });
