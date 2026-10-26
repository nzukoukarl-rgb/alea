import { useEffect, useRef } from "react";
import { authClient, authEnabled } from "@/lib/auth/client";
import { listMyLives, saveMyLife } from "@/lib/lives";
import type { LifeState } from "@/lib/sim/engine";
import { useAlea } from "@/lib/store";

/**
 * Keeps the signed-in user's lives in the database. Signed out, lives stay in this browser only.
 * - On sign-in: lives that exist on the server and not here are pulled; local lives are pushed.
 * - Afterwards: every changed life is pushed (debounced). Network failures are ignored and retried
 *   on the next change, so the game never blocks on the server.
 */
export function LivesSync() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const synced = useRef(new Map<string, string>());

  useEffect(() => {
    if (!authEnabled || !userId) {
      synced.current.clear();
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const push = async (life: LifeState) => {
      if (life.id.startsWith("archive-")) return;
      const fingerprint = JSON.stringify(life);
      if (synced.current.get(life.id) === fingerprint) return;
      try {
        const res = await saveMyLife({ data: { life } as never });
        if (res.ok) synced.current.set(life.id, fingerprint);
      } catch {
        /* offline or signed out: retried on the next change */
      }
    };
    const pushAll = () => {
      for (const life of useAlea.getState().lives) void push(life);
    };

    void (async () => {
      try {
        const res = await listMyLives();
        if (cancelled || !res.ok) return;
        const localIds = new Set(useAlea.getState().lives.map((l) => l.id));
        for (const saved of res.data) {
          synced.current.set(saved.id, JSON.stringify(saved.state));
          if (!localIds.has(saved.id)) useAlea.getState().saveLife(saved.state as unknown as LifeState);
        }
      } catch {
        /* keep local lives */
      }
      if (!cancelled) pushAll();
    })();

    const unsubscribe = useAlea.subscribe(() => {
      clearTimeout(timer);
      timer = setTimeout(pushAll, 1500);
    });
    return () => {
      cancelled = true;
      clearTimeout(timer);
      unsubscribe();
    };
  }, [userId]);

  return null;
}
