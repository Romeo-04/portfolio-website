// ============================================================
// LOYALTY CARD
// ============================================================
// One stamp per station the visitor reaches (spec section 4). Stamps are
// kept in journey order and saved in localStorage; storage can be blocked
// or hold garbage, so nothing here throws.
// ============================================================

import type { StorageLike } from "@/lib/cafe/intro";
import { STATIONS, type StationId } from "@/lib/cafe/stations";

export const STAMPS_KEY = "cafe-stamps";

const ORDER = STATIONS.map((s) => s.id);

function inJourneyOrder(ids: Iterable<StationId>): StationId[] {
  const set = new Set(ids);
  return ORDER.filter((id) => set.has(id));
}

export function parseStamps(raw: string | null): StationId[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return inJourneyOrder(value.filter((v): v is StationId => ORDER.includes(v as StationId)));
  } catch {
    return [];
  }
}

export function addStamp(stamps: StationId[], id: StationId): StationId[] {
  if (stamps.includes(id)) return stamps;
  return inJourneyOrder([...stamps, id]);
}

export function isComplete(stamps: StationId[]): boolean {
  return ORDER.every((id) => stamps.includes(id));
}

export function loadStamps(storage: StorageLike | null): StationId[] {
  try {
    return parseStamps(storage?.getItem(STAMPS_KEY) ?? null);
  } catch {
    return [];
  }
}

export function saveStamps(storage: StorageLike | null, stamps: StationId[]): void {
  try {
    storage?.setItem(STAMPS_KEY, JSON.stringify(stamps));
  } catch {
    // Blocked storage: the card resets next visit, nothing else breaks.
  }
}
