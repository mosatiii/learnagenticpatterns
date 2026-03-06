import { patterns } from "@/data/patterns";
import { pmModules } from "@/data/pm-curriculum";

const PM_GAME_SLUGS = [
  "pm-ship-or-skip",
  "pm-budget-builder",
  "pm-stakeholder-sim",
];

let _validSlugs: Set<string> | null = null;

/** Returns the complete set of valid pattern + PM module + PM game slugs. */
export function getValidSlugs(): Set<string> {
  if (!_validSlugs) {
    _validSlugs = new Set([
      ...patterns.map((p) => p.slug),
      ...pmModules.map((m) => m.slug),
      ...PM_GAME_SLUGS,
    ]);
  }
  return _validSlugs;
}

export function isValidSlug(slug: string): boolean {
  return getValidSlugs().has(slug);
}
