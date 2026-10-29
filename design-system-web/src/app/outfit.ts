/** Outfit data model — mirrors the PRD 穿搭標記機制 (3.2.1). Every layer is
 *  multi-select; 上身 needs at least one item, the rest may be empty. */

/** 上身 (multi-select, required ≥ 1 — e.g. 背心 + 襯衫 layered). */
export const TOP_LAYER = [
  "短袖上衣",
  "背心無袖",
  "Polo衫",
  "長袖上衣",
  "襯衫",
  "針織衫",
  "帽T衛衣",
  "高領毛衣",
  "發熱衣",
] as const;
export type TopItem = (typeof TOP_LAYER)[number];

/** 外套 / 疊搭 (multi-select, optional — empty = 不加外套). Light → heavy. */
export const OUTER_LAYER = [
  "薄外套",
  "連帽外套",
  "西裝外套",
  "鋪棉背心",
  "厚外套夾克",
  "毛呢大衣",
  "羽絨外套",
  "防風防水外套",
] as const;
export type OuterItem = (typeof OUTER_LAYER)[number];

/** 下身 (multi-select, optional). */
export const BOTTOM_LAYER = ["短褲", "短裙", "長裙", "長褲", "牛仔褲", "保暖褲"] as const;
export type BottomItem = (typeof BOTTOM_LAYER)[number];

/** 配件 (multi-select, optional). */
export const ACCESSORY_LAYER = ["帽子", "毛帽", "圍巾", "手套", "雨傘", "墨鏡"] as const;
export type AccessoryItem = (typeof ACCESSORY_LAYER)[number];

/** The four groups of the record sheet, in display order. */
export const OUTFIT_GROUPS = [
  { key: "tops", label: "上身", required: true, items: TOP_LAYER },
  { key: "outers", label: "外套 / 疊搭", required: false, items: OUTER_LAYER },
  { key: "bottoms", label: "下身", required: false, items: BOTTOM_LAYER },
  { key: "accessories", label: "配件", required: false, items: ACCESSORY_LAYER },
] as const;

export type OutfitPicks = {
  tops: string[];
  outers: string[];
  bottoms: string[];
  accessories: string[];
};

export const EMPTY_PICKS: OutfitPicks = { tops: [], outers: [], bottoms: [], accessories: [] };

export type OutfitSource = "manual" | "photo_confirmed";

/** DailyOutfitRecord (PRD 資料模型). date is an ISO yyyy-mm-dd string. */
export type DailyOutfitRecord = OutfitPicks & {
  date: string;
  thumbnailRef: string | null;
  source: OutfitSource;
};

/** Labels renamed when the sheet went multi-select (「單穿」no longer means anything). */
const RENAMED: Record<string, string> = {
  "襯衫（單穿）": "襯衫",
  "針織衫（單穿）": "針織衫",
  "帽T衛衣（單穿）": "帽T衛衣",
  羽絨外套大衣: "羽絨外套",
};

/** Upgrade a stored record from the single-select `{top, outer}` shape. */
export function migrateRecord(raw: unknown): DailyOutfitRecord | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<DailyOutfitRecord> & { top?: string; outer?: string };
  const fix = (xs: string[]) => xs.map((x) => RENAMED[x] ?? x);
  const tops = fix(r.tops ?? (r.top ? [r.top] : []));
  if (!r.date || !tops.length) return null;
  const outers = fix(r.outers ?? (r.outer && r.outer !== "不加外套" ? [r.outer] : []));
  return {
    date: r.date,
    tops,
    outers,
    bottoms: r.bottoms ?? [],
    accessories: r.accessories ?? [],
    thumbnailRef: r.thumbnailRef ?? null,
    source: r.source ?? "manual",
  };
}

export function todayISO(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** Every picked label, in group order (上身 → 外套 → 下身 → 配件). */
export function outfitChips(picks: OutfitPicks | null): string[] {
  return picks ? [...picks.tops, ...picks.outers, ...picks.bottoms, ...picks.accessories] : [];
}

/** Compact combo text, e.g. 「長袖上衣 + 薄外套 + 長褲」. */
export function outfitComboText(picks: OutfitPicks | null): string {
  const chips = outfitChips(picks);
  return chips.length ? chips.join(" + ") : "尚無紀錄";
}

/** The two chips a widget has room for: the main top + the outermost layer. */
export function keyChips(picks: OutfitPicks | null): string[] {
  if (!picks) return [];
  const top = picks.tops[0];
  const outer = heaviest(picks.outers);
  return [top, outer].filter((x): x is string => Boolean(x));
}

/** The warmest outer layer picked (OUTER_LAYER is ordered light → heavy). */
export function heaviest(outers: string[]): string | undefined {
  return [...outers].sort(
    (a, b) =>
      OUTER_LAYER.indexOf(a as OuterItem) - OUTER_LAYER.indexOf(b as OuterItem),
  )[outers.length - 1];
}
