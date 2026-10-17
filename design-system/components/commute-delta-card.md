---
name: commute-delta-card
description: Card showing time slot, temperature delta, and comparison temps with optional rain hint
metadata:
  type: component (card/data)
  category: weather-data
  status: extracted
---

# CommuteDeltaCard（通勤溫差卡）

## Purpose（目的）

顯示一個特定時間段的溫度變化卡片，包含出門/下班時間、溫度差（今 vs 昨）、以及選擇性的雨具提示。此組件是自成一體的卡片容器，具有背景、邊框和陰影。

---

## Evidence（證據）

| Evidence ID | Source | Location | Notes |
|---|---|---|---|
| E001 | MetricBlock.swift | lines 27–63 (CommuteDeltaCard struct) | Live implementation in DashboardView.commute() |
| E002 | Reference screenshot | weather app—commute section | Shows "出門 08:00 / +3.2° / 今 31° · 昨 28° 攜帶雨具" layout |

---

## Component Fingerprint（組件指紋）

| Dimension | Description |
|---|---|
| **Purpose** | Display temperature delta for a time slot with supporting context |
| **Behavior** | Display-only; no interaction (may become selectable in future) |
| **Composition role** | Reusable weather-data card, central to outfit recommendation logic |
| **Anatomy** | Card container: header (title + rain hint) / body (delta icon + delta value + comparison temps) |
| **Variants** | 3 delta states (cooler/neutral/warmer); rain hint shown/hidden |
| **States** | default (no rain), rainy (rain hint visible), and future: loading, error (not implemented) |
| **Token contract** | TempDeltaState colors, type scale, surface tokens, radius, spacing, border |
| **Layout** | 2-row card: header HStack / body HStack with mixed alignment |
| **Density** | Compact; 16px padding, 8px internal gaps |
| **Visual reference** | [commute cards in DashboardView.commute()] |
| **Native platform** | SwiftUI VStack/HStack + Text + Image |
| **Similar components** | MetricBlock (similar card aesthetic); differs in content structure |

---

## Anatomy（解剖）

```
┌─────────────────────────────────────────────────┐
│ 出門 08:00              [↓ 攜帶雨具]            │ ← header row
├─────────────────────────────────────────────────┤
│ ↓ +3.2°        今 31° · 昨 28°                 │ ← body row
└─────────────────────────────────────────────────┘
```

**Header row:**
- left: slot title + hour (e.g., "出門 08:00")
- right: rain hint (optional emoji + text, e.g., "☔ 攜帶雨具")
- HStack with Spacer between

**Body row:**
- left: delta icon (arrow down/equal/up) + delta value (e.g., "+3.2°")
- right: comparison temps (e.g., "今 31° · 昨 28°")
- HStack with firstTextBaseline alignment, 8pt gap

**Card container:**
- 16pt padding all sides
- 20pt corner radius
- white background with 0.72 opacity (translucent over delta gradient)
- 1pt colored border with 0.35 opacity (color from TempDeltaState.primary)

---

## Variants（變體）

| Variant | Trigger | Appearance | Usage |
|---------|---------|-----------|-------|
| **cooler delta** | delta ≤ -3°C | blue icon + blue border, label "降溫" | cold morning/evening |
| **neutral delta** | -3°C < delta < 3°C | gray icon + gray border, label "持平" | no major change |
| **warmer delta** | delta ≥ 3°C | orange icon + orange border, label "升溫" | warm morning/evening |
| **with rain hint** | `rainHint == true` | "☔ 攜帶雨具" shown in header | rain expected during time slot |
| **without rain** | `rainHint == false` | rain hint hidden | no rain |

---

## States（狀態）

| State | Appearance | Implemented | Notes |
|-------|-----------|---|---|
| **default** | as shown above | ✓ | no rain hint |
| **rainy** | "☔ 攜帶雨具" shown | ✓ | rain hint visible in header |
| **loading** | placeholder temps | ✗ | future: skeleton shimmer or dash `--` for temps |
| **error** | error message | ✗ | future: fallback text on load failure |
| hover/pressed | not applicable for iOS | N/A | SwiftUI native tap feedback (if selectable) |

---

## Token Contract（代碼契約）

| Component Token | System Token | Purpose | State |
|---|---|---|---|
| `comp-delta-card-container-bg` | `sys-surface-white` at opacity `sys-opacity-card-overlay` (0.72) | card background, translucent | default |
| `comp-delta-card-container-border` | `sys-delta-*` (color from TempDeltaState.primary) | border color responding to delta state | cooler/neutral/warmer |
| `comp-delta-card-container-border-opacity` | `sys-opacity-subtle` (0.35) | border opacity for softness | default |
| `comp-delta-card-container-radius` | `sys-radius-lg` (20px) | corner radius | default |
| `comp-delta-card-container-padding` | `sys-spacing-lg` (16px) | internal padding on all sides | default |
| `comp-delta-card-title-text` | `sys-type-body` | header left text style (16pt, medium) | default |
| `comp-delta-card-title-color` | `sys-text-primary` | title text color (ink) | default |
| `comp-delta-card-hint-text` | `sys-type-caption` | rain hint text style (12pt, medium) | rainy |
| `comp-delta-card-hint-color` | `sys-text-secondary` | hint text color (secondary) | rainy |
| `comp-delta-card-delta-icon` | `sys-icon-md` (20pt) | delta state icon size | default |
| `comp-delta-card-delta-icon-color` | `sys-delta-*` (from TempDeltaState.primary) | icon color matches border | cooler/neutral/warmer |
| `comp-delta-card-delta-value-text` | `sys-type-title` (22pt, semibold) | delta value text style (e.g., "+3.2°") | default |
| `comp-delta-card-delta-value-color` | `sys-text-primary` | delta value color (ink) | default |
| `comp-delta-card-comparison-temps-text` | `sys-type-caption` (12pt, medium) | comparison temps text style | default |
| `comp-delta-card-comparison-temps-color` | `sys-text-secondary` | comparison text color (secondary) | default |
| `comp-delta-card-gap-internal` | `sys-spacing-sm` (8pt) | gap between icon and value, between elements in body | default |
| `comp-delta-card-gap-header-body` | (implicit) | gap between header and body rows | default |

**State token mapping:**
```
TempDeltaState.cooler  → sys-delta-cold (#5A7A94)
TempDeltaState.neutral → sys-delta-neutral (#9E9E9E)
TempDeltaState.warmer  → sys-delta-warm (#E8A44A)
```

---

## Layout Rules（佈局規則）

| Rule | Value | Notes |
|------|-------|-------|
| **Container direction** | Vertical (VStack) | header row → body row |
| **Container alignment** | leading (left) | align content to left edge |
| **Container gap** | `sys-spacing-sm` (8pt) | gap between header and body rows |
| **Header direction** | Horizontal (HStack) | title → Spacer → rain hint |
| **Header alignment** | center (vertical) | vertically centered |
| **Body direction** | Horizontal (HStack) | icon+delta → comparison temps |
| **Body alignment** | `.firstTextBaseline` | align text baselines for visual unity |
| **Body gap** | `sys-spacing-sm` (8pt) | gap between icon+delta and comparison temps |
| **Padding** | `sys-spacing-lg` (16pt) | all sides of card container |
| **Max width** | `.infinity` (fill) | full width within scroll/container |
| **Radius** | `sys-radius-lg` (20px) | card corner radius |
| **Line count (body)** | 1 line | no wrapping in horizontal layout |
| **Responsive** | full width on mobile; may be constrained on tablet if in grid | adapt to parent width |

---

## Content Rules（內容規則）

| Slot | Format | Example | Constraints |
|------|--------|---------|-------------|
| **Title (left, header)** | time slot + hour | "出門 08:00" "下班 18:00" | 6–12 chars; Locale-specific times |
| **Rain hint (right, header)** | emoji + text | "☔ 攜帶雨具" | shown only if `rainHint == true` |
| **Delta icon (left, body)** | SF Symbol or line icon | arrow.down / "↓" | from TempDeltaState.symbol (to be replaced with lucide line icon) |
| **Delta value (center-left, body)** | sign + number + unit | "+3.2°" "-1.5°" "+0.0°" | number formatted with ±1 decimal place, °C unit |
| **Comparison temps (right, body)** | "今 X° · 昨 Y°" | "今 31° · 昨 28°" | both as integers, punctuation "·" separator |

**Localization:**
- Time labels ("出門", "下班") are Chinese; translatable
- Rain hint ("攜帶雨具") is Chinese; translatable
- Numbers use system locale formatting (°C is standard)

---

## Accessibility Rules（無障礙規則）

| Rule | Implementation |
|---|---|
| **Color + text meaning** | ✓ Icon + color conveys delta state; text label redundantly confirms ("降溫" / "持平" / "升溫") |
| **Contrast** | ✓ Text over white/light background meets WCAG AA; colored icon over card background passes |
| **Hit target** | N/A (display-only currently); if made selectable, hit area ≥44pt height (card already ~56pt) |
| **Text size** | ✓ body (16pt) and caption (12pt) are accessible sizes |
| **Font scaling** | ✓ SwiftUI dynamic type can scale; use `relative(.large)` if needed |
| **Screen reader** | Read as: "出門 08:00。溫度升溫，正三點二度。今天三十一度、昨天二十八度。攜帶雨具。" |
| **Icon only risk** | ⚠️ Icon is supported by text; not icon-only (delta value + state label support meaning) |

---

## Do / Don't（做法與禁忌）

### Do ✓

- Use for displaying time-slot weather (commute, work, home)
- Keep delta value to 1 decimal place (±X.X°)
- Show rain hint only when probability/confidence is high
- Place within scrollable list or VStack of multiple CommuteDeltaCards
- Use the correct TempDeltaState icon for delta range
- Ensure translatable text is in string resources (localization-ready)

### Don't ✗

- Don't use hardcoded colors (use TempDeltaState.primary)
- Don't use emoji (replace with lucide line icon per [[design-direction]])
- Don't show rain hint if `rainHint == false` (control visibility)
- Don't truncate comparison temps (both today and yesterday should be visible)
- Don't use for single-value display (use MetricBlock instead)
- Don't add interactive affordances without clear action handler

---

## Implementation Notes（實作註記）

### SwiftUI Implementation

**Current file:** `YesterdayWeather/Views/Components/MetricBlock.swift` (lines 27–63)

```swift
struct CommuteDeltaCard: View {
    let title: String
    let slot: SlotCompare  // contains delta, temps, rainHint

    var body: some View {
        let state = TempDeltaState.from(deltaCelsius: slot.delta)
        VStack(alignment: .leading, spacing: 8) {
            // Header row
            HStack {
                Text(title)
                    .font(YWTokens.Type.body)          // was: YWTypography.body
                    .foregroundStyle(YWTokens.Text.primary)
                Spacer()
                if slot.rainHint {
                    Text("☔ 攜帶雨具")                  // TODO: replace emoji with icon
                        .font(YWTokens.Type.caption)
                        .foregroundStyle(YWTokens.Text.secondary)
                }
            }
            // Body row
            HStack(alignment: .firstTextBaseline, spacing: 8) {
                Image(systemName: state.symbol)         // TODO: replace with lucide line icon
                    .font(.system(size: 20, weight: .medium))
                    .foregroundStyle(state.primary)     // uses TempDeltaState.primary (outdated color!)
                Text(String(format: "%+.1f°", slot.delta))
                    .font(YWTokens.Type.title)
                    .foregroundStyle(YWTokens.Text.primary)
                Spacer()
                Text("今 \(Int(slot.todayApparent.rounded()))° · 昨 \(Int(slot.yesterdayTemp.rounded()))°")
                    .font(YWTokens.Type.caption)
                    .foregroundStyle(YWTokens.Text.secondary)
            }
        }
        .padding(16)                                    // sys-spacing-lg
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)  // sys-radius-lg
                .fill(Color.white.opacity(0.72))        // sys-surface-white + sys-opacity-card-overlay
        )
        .overlay(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .strokeBorder(state.primary.opacity(0.35), lineWidth: 1)
        )
    }
}
```

### Refactoring Checklist

- [ ] Replace `YWTypography` with `YWTokens.Type.*`
- [ ] Replace emoji "☔" with lucide `umbrella` or similar line icon
- [ ] Replace SF Symbol `state.symbol` with lucide `arrow-down` / `minus` / `arrow-up` (or custom bundled icons)
- [ ] Update `state.primary` color values in TempDeltaState enum (#4A90E2 → #5A7A94, #F5A623 → #E8A44A)
- [ ] Replace hardcoded hex `Color(hex: 0xXXXXXX)` with token references
- [ ] Replace `.opacity(0.72)` with `sys-opacity-card-overlay` token
- [ ] Replace `.opacity(0.35)` with `sys-opacity-subtle` token
- [ ] Test all three delta states (cooler, neutral, warmer)
- [ ] Test with and without rain hint
- [ ] Verify responsive layout on tablet (full-width vs. constrained)
- [ ] Add SwiftUI Preview with multiple card variants
- [ ] Test dynamic type scaling (larger/smaller font sizes)

### Responsive Behavior

- **Mobile (390px):** full width within VStack, padding inherited
- **Tablet (768px+):** can be 1/2 or 1/3 width if in row layout; adjust padding accordingly

### Related Components

- **Uses:** TempDeltaState enum (for color/icon/label)
- **Used in:** DashboardView.commute() section, similar to MetricBlock in density
- **Pairs with:** DeltaAtmosphere (background matches gradient color scheme)

### Data Model

Expects `SlotCompare` type with:
```swift
struct SlotCompare {
    var delta: Double             // temperature difference today - yesterday
    var todayApparent: Double     // "feels like" temperature today
    var yesterdayTemp: Double     // actual temperature yesterday
    var rainHint: Bool            // whether to show rain warning
    var hourLabel: String         // "08:00", "18:00"
}
```

### Testing

Add to Xcode Previews:

```swift
#Preview {
    VStack(spacing: 12) {
        CommuteDeltaCard(
            title: "出門 08:00",
            slot: SlotCompare(delta: -4.0, todayApparent: 27.0, yesterdayTemp: 31.0, rainHint: false, hourLabel: "08:00")
        )
        CommuteDeltaCard(
            title: "下班 18:00",
            slot: SlotCompare(delta: 2.5, todayApparent: 30.0, yesterdayTemp: 27.5, rainHint: true, hourLabel: "18:00")
        )
    }
    .padding(16)
    .background(DeltaAtmosphere(state: .neutral))
}
```

---

## Known Issues & Future Work（已知問題與未來工作）

| Issue | Impact | Status |
|-------|--------|--------|
| ⚠️ Emoji not replaced with line icon | Visual inconsistency with design direction | blocked on icon implementation |
| ⚠️ SF Symbol used instead of lucide icon | Design inconsistency, alignment issues | blocked on icon replacement |
| ⚠️ TempDeltaState colors outdated | Colors don't match design direction (2026-08-27) | needs code update (#4A90E2 → #5A7A94, #F5A623 → #E8A44A) |
| ⚠️ Hardcoded opacity values | Not using tokens | easy refactor to `sys-opacity-*` |
| loading state not implemented | Can't show pending data fetch | future enhancement |
| error state not implemented | No fallback UI on API failure | future enhancement |

---

## Color Reference（顏色參考）

When refactoring, use these token values:

```swift
// Current (outdated)
case .cooler: return Color(hex: 0x4A90E2)    // bright blue
case .warmer: return Color(hex: 0xF5A623)    // warm orange

// Updated (per design direction 2026-08-27)
case .cooler: return YWTokens.Color.coldPrimary    // #5A7A94 dusty slate
case .warmer: return YWTokens.Color.warmPrimary    // #E8A44A editorial orange
```
