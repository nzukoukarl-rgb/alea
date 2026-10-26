/**
 * Pure helpers that protect a SHARED Postgres database from silent table collisions.
 *
 * `create table if not exists "user"` silently does nothing when another application already owns
 * a `user` table, leaving this app talking to a schema that is not its own. These helpers let the
 * migrator and the verification script detect that instead of trusting `if not exists`.
 */

/**
 * Tables this app's migrations create, parsed from the SQL text: { table: [columns] }.
 * @param {string[]} sqlTexts
 * @returns {Record<string, string[]>}
 */
export function expectedSchema(sqlTexts) {
  /** @type {Record<string, string[]>} */
  const out = {};
  const re = /create\s+table\s+if\s+not\s+exists\s+"?([A-Za-z_][\w]*)"?\s*\(([\s\S]*?)\n\)\s*;/gi;
  for (const sql of sqlTexts) {
    let m;
    while ((m = re.exec(sql))) {
      /** @type {string[]} */
      const cols = [];
      for (const raw of m[2].split("\n")) {
        const line = raw.trim().replace(/^--.*$/, "");
        const c = /^"?([A-Za-z_][\w]*)"?\s+(?:text|integer|bigint|boolean|timestamptz|timestamp|uuid|jsonb|date|serial|varchar|numeric|int)\b/i.exec(line);
        if (c) cols.push(c[1]);
      }
      out[m[1]] = cols;
    }
  }
  return out;
}

/**
 * On a first run (no migration recorded yet), any table of ours that already exists belongs to
 * someone else. Returns their names so the caller can refuse to continue.
 * @param {string[]} ownTables
 * @param {string[]} existingTables
 * @param {string[]} appliedMigrations
 * @returns {string[]}
 */
export function preExistingConflicts(ownTables, existingTables, appliedMigrations) {
  if (appliedMigrations.length > 0) return [];
  const existing = new Set(existingTables);
  return ownTables.filter((t) => existing.has(t));
}

/**
 * Compare the live columns with what the migrations declare.
 * liveColumns: { table: [columns] }. Returns { missingTables, missingColumns: {table: [..]}, foreignTables }.
 * @param {Record<string, string[]>} expected
 * @param {Record<string, string[]>} liveColumns
 * @param {string[]} [ignore]
 */
export function compareSchema(expected, liveColumns, ignore = ["_migrations"]) {
  /** @type {string[]} */
  const missingTables = [];
  /** @type {Record<string, string[]>} */
  const missingColumns = {};
  for (const [table, cols] of Object.entries(expected)) {
    const live = liveColumns[table];
    if (!live) {
      missingTables.push(table);
      continue;
    }
    const absent = cols.filter((c) => !live.includes(c));
    if (absent.length) missingColumns[table] = absent;
  }
  const foreignTables = Object.keys(liveColumns).filter((t) => !(t in expected) && !ignore.includes(t));
  return { missingTables, missingColumns, foreignTables };
}
