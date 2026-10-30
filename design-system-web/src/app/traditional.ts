import { S2T_PAIRS } from "./s2tMap";

/** Place names from the geocoder can come back in Simplified Chinese (e.g.
 *  「东京都」); the app only shows Traditional (Taiwan) characters. Converts
 *  character by character with the curated map from scripts/gen-s2t.mjs, which
 *  leaves characters that are valid Traditional (台, 里, 后…) untouched. */
let map: Map<string, string> | null = null;

export function toTraditional(text: string): string {
  if (!map) {
    const chars = [...S2T_PAIRS];
    map = new Map();
    for (let i = 0; i + 1 < chars.length; i += 2) map.set(chars[i], chars[i + 1]);
  }
  const m = map;
  return [...text].map((c) => m.get(c) ?? c).join("");
}
