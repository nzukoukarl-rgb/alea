import { describe, expect, it, vi } from "vitest";
import { narrateWith, type ProviderConfig } from "./chain";

const provider: ProviderConfig = { kind: "gemini", key: "test", model: "gemini-test", base: "https://example.test" };
const request = { kind: "naissance", register: "Une naissance documentée dans un registre de test.", choice: null };

describe("voice queue", () => {
  it("retries a transient failure before succeeding", async () => {
    let calls = 0;
    const fetcher = vi.fn(async () => {
      calls += 1;
      if (calls === 1) throw new DOMException("timed out", "TimeoutError");
      return { status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: '{"prose":"Une phrase.","echo":"Un écho."}' }] } }] }) };
    });
    const result = await narrateWith([provider], request, fetcher);
    expect(result.ok).toBe(true);
    expect(calls).toBe(2);
  });
  it("keeps a provider error explicit", async () => {
    const result = await narrateWith([provider], request, async () => ({ status: 503, json: async () => ({}) }));
    expect(result).toEqual({ ok: false, failure: "provider" });
  });
});
