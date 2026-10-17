/** Outfit data model — mirrors the PRD 穿搭標記機制 (3.2.1). */

/** 上身基礎層 (single-select, required). */
export const BASE_LAYER = [
  "短袖上衣",
  "背心無袖",
  "長袖上衣",
  "襯衫（單穿）",
  "針織衫（單穿）",
  "帽T衛衣（單穿）",
] as const;
export type BaseLayer = (typeof BASE_LAYER)[number];

/** 外套 / 疊搭層 (single-select, optional — 「不加外套」means none). */
export const OUTER_LAYER = [
  "不加外套",
  "薄外套",
  "連帽外套",
  "厚外套夾克",
  "羽絨外套大衣",
  "防風防水外套",
] as const;
export type OuterLayer = (typeof OUTER_LAYER)[number];

export type OutfitSource = "manual" | "photo_confirmed";

/** DailyOutfitRecord (PRD 資料模型). date is an ISO yyyy-mm-dd string. */
export type DailyOutfitRecord = {
  date: string;
  top: BaseLayer;
  outer: OuterLayer;
  thumbnailRef: string | null;
  source: OutfitSource;
};

/** Compact combo text, e.g. 「長袖上衣 + 薄外套」or「短袖上衣」when no outer. */
export function outfitComboText(record: DailyOutfitRecord | null): string {
  if (!record) return "尚無紀錄";
  if (record.outer === "不加外套") return record.top;
  return `${record.top} + ${record.outer}`;
}

export function todayISO(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** Chip labels for a top+outer combo (「不加外套」collapses to just the top). */
export function comboChips(top: string, outer: string): string[] {
  return outer === "不加外套" ? [top] : [top, outer];
}

export function recordChips(record: DailyOutfitRecord | null): string[] {
  return record ? comboChips(record.top, record.outer) : [];
}
