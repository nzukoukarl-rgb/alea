/**
 * Migrations this build expects to be applied. `/api/health` reports "outdated" when the database
 * has fewer, so a deploy without its migration is visible instead of failing on a user request.
 * A test keeps this list equal to the files in /migrations.
 */
export const EXPECTED_MIGRATIONS = [
  "0001_auth.sql",
  "0002_voice_quota.sql",
  "0003_lives.sql",
  "0004_rate_limit.sql",
] as const;
