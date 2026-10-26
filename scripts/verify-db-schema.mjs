#!/usr/bin/env node
/**
 * Read-only check of the database named by DATABASE_URL (Gate: database isolation).
 * Writes nothing. Prints table names, column mismatches and row counts only, never row contents.
 *
 *   DATABASE_URL='postgres://...' node scripts/verify-db-schema.mjs
 *
 * Exit code 0: only this app's tables are present and match. 1: mismatch or foreign tables.
 * 2: cannot connect.
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { compareSchema, expectedSchema } from "./schema-guard.mjs";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(2);
}
const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "migrations");
const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
const expected = expectedSchema(await Promise.all(files.map((f) => readFile(join(dir, f), "utf8"))));

const pool = new pg.Pool({ connectionString: url, max: 1 });
try {
  const cols = await pool.query(
    // pg_catalog (not information_schema): it also lists tables this role cannot read, which is exactly
    // what a shared database looks like.
    `select c.relname as table_name, a.attname as column_name
       from pg_class c join pg_namespace n on n.oid = c.relnamespace
       join pg_attribute a on a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
      where n.nspname = 'public' and c.relkind = 'r' order by c.relname, a.attnum`,
  );
  const live = {};
  for (const r of cols.rows) (live[r.table_name] ??= []).push(r.column_name);
  const result = compareSchema(expected, live);
  let applied = [];
  try {
    applied = (await pool.query("select name from _migrations order by name")).rows.map((r) => r.name);
  } catch {
    /* no _migrations table */
  }
  console.log("Tables in public:", Object.keys(live).sort().join(", ") || "(none)");
  console.log("Migrations recorded:", applied.join(", ") || "(none)");
  for (const t of Object.keys(expected)) {
    if (!live[t]) continue;
    try {
      const n = (await pool.query(`select count(*)::int as n from "${t}"`)).rows[0].n;
      console.log(`  ${t}: ${n} row(s)`);
    } catch {
      console.log(`  ${t}: not readable by this role`);
    }
  }
  let bad = false;
  if (result.missingTables.length) { bad = true; console.log("MISSING tables:", result.missingTables.join(", ")); }
  for (const [t, c] of Object.entries(result.missingColumns)) { bad = true; console.log(`COLUMN MISMATCH in ${t}: missing ${c.join(", ")}`); }
  if (result.foreignTables.length) { bad = true; console.log("FOREIGN tables (not created by this app):", result.foreignTables.join(", ")); }
  console.log(bad ? "RESULT: NOT CLEAN. This database is shared or inconsistent. Use a dedicated database." : "RESULT: CLEAN. Only this app's tables, columns match.");
  process.exitCode = bad ? 1 : 0;
} catch (err) {
  console.error("Cannot read the database:", err instanceof Error ? err.message.split("\n")[0] : "unknown error");
  process.exitCode = 2;
} finally {
  await pool.end();
}
