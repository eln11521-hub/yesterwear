---
name: metric-block
description: Displays a metric as title/value/subtitle triplet (e.g., "今日體感 / 31° / 出門時段基準")
metadata:
  type: component (display)
  category: typography/data-display
  status: extracted
---

# MetricBlock（指標區塊）

## Purpose（目的）

顯示一個具有標籤、數值和副標題的指標三元組。用於展示天氣對比資訊（今日體感溫度、昨日實際溫度、濕度等）。此組件是純顯示性的（display-only），不包含交互。

---

## Evidence（證據）

| Evidence ID | Source | Location | Notes |
|---|---|---|---|
| E001 | DashboardView.swift | lines 85–90 (comparison function) | Live implementation; used in metric cards within weather summary |
| E002 | Reference screenshot | weather app main screen | Shows "今日體感 / 31° / 出門時段基準" layout in card context |

---

## Component Fingerprint（組件指紋）

| Dimension | Description |
|---|---|
| **Purpose** | Display a single metric with context (label, large value, supporting text) |
| **Behavior** | Display-only; no interaction or state changes |
| **Composition role** | Reusable text composition pattern for metric display |
| **Anatomy** | VStack: title (uppercase label) / value (prominent number) / optional subtitle (supporting text) |
| **Variants** | None (single use case); may have variant with/without subtitle |
| **States** | default (only state); no interactive states |
| **Token contract** | sys-type-caption (title), sys-type-title (value), sys-text-secondary/primary (colors) |
| **Layout** | Vertical stack, max-width fill, leading alignment, 4pt gaps |
| **Density** | Compact (tight line spacing) |
| **Visual reference** | [comparison metric cards in DashboardView] |
| **Native platform** | SwiftUI VStack + Text views |
| **Similar components** | None identified in this system |

---

## Anatomy（解剖）

```
┌─────────────────────────┐
│ 今日體感 [title]        │  ← uppercase, 10pt, weight 600, secondary color, letter-spacing +1.2pt
│ 31°      [value]        │  ← 22pt, weight 600, primary color
│ 出門時段基準 [subtitle] │  ← 12pt, weight 500, secondary color (optional)
└─────────────────────────┘
```

**Slots:**
- **title** — uppercase label (semantic metric name)
- **value** — primary data value (usually number with unit)
- **subtitle** — optional supporting context (time window, qualifier)

**Spacing:**
- gap between title and value: 4pt
- gap between value and subtitle: 2pt (if subtitle present)
- left padding when in container: inherited from parent

---

## Variants（變體）

| Variant | Usage | Difference |
|---------|-------|-----------|
| with subtitle | most common | all three slots visible |
| without subtitle | rare | title + value only |

---

## States（狀態）

This is a display-only component. All states are **not applicable** for interaction.

| State | Appearance | Notes |
|-------|-----------|-------|
| **default** | as shown above | only state |
| hover | not applicable | no interaction |
| pressed | not applicable | no interaction |
| disabled | not applicable | no interaction |
| focus | not applicable | no interaction |

**Responsive behavior:**
- **Mobile (390px):** full width, leading alignment
- **Tablet (768px+):** may be in row within container, width constrained or flex-equal

---

## Token Contract（代碼契約）

| Component Token | System Token | Purpose | State |
|---|---|---|---|
| `comp-metric-label` | `sys-type-caption` | title text style (12pt, semibold) | default |
| `comp-metric-label-color` | `sys-text-secondary` | label text color (secondary gray) | default |
| `comp-metric-value` | `sys-type-title` | value text style (22pt, semibold) | default |
| `comp-metric-value-color` | `sys-text-primary` | value text color (ink) | default |
| `comp-metric-subtitle` | `sys-type-caption` | subtitle text style | default |
| `comp-metric-subtitle-color` | `sys-text-secondary` | subtitle color (secondary gray) | default |
| `comp-metric-gap-tight` | `sys-spacing-xs` (4pt) | gap between title and value | default |
| `comp-metric-gap-small` | `sys-spacing-xs` (4pt) | gap between value and subtitle | default |

**Uppercase transformation:**
- `comp-metric-label-transform: uppercase` with letter-spacing `+1.2pt`

---

## Layout Rules（佈局規則）

| Rule | Value | Rationale |
|------|-------|-----------|
| **Direction** | Vertical (VStack) | Stacked text hierarchy |
| **Alignment** | Leading (left) | Align with card edge |
| **Slot order** | title → value → subtitle | Read top-to-bottom |
| **Max width** | `.infinity` (fill container) | Flex to parent card width |
| **Padding** | inherited from parent | No internal padding; card handles it |
| **Gap (title–value)** | `sys-spacing-xs` (4pt) | Micro gap |
| **Gap (value–subtitle)** | `sys-spacing-xs` (4pt) | Micro gap |
| **Line breaks** | title may wrap (rare), value is single line number, subtitle may wrap | Based on content length |
| **Responsive** | On mobile, use full card width; on tablet, may be 1/3 width in 3-column row | Adapt to container width |

---

## Content Rules（內容規則）

| Slot | Format | Example | Notes |
|------|--------|---------|-------|
| **title** | uppercase metric name | "今日體感" "昨日實際" "濕度" | Semantic label; transform to uppercase in component |
| **value** | number + optional unit | "31°" "28°" "65%" | Usually numeric; may be text label |
| **subtitle** | context, time, or qualifier | "出門時段基準" "當前" "上班時間" | Optional; explains the value context |

**Length constraints:**
- title: 4–8 characters (after uppercase)
- value: 1–5 characters (number + unit)
- subtitle: 6–12 characters

**Localization:**
- Titles are Chinese labels; should be translatable
- Numbers are locale-independent (use system number formatting)
- Subtitle is descriptive text, translatable

---

## Accessibility Rules（無障礙規則）

| Rule | Implementation |
|------|---|
| **Color not only meaning** | ✓ Text hierarchy (size, weight) carries meaning, not color alone |
| **Contrast** | ✓ All text meets WCAG AA (4.5:1) over default backgrounds |
| **Hit target** | N/A (no interactive elements) |
| **Text size** | ✓ minimum 10pt (caption); meets accessible text size |
| **Font scaling** | ✓ SwiftUI dynamic type can scale based on system settings |
| **Screen reader** | Read as: "今日體感。31度。出門時段基準。" (title, value, subtitle in order) |

---

## Do / Don't（做法與禁忌）

### Do ✓

- Use for displaying weather metrics, outfit stats, forecast data
- Keep values numeric or very short text
- Ensure subtitle provides helpful context (not redundant to title)
- Place within card containers with consistent padding
- Use appropriate font sizes from type scale
- Let subtitle be optional (don't force it)

### Don't ✗

- Don't use for interactive content (use a button instead)
- Don't hardcode colors (use token references)
- Don't use arbitrary font sizes (snap to scale)
- Don't use value for descriptive text (keep it brief/numeric)
- Don't add more than 3 text slots
- Don't use outside of card or container context

---

## Implementation Notes（實作註記）

### SwiftUI Implementation

```swift
struct MetricBlock: View {
    let title: String
    let value: String
    let subtitle: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title.uppercased())
                .font(YWTokens.Type.caption)  // was: YWTypography.caption
                .tracking(1.2)
                .foregroundStyle(YWTokens.Text.secondary)  // was: .secondary
            Text(value)
                .font(YWTokens.Type.title)    // was: YWTypography.title
                .foregroundStyle(YWTokens.Text.primary)    // was: hardcoded hex
            if let subtitle {
                Text(subtitle)
                    .font(YWTokens.Type.caption)
                    .foregroundStyle(YWTokens.Text.secondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
```

### Current Implementation File

**File:** `YesterdayWeather/Views/Components/MetricBlock.swift`  
**Lines:** full component (lines 3–25)  
**Status:** ✓ Implemented; refactor needed to use token enums

### Preview / Tests

Add to Xcode Previews:

```swift
#Preview {
    VStack(spacing: 16) {
        MetricBlock(
            title: "今日體感",
            value: "31°",
            subtitle: "出門時段基準"
        )
        MetricBlock(
            title: "昨日實際",
            value: "28°",
            subtitle: "08:00"
        )
        MetricBlock(
            title: "濕度",
            value: "65%",
            subtitle: "當前"
        )
    }
    .padding(16)
}
```

### Refactoring Checklist

- [ ] Replace `YWTypography` references with `YWTokens.Type.*`
- [ ] Replace `.secondary` foreground with `YWTokens.Text.secondary`
- [ ] Replace `Color(hex: ...)` with token references
- [ ] Add `.tracking(1.2)` to all `title` (uppercase) text slots
- [ ] Verify letter-spacing in SwiftUI (use `.tracking()` modifier)
- [ ] Test on light and dark mode (when dark mode tokens added)
- [ ] Ensure dynamic type scaling works (test with larger font size preference)

### Responsive Behavior

- **Mobile (390px):** Component fills container width, leading alignment
- **Tablet (768px+):** Can be placed in 3-column row (flex: 1/3 each) or full-width depending on context

### Related Components

- **Related to:** DashboardView (uses MetricBlock in comparison card)
- **Used in:** metric comparison cards, forecast detail rows, stat displays
- **Pairs with:** CommuteDeltaCard (similar height/rhythm in layouts)

---

## Token Changes（代碼變更）

When updating `Shared/DesignTokens.swift`:

```swift
enum YWTokens {
  enum Type {
    // Typography scale
    static let caption = Font.system(size: 12, weight: .medium, design: .rounded)
    static let title = Font.system(size: 22, weight: .semibold, design: .rounded)
    // ... more types
  }
  
  enum Text {
    static let primary = Color(hex: 0x111)
    static let secondary = Color(hex: 0x666)
  }
}
```

Then refactor component to use `YWTokens.Type.caption` instead of `YWTypography.caption`.
