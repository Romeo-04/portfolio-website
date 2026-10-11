// Once-per-session intro rules (spec station 0). Storage can be blocked
// (private mode), so every access is guarded and the intro defaults to
// playing.

import { resolveHash } from "@/lib/cafe/stations";

export const INTRO_KEY = "cafe-intro-seen";

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

export function shouldPlayIntro(hash: string, storage: StorageLike | null): boolean {
  if (resolveHash(hash)) return false;
  try {
    return storage?.getItem(INTRO_KEY) !== "1";
  } catch {
    return true;
  }
}

export function markIntroSeen(storage: StorageLike | null): void {
  try {
    storage?.setItem(INTRO_KEY, "1");
  } catch {
    // Blocked storage: the intro will simply play again next time.
  }
}
