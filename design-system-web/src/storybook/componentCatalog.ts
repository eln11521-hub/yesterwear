export type ComponentStorybookCategory =
  | "Brand"
  | "Data Display"
  | "Actions"
  | "Selection"
  | "Navigation"
  | "Surfaces"
  | "Widgets";

export type ComponentCompositionRole =
  | "action"
  | "asset"
  | "badge-label"
  | "composite"
  | "control"
  | "data-display"
  | "feedback"
  | "layout"
  | "navigation"
  | "overlay";

export type ComponentDocumentationProvenance =
  | "extracted"
  | "implementation-derived";

type ComponentCatalogSeed = {
  id: string;
  name: string;
  category: ComponentStorybookCategory;
  compositionRole: ComponentCompositionRole;
  provenance: ComponentDocumentationProvenance;
  purpose: string;
  useWhen: readonly string[];
  avoidWhen?: readonly string[];
  dependencies?: readonly string[];
  usedBy?: readonly string[];
  keywords: readonly string[];
};

const componentCatalogSeed = [
  {
    id: "outfit-chip",
    name: "Outfit Chip",
    category: "Selection",
    compositionRole: "control",
    provenance: "extracted",
    purpose:
      "Selectable garment pill (line icon + label) used in the outfit sections and the record-outfit sheet.",
    useWhen: [
      "Letting a user pick or display a clothing item, or showing yesterday's / suggested outfit.",
    ],
    keywords: ["chip", "outfit", "garment", "pill", "select"],
  },
  {
    id: "metric-item",
    name: "Metric Item",
    category: "Data Display",
    compositionRole: "data-display",
    provenance: "extracted",
    purpose:
      "A small label-over-value pair for a single reading (降雨 / 濕度 / 較昨天 / 體感) in the home hero grid.",
    useWhen: [
      "Showing a compact secondary metric beside the main temperature.",
    ],
    keywords: ["metric", "label", "value", "humidity", "rain"],
  },
  {
    id: "weather-icon",
    name: "Weather Icon",
    category: "Data Display",
    compositionRole: "asset",
    provenance: "extracted",
    purpose:
      "The brand's multi-color weather glyph (晴天 / 多雲時晴 / 雨天), rendered as an <img> so its colors survive. Used by the forecast rows, the hero condition line, and the widgets.",
    useWhen: [
      "Showing a weather condition (sun / partly / rain) as an icon.",
    ],
    keywords: ["weather", "icon", "sun", "rain", "cloud", "condition"],
  },
  {
    id: "commute-row",
    name: "Commute Row",
    category: "Data Display",
    compositionRole: "data-display",
    provenance: "extracted",
    purpose:
      "A commute time slot (出門 / 下班) showing the temperature and a small delta vs. yesterday, flat and un-carded.",
    useWhen: [
      "Listing the morning and evening commute temperatures under 通勤時段溫度.",
    ],
    keywords: ["commute", "temperature", "delta", "time"],
  },
  {
    id: "secondary-button",
    name: "Secondary Button",
    category: "Actions",
    compositionRole: "action",
    provenance: "extracted",
    purpose:
      "Outlined pill action with an optional line icon (e.g. 拍照記錄), lower emphasis than the primary CTA.",
    useWhen: [
      "Offering a secondary action alongside the primary button, such as taking a photo.",
    ],
    keywords: ["button", "secondary", "outline", "action"],
  },
  {
    id: "primary-button",
    name: "Primary Button",
    category: "Actions",
    compositionRole: "action",
    provenance: "extracted",
    purpose:
      "The primary call-to-action: ink-filled pill, white label, optional line icon (記錄今天穿搭 / 儲存今日紀錄).",
    useWhen: [
      "Triggering the single most important action on a screen or sheet.",
    ],
    keywords: ["button", "cta", "primary", "action"],
  },
  {
    id: "forecast-row",
    name: "Forecast Row",
    category: "Data Display",
    compositionRole: "data-display",
    provenance: "extracted",
    purpose:
      "A day in the weekly forecast: day label, weather icon, low temp, temperature range bar, high temp.",
    useWhen: ["Listing the coming days under 未來一週天氣."],
    keywords: ["forecast", "weather", "temperature", "range", "row"],
  },
  {
    id: "hourly-forecast",
    name: "Hourly Forecast",
    category: "Data Display",
    compositionRole: "data-display",
    provenance: "implementation-derived",
    purpose:
      "Today's hours as a horizontally scrolling strip: time, weather icon, feels-like temperature, rain % when wet; the current hour is dotted and labeled 現在, commute hours tagged 出門 / 下班.",
    useWhen: ["Showing 今天各時段溫度 under the Home CTA."],
    keywords: ["hourly", "today", "weather", "temperature", "timeline"],
  },
  {
    id: "floating-nav",
    name: "Floating Nav",
    category: "Navigation",
    compositionRole: "navigation",
    provenance: "extracted",
    purpose:
      "Detached floating bottom navigation pill; active tab is an ink rounded-rect with icon + label.",
    useWhen: ["Providing top-level app navigation (天氣 / 設定)."],
    keywords: ["nav", "navigation", "tab", "bottom", "floating"],
  },
  {
    id: "mascot",
    name: "Mascot",
    category: "Brand",
    compositionRole: "asset",
    provenance: "extracted",
    purpose:
      "The brand mascot illustration shown at the top of the home screen. Raster asset exported from Figma.",
    useWhen: ["Branding the home header or empty/promo surfaces."],
    keywords: ["mascot", "brand", "illustration", "logo"],
  },
  {
    id: "section-badge",
    name: "Section Badge",
    category: "Data Display",
    compositionRole: "badge-label",
    provenance: "extracted",
    purpose:
      "Small status badge next to a section label (必選 warm / 可選 neutral). Source: Figma 226:3150.",
    useWhen: ["Marking a section as required or optional."],
    keywords: ["badge", "label", "required", "optional", "status"],
  },
  {
    id: "top-bar",
    name: "Top Bar",
    category: "Navigation",
    compositionRole: "layout",
    provenance: "extracted",
    purpose:
      "Home header: location + date on the left, refresh / menu actions on the right. Source: Figma 174:7.",
    useWhen: ["Anchoring the top of the home screen."],
    keywords: ["header", "top bar", "location", "date"],
  },
  {
    id: "widget-promo-card",
    name: "Widget Promo Card",
    category: "Surfaces",
    compositionRole: "composite",
    provenance: "extracted",
    purpose:
      "Warm promo banner prompting the user to add the widget, with a trailing action arrow. Source: Figma 174:200.",
    useWhen: ["Promoting the home-screen widget at the bottom of the feed."],
    keywords: ["promo", "banner", "widget", "card"],
  },
  {
    id: "lock-widget",
    name: "Lock Widget",
    category: "Widgets",
    compositionRole: "data-display",
    provenance: "extracted",
    purpose:
      "Lock Screen 2×1 widget: glassy white-on-tint card with temp, delta, 昨日穿搭, and commute. Source: Figma 173:2940.",
    useWhen: ["Showing the day's comparison at a glance on the lock screen."],
    keywords: ["widget", "lock", "glass", "weather"],
  },
  {
    id: "home-widget-medium",
    name: "Home Widget (Medium)",
    category: "Widgets",
    compositionRole: "data-display",
    provenance: "extracted",
    purpose:
      "Home Screen 4×2 widget: white card with the 兔子與太陽 mascot, big temp, a delta-state pill, and 昨日穿搭. Source: Figma 216:2.",
    useWhen: ["Showing the comparison + yesterday outfit on the home screen."],
    keywords: ["widget", "home", "mascot", "weather", "medium"],
  },
  {
    id: "home-widget-small",
    name: "Home Widget (Small)",
    category: "Widgets",
    compositionRole: "data-display",
    provenance: "extracted",
    purpose:
      "Home Screen 2×2 widget: condensed 體感-first card with big temp, a delta-state pill, 昨日穿搭 chips, and 出門/下班 — same design language as the 4×2. Source: Figma 424:10.",
    useWhen: ["Showing today's 體感 + comparison at a glance on the home screen."],
    keywords: ["widget", "home", "weather", "small", "2x2"],
  },
] as const satisfies readonly ComponentCatalogSeed[];

export type ComponentCatalogId = string;

export type ComponentCatalogEntry = Omit<ComponentCatalogSeed, "id"> & {
  designSystemDoc: string;
  id: string;
  productPath: string;
  storyPath: string;
  storyTitle: string;
};

export const componentCategoryOrder = [
  "Widgets",
  "Brand",
  "Data Display",
  "Selection",
  "Actions",
  "Navigation",
  "Surfaces",
] as const satisfies readonly ComponentStorybookCategory[];

function toPascalCase(value: string): string {
  return value.replace(/[^A-Za-z0-9]+/g, "");
}

export const componentCatalogEntries = componentCatalogSeed.map((entry) => ({
  ...entry,
  designSystemDoc: `design-system/components/${entry.id}.md`,
  productPath: `src/components/${entry.id}`,
  storyPath: `src/components/${entry.id}/${toPascalCase(entry.name)}.stories.tsx`,
  storyTitle: `Components/${entry.category}/${entry.name}`,
})) satisfies readonly ComponentCatalogEntry[];

export const componentCatalog = componentCatalogEntries.reduce(
  (catalog, entry) => {
    catalog[entry.id] = entry;
    return catalog;
  },
  {} as Record<string, ComponentCatalogEntry>,
);

function toTitleCase(value: string): string {
  return value
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join(" ");
}

function createFallbackCatalogEntry(id: string): ComponentCatalogEntry {
  const name = toTitleCase(id) || "Legacy Component";

  return {
    id,
    name,
    category: "Data Display",
    compositionRole: "composite",
    provenance: "implementation-derived",
    purpose:
      "Compatibility metadata for a component story that is outside the neutral template catalog.",
    useWhen: [
      "A reference story remains in the repository but is not part of the default template surface.",
    ],
    keywords: [id, "reference"],
    designSystemDoc: `design-system/components/${id}.md`,
    productPath: `src/components/${id}`,
    storyPath: `src/components/${id}/${toPascalCase(name)}.stories.tsx`,
    storyTitle: `Components/Data Display/${name}`,
  };
}

export function getComponentCatalogEntry(
  id: ComponentCatalogId,
): ComponentCatalogEntry {
  return componentCatalog[id] ?? createFallbackCatalogEntry(id);
}

export function getComponentStoryParameters(id: ComponentCatalogId) {
  const entry = getComponentCatalogEntry(id);

  return {
    ai: {
      componentId: entry.id,
      compositionRole: entry.compositionRole,
      dependencies: entry.dependencies ?? [],
      designSystemDoc: entry.designSystemDoc,
      keywords: entry.keywords,
      name: entry.name,
      productPath: entry.productPath,
      provenance: entry.provenance,
      purpose: entry.purpose,
      storyPath: entry.storyPath,
      storybookCategory: entry.category,
      storybookTitle: entry.storyTitle,
      useWhen: entry.useWhen,
      avoidWhen: entry.avoidWhen ?? [],
      usedBy: entry.usedBy ?? [],
    },
    componentCatalog: entry,
  };
}
