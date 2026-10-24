/**
 * Fail-fast at server start-up (production only): refuse to boot with a missing database, a weak
 * auth secret or no key for the selected AI provider, instead of failing later on a user request.
 * Auto-registered because vite.config.ts sets `serverDir: "./server"`.
 */
import { definePlugin } from "nitro";
import { bootProblems } from "../../src/lib/boot-check";
import { loadSecrets } from "../../src/lib/ai/secrets.server";

export default definePlugin(() => {
  const problems = bootProblems(process.env, loadSecrets());
  if (problems.length > 0) {
    const message = ["[boot] Refusing to start: invalid production configuration.", ...problems.map((p) => ` - ${p}`)].join("\n");
    console.error(message);
    throw new Error(message);
  }
});
