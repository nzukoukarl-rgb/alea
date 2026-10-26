import { describe, expect, it, vi } from "vitest";
import { clearRealtimeCache, getRealtimeData, realtimeCacheTtlMs } from "./realtime";

describe("realtime data", () => {
  it("refuses unknown countries explicitly", async () => {
    await expect(getRealtimeData("Atlantis")).rejects.toThrow("unknown-country");
  });
  it("returns a documented fallback when providers are unavailable", async () => {
    clearRealtimeCache();
    const original = globalThis.fetch;
    globalThis.fetch = vi.fn(async () => new Response("offline", { status: 503 }));
    const data = await getRealtimeData("Algeria");
    expect(data.pib).toBeGreaterThan(0);
    expect(data.degraded).toBe(true);
    expect(realtimeCacheTtlMs).toBe(3600000);
    globalThis.fetch = original;
  });
});
